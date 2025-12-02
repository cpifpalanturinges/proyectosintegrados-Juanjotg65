'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-xl text-blue-100">
              Condiciones de uso de GT-TURING
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
          
          <div className="text-center mb-8">
            <p className="text-gray-600 leading-relaxed">
              Última actualización: Diciembre 2025
            </p>
          </div>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Aceptación de Términos</h2>
            <p className="text-gray-600 leading-relaxed">
              Al acceder y utilizar la plataforma GT-TURING, aceptas estar legalmente vinculado por estos Términos y Condiciones. 
              Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Uso del Servicio</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Para utilizar nuestros servicios debes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Tener al menos 21 años de edad</li>
                <li>Poseer una licencia de conducir válida</li>
                <li>Proporcionar información veraz y actualizada</li>
                <li>Mantener la confidencialidad de tu cuenta</li>
                <li>Usar el servicio solo para fines legales</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Reservas y Pagos</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Al realizar una reserva:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Debes proporcionar información de pago válida</li>
                <li>Se realizará un cargo total al confirmar la reserva</li>
                <li>Las reservas están sujetas a disponibilidad</li>
                <li>Recibirás confirmación por email</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Cancelaciones y Reembolsos</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p className="font-semibold">Política de cancelación:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Más de 48 horas: Reembolso completo</li>
                <li>Entre 24-48 horas: 50% de reembolso</li>
                <li>Menos de 24 horas: Sin reembolso</li>
                <li>No presentarse: Sin reembolso</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Responsabilidad del Usuario</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>El usuario es responsable de:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Conducir de manera segura y responsable</li>
                <li>Seguir las normas del circuito</li>
                <li>Usar el equipamiento de seguridad proporcionado</li>
                <li>Cualquier daño causado por mal uso o negligencia</li>
                <li>Cumplir con todas las leyes y regulaciones aplicables</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Seguros y Daños</h2>
            <p className="text-gray-600 leading-relaxed">
              Todos los vehículos cuentan con seguro básico en circuito. El usuario es responsable del pago de un depósito 
              de seguridad reembolsable. Daños por mal uso, negligencia o conducción temeraria no están cubiertos y serán 
              cargados al usuario.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Propiedad Intelectual</h2>
            <p className="text-gray-600 leading-relaxed">
              Todo el contenido de la plataforma GT-TURING, incluidos textos, gráficos, logos, imágenes y software, 
              es propiedad de GT-TURING S.L. y está protegido por las leyes de propiedad intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Limitación de Responsabilidad</h2>
            <p className="text-gray-600 leading-relaxed">
              GT-TURING no será responsable de daños indirectos, incidentales, especiales o consecuentes derivados del uso 
              o la imposibilidad de uso del servicio. La conducción en circuito es una actividad de riesgo que el usuario 
              acepta voluntariamente.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Modificaciones</h2>
            <p className="text-gray-600 leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en 
              vigor inmediatamente después de su publicación. Es responsabilidad del usuario revisar periódicamente estos términos.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Contacto</h2>
            <div className="text-gray-600 leading-relaxed">
              <p className="mb-4">Para cualquier consulta sobre estos Términos y Condiciones:</p>
              <div className="p-6 bg-blue-50 rounded-lg">
                <p><strong>GT-TURING S.L.</strong></p>
                <p>Email: legal@gt-turing.com</p>
                <p>Teléfono: +34 900 123 456</p>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Al utilizar GT-TURING, aceptas estos Términos y Condiciones en su totalidad.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
