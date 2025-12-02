'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Grande */}
        <div className="mb-8">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 animate-pulse">
            404
          </h1>
        </div>

        {/* Título */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {t('notFound.title')}
        </h2>

        {/* Descripción */}
        <p className="text-xl text-gray-400 mb-12">
          {t('notFound.description')}
        </p>

        {/* Icono de coche */}
        <div className="mb-12">
          <svg
            className="w-64 h-64 mx-auto text-red-500 opacity-20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t('notFound.goHome')}
          </Link>

          <Link
            href="/cars"
            className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105 border-2 border-gray-700"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            {t('notFound.viewCars')}
          </Link>
        </div>

        {/* Links adicionales */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 mb-4">{t('notFound.helpText')}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/circuits" className="text-red-500 hover:text-red-400 transition-colors">
              {t('nav.circuits')}
            </Link>
            <Link href="/about" className="text-red-500 hover:text-red-400 transition-colors">
              {t('footer.about')}
            </Link>
            <Link href="/contact" className="text-red-500 hover:text-red-400 transition-colors">
              {t('footer.contact')}
            </Link>
            <Link href="/faq" className="text-red-500 hover:text-red-400 transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
