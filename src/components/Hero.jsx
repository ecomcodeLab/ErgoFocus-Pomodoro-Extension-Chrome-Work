import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { FiChrome, FiGlobe, FiInfo } from 'react-icons/fi';

const PomodoroTooltip = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span 
      className="relative inline-block cursor-help group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="underline decoration-orange-500/50 decoration-2 underline-offset-4 group-hover:decoration-orange-500 transition-colors">
        {children}
      </span>
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 bg-slate-800 border border-orange-500/30 rounded-xl shadow-2xl z-50 text-sm font-normal text-slate-200 text-left pointer-events-none"
          >
            <span className="flex items-center text-orange-400 font-bold mb-1">
              <SafeIcon icon={FiInfo} className="mr-2" />
              Pomodoro-Technik
            </span>
            Fokussiertes Arbeiten in 25-Minuten-Phasen, gefolgt von erholsamen Pausen.
            <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 border-r border-b border-orange-500/30 rotate-45"></span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Produktivität trifft <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-green-400 to-blue-400">
              Wohlbefinden am Bildschirm.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-10">
            Der intelligente <PomodoroTooltip>Pomodoro-Timer</PomodoroTooltip> mit ergonomischen Pausen-Übungen für Chrome & Firefox. 
            Fokussiere dich auf deine Arbeit, wir kümmern uns um deine Gesundheit.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-lg hover:shadow-orange-500/20">
            <SafeIcon icon={FiChrome} className="mr-2 text-xl" />
            Jetzt für Chrome installieren
          </button>
          
          <button disabled className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-slate-700 text-base font-medium rounded-lg text-slate-400 bg-slate-800/50 cursor-not-allowed transition-all">
            <SafeIcon icon={FiGlobe} className="mr-2 text-xl" />
            Firefox (Coming Soon)
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 mx-auto max-w-sm relative"
        >
          <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full"></div>
          <div className="relative rounded-2xl bg-[#161a2b] p-2 shadow-2xl border border-slate-700/50 hover:border-orange-500/30 transition-colors">
            <img 
              src="/ergofocus-extension-popup.png" 
              alt="ErgoFocus Extension" 
              className="w-full h-auto rounded-xl" 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;