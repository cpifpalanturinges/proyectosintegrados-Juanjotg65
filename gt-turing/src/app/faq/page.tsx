'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: { [key: string]: FAQItem[] } = {
  es: [
    {
      question: '¿Cómo puedo reservar un vehículo?',
      answer: 'Para reservar un vehículo, inicia sesión en tu cuenta, navega a la sección de "Vehículos", selecciona el coche que deseas y haz clic en "Reservar". Elige el circuito, fecha y hora, y confirma tu reserva.'
    },
    {
      question: '¿Puedo cancelar o modificar mi reserva?',
      answer: 'Sí, puedes cancelar o modificar tu reserva desde la sección "Mis Reservas" hasta 24 horas antes de la fecha programada. Las cancelaciones realizadas con menos de 24 horas de antelación no son reembolsables.'
    },
    {
      question: '¿Qué documentación necesito para conducir?',
      answer: 'Necesitas un carnet de conducir válido y tener al menos 21 años. Para algunos vehículos deportivos de alta gama, puede requerirse experiencia de conducción adicional.'
    },
    {
      question: '¿Los precios incluyen seguro?',
      answer: 'Sí, todas nuestras tarifas incluyen seguro a todo riesgo. Sin embargo, aplica una franquicia en caso de daños. También ofrecemos seguros premium con franquicia reducida.'
    },
    {
      question: '¿Ofrecen formación o instructores?',
      answer: 'Sí, ofrecemos sesiones de formación con instructores profesionales. Puedes añadir este servicio al hacer tu reserva. Es obligatorio para conductores sin experiencia en circuitos.'
    },
    {
      question: '¿Qué circuitos están disponibles?',
      answer: 'Operamos en varios circuitos de prestigio en España. Consulta la sección "Circuitos" para ver todas las ubicaciones disponibles, características y horarios.'
    },
    {
      question: '¿Cómo funcionan los pagos?',
      answer: 'Aceptamos tarjetas de crédito/débito y transferencias bancarias. El pago se realiza al confirmar la reserva. Emitimos factura electrónica automáticamente.'
    },
    {
      question: '¿Qué pasa si llueve el día de mi reserva?',
      answer: 'Las experiencias se realizan bajo cualquier condición meteorológica, siempre que sea seguro. Si las condiciones son extremas, te ofreceremos reprogramar sin coste adicional.'
    },
    {
      question: '¿Puedo llevar acompañantes?',
      answer: 'Depende del vehículo y el tipo de experiencia. Algunos coches permiten un acompañante. Consulta los detalles específicos de cada vehículo en su ficha.'
    },
    {
      question: '¿Ofrecen experiencias como regalo?',
      answer: 'Sí, ofrecemos bonos regalo válidos por 12 meses. Contacta con nuestro servicio de atención al cliente para adquirir un bono regalo personalizado.'
    }
  ],
  en: [
    {
      question: 'How can I book a vehicle?',
      answer: 'To book a vehicle, log in to your account, navigate to the "Cars" section, select the car you want and click "Book". Choose the circuit, date and time, and confirm your booking.'
    },
    {
      question: 'Can I cancel or modify my booking?',
      answer: 'Yes, you can cancel or modify your booking from the "My Reservations" section up to 24 hours before the scheduled date. Cancellations made less than 24 hours in advance are non-refundable.'
    },
    {
      question: 'What documentation do I need to drive?',
      answer: 'You need a valid driver\'s license and must be at least 21 years old. For some high-end sports vehicles, additional driving experience may be required.'
    },
    {
      question: 'Do prices include insurance?',
      answer: 'Yes, all our rates include comprehensive insurance. However, a deductible applies in case of damage. We also offer premium insurance with reduced deductible.'
    },
    {
      question: 'Do you offer training or instructors?',
      answer: 'Yes, we offer training sessions with professional instructors. You can add this service when making your booking. It is mandatory for drivers without track experience.'
    },
    {
      question: 'What circuits are available?',
      answer: 'We operate at several prestigious circuits in Spain. Check the "Circuits" section to see all available locations, features and schedules.'
    },
    {
      question: 'How do payments work?',
      answer: 'We accept credit/debit cards and bank transfers. Payment is made when confirming the booking. We automatically issue an electronic invoice.'
    },
    {
      question: 'What happens if it rains on my booking day?',
      answer: 'Experiences take place in any weather conditions, as long as it is safe. If conditions are extreme, we will offer to reschedule at no additional cost.'
    },
    {
      question: 'Can I bring passengers?',
      answer: 'It depends on the vehicle and type of experience. Some cars allow one passenger. Check the specific details of each vehicle on its information page.'
    },
    {
      question: 'Do you offer gift experiences?',
      answer: 'Yes, we offer gift vouchers valid for 12 months. Contact our customer service to purchase a personalized gift voucher.'
    }
  ]
};

export default function FAQPage() {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const currentFaqs = faqs[language];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('faq.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {currentFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-8">
                  {faq.question}
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            {t('faq.notFound')}
          </h2>
          <p className="mb-6">
            {t('faq.notFoundSub')}
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('faq.contactUs')}
          </a>
        </div>
      </div>
    </div>
  );
}
