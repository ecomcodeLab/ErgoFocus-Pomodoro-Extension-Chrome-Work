import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { FiSunrise, FiCpu } from 'react-icons/fi';

const Vision = () => {
  return (
    <section id="vision" className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/10 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-xl mb-6 border border-blue-500/20">
            <SafeIcon icon={FiCpu} className="text-2xl text-blue-400" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Bereit für die Zukunft
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Wir arbeiten bereits an der nächsten Generation der Produktivität. Bald verfügbar: <strong className="text-blue-400 font-semibold">Intelligente Pausen-Empfehlungen</strong>, angetrieben durch lokale KI, die lernt, wann du am ehesten eine Pause brauchst.
          </p>
          
          <div className="inline-flex items-center space-x-2 text-sm font-medium text-blue-400 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
            <SafeIcon icon={FiSunrise} />
            <span>Coming Soon</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Vision;