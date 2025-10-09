'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">GT</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              GT-TURING
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/cars" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              {t('nav.cars')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/circuits" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              {t('nav.circuits')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                >
                  {t('nav.dashboard')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                  >
                    {t('nav.admin')}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
                
                {/* Language Selector */}
                <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
                  <button
                    onClick={() => setLanguage('es')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                      language === 'es'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    🇪🇸 ES
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                      language === 'en'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <div className="text-gray-900 font-medium">{user?.firstName}</div>
                    <div className="text-gray-500 text-xs">{user?.role}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Language Selector for non-authenticated users */}
                <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
                  <button
                    onClick={() => setLanguage('es')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                      language === 'es'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    🇪🇸 ES
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                      language === 'en'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                </div>
                
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link href="/cars" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
                {t('nav.cars')}
              </Link>
              <Link href="/circuits" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
                {t('nav.circuits')}
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
                    {t('nav.dashboard')}
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
                      {t('nav.admin')}
                    </Link>
                  )}
                  <button onClick={logout} className="text-red-600 hover:text-red-700 font-medium text-left py-2">
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
                    {t('nav.login')}
                  </Link>
                  <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center">
                    {t('nav.register')}
                  </Link>
                </>
              )}
              
              {/* Language Selector Mobile */}
              <div className="flex space-x-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setLanguage('es')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 ${
                    language === 'es'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'text-gray-600 bg-gray-100'
                  }`}
                >
                  🇪🇸 Español
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 ${
                    language === 'en'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'text-gray-600 bg-gray-100'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
