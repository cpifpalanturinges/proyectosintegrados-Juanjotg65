using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace gt_turing_backend.Controllers
{
    /// <summary>
    /// Upload Controller for handling file uploads
    /// Controlador de subida de archivos
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<UploadController> _logger;

        public UploadController(IWebHostEnvironment environment, ILogger<UploadController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        /// <summary>
        /// Upload image file
        /// </summary>
        [HttpPost("image")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] string? fileName = null)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file uploaded" });
                }

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new { message = "Invalid file type. Only images are allowed." });
                }

                // Validate file size (max 5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { message = "File size exceeds 5MB limit" });
                }

                // Create images directory if it doesn't exist
                var imagesPath = Path.Combine(_environment.WebRootPath, "images");
                if (!Directory.Exists(imagesPath))
                {
                    Directory.CreateDirectory(imagesPath);
                }

                // Generate filename
                var finalFileName = string.IsNullOrWhiteSpace(fileName) 
                    ? $"{Guid.NewGuid()}{extension}" 
                    : $"{SanitizeFileName(fileName)}{extension}";

                var filePath = Path.Combine(imagesPath, finalFileName);

                // Delete old file if it exists (for updates)
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var imageUrl = $"/images/{finalFileName}";
                
                _logger.LogInformation($"Image uploaded successfully: {imageUrl}");

                return Ok(new { imageUrl, fileName = finalFileName });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image");
                return StatusCode(500, new { message = "An error occurred while uploading the file", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete image file
        /// </summary>
        [HttpDelete("image")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public IActionResult DeleteImage([FromQuery] string imageUrl)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(imageUrl))
                {
                    return BadRequest(new { message = "Image URL is required" });
                }

                // Extract filename from URL
                var fileName = imageUrl.Replace("/images/", "");
                var imagesPath = Path.Combine(_environment.WebRootPath, "images");
                var filePath = Path.Combine(imagesPath, fileName);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    _logger.LogInformation($"Image deleted successfully: {imageUrl}");
                    return Ok(new { message = "Image deleted successfully" });
                }

                return NotFound(new { message = "Image not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting image");
                return StatusCode(500, new { message = "An error occurred while deleting the file", error = ex.Message });
            }
        }

        private string SanitizeFileName(string fileName)
        {
            // Remove invalid characters and spaces
            var invalidChars = Path.GetInvalidFileNameChars();
            var sanitized = string.Join("_", fileName.Split(invalidChars, StringSplitOptions.RemoveEmptyEntries));
            sanitized = sanitized.Replace(" ", "_");
            
            // Remove extension if present
            var extensionIndex = sanitized.LastIndexOf('.');
            if (extensionIndex > 0)
            {
                sanitized = sanitized.Substring(0, extensionIndex);
            }

            return sanitized;
        }
    }
}
