import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { FiClock, FiHeart, FiLock, FiSettings, FiInfo } from 'react-icons/fi';

const features = [
  {
    name: 'Intelligenter Pomodoro-Timer',
    description: 'Anpassbare Timer-Intervalle und Auto-Loop-Funktion für deinen perfekten Workflow ohne Unterbrechungen.',
    icon: FiClock,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  },
  {
    name: 'Ergonomische Gesundheits-Pausen',
    description: 'Sanfte Full-Screen Overlays erinnern dich an kleine Übungen für Augen, Nacken und Rücken.',
    icon: FiHeart,
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  },
  {
    name: '100% Privat & Offline',
    description: 'Deine Daten gehören dir. Alles wird lokal in deinem Browser gespeichert. Keine Cloud, kein Tracking.',
    icon: FiLock,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    name: 'Anpassbare Einstellungen',
    description: 'Konfiguriere Töne, Benachrichtigungen und Pausen-Intervalle genau nach deinen persönlichen Bedürfnissen.',
    icon: FiSettings,
    color: 'text-slate-300',
    bg: 'bg-slate-700/50'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-orange-500 font-semibold tracking-wide uppercase">Warum ErgoFocus?</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Ein besseres Arbeitsgefühl
          </p>
        </div>

        {/* Pomodoro Explanation Card - Top Centered */}
        <div className="max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-orange-500/20 to-slate-800 border border-orange-500/30 rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <SafeIcon icon={FiInfo} className="text-8xl text-orange-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <SafeIcon icon={FiClock} className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-white">Was ist die Pomodoro-Technik?</h3>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed">
                Die Pomodoro-Technik ist eine weltweit bewährte Zeitmanagement-Methode. 
                Dabei arbeitest du in fokussierten <strong>25-Minuten-Intervallen</strong> (ein "Pomodoro"), 
                gefolgt von einer <strong>5-minütigen Pause</strong>. Nach vier Intervallen folgt eine längere Pause. 
                Dies steigert nachweislich die Konzentration und beugt geistiger Erschöpfung vor.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-colors"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-6`}>
                <SafeIcon icon={feature.icon} className={`text-2xl ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.name}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 bg-slate-800/30 rounded-3xl border border-slate-700/50 overflow-hidden flex flex-col lg:flex-row items-center shadow-2xl relative"
        >
          <div className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-4">Gezielte Übungskategorien</h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              Passe deine Pausen an deine individuellen Bedürfnisse an. ErgoFocus bietet dir spezielle Übungen für Vielsitzer.
            </p>
          </div>
          <div className="lg:w-1/2 p-8 lg:p-12 flex justify-center bg-slate-800/50 w-full border-t lg:border-t-0 lg:border-l border-slate-700/50">
            <img 
              src="/ergofocus-extension-pomodoro-ubungen.png" 
              alt="Gezielte Übungskategorien" 
              className="rounded-xl shadow-lg border border-slate-700/80 w-full max-w-md object-contain" 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;