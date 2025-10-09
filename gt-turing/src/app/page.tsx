'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in-down">
              {t('home.hero.title1')}{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {t('home.hero.title2')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link 
                href="/cars" 
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-xl overflow-hidden shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  {t('home.hero.cta1')}
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link 
                href="/circuits" 
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
              >
                {t('home.hero.cta2')}
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {[
              { label: t('home.stats.cars'), value: '15+', icon: '🏎️' },
              { label: t('home.stats.circuits'), value: '8+', icon: '🏁' },
              { label: t('home.stats.clients'), value: '500+', icon: '👥' },
              { label: t('home.stats.rating'), value: '5★', icon: '⭐' },
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Coches de Alto Rendimiento',
                description: 'Accede a una flota exclusiva de coches de competición, drift e híbridos. Desde GT-R hasta Ferrari 488.',
                gradient: 'from-orange-500 to-red-600',
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Circuitos Españoles',
                description: 'Conduce en los mejores circuitos de España: Barcelona-Catalunya, Jerez, Motorland Aragón y más.',
                gradient: 'from-blue-500 to-blue-700',
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Reserva Fácil y Segura',
                description: 'Sistema de reservas online sencillo, pago seguro y confirmación instantánea. ¡En minutos!',
                gradient: 'from-green-500 to-emerald-600',
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full filter blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className={`relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl text-white mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="relative text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="relative text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cómo Funciona
            </h2>
            <p className="text-xl text-gray-600">
              Tu experiencia en 4 simples pasos
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Elige tu Coche', icon: '🏎️', description: 'Selecciona de nuestra flota premium' },
              { step: '2', title: 'Selecciona Circuito', icon: '🏁', description: 'Elige el circuito perfecto' },
              { step: '3', title: 'Reserva Online', icon: '📱', description: 'Pago seguro y confirmación instantánea' },
              { step: '4', title: '¡A Conducir!', icon: '🎉', description: 'Vive la adrenalina pura' },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.step}
                  </div>
                  <div className="text-5xl mb-4 mt-4">{step.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-blue-300">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
            ¿Listo para la Experiencia de tu Vida?
          </h2>
          <p className="text-xl text-blue-100 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Únete a cientos de conductores que ya han vivido la emoción
          </p>
          {!isAuthenticated && (
            <Link 
              href="/register" 
              className="inline-flex items-center px-10 py-4 text-lg font-bold text-blue-600 bg-white rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              Crear Cuenta Gratis
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
