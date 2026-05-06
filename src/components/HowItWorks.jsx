import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { FiDownload, FiSliders, FiPlayCircle } from 'react-icons/fi';

const steps = [
  {
    id: 1,
    title: 'Installieren',
    description: 'Füge ErgoFocus mit einem Klick kostenlos zu deinem Browser hinzu.',
    icon: FiDownload,
  },
  {
    id: 2,
    title: 'Einstellungen anpassen',
    description: 'Wähle deine bevorzugten Timer-Längen und lege fest, wie oft du an Pausen erinnert werden möchtest.',
    icon: FiSliders,
  },
  {
    id: 3,
    title: 'Timer starten & Pausen genießen',
    description: 'Arbeite fokussiert und nutze die geführten Pausen, um neue Energie zu tanken.',
    icon: FiPlayCircle,
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-slate-900 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white">So einfach funktioniert's</h2>
          <p className="mt-4 text-xl text-slate-400">In drei Schritten zu einem gesünderen Arbeitsalltag.</p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-800 w-2/3 mx-auto -z-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto bg-slate-800 border-4 border-slate-900 rounded-full flex items-center justify-center relative shadow-xl">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/20 to-blue-500/20 animate-pulse-slow"></div>
                  <SafeIcon icon={step.icon} className="text-3xl text-white relative z-10" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold border-4 border-slate-900">
                    {step.id}
                  </div>
                </div>
                <h3 className="mt-8 text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;