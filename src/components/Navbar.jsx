import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: isHome ? '#features' : '/#features' },
    { name: 'How it Works', href: isHome ? '#how-it-works' : '/#how-it-works' },
    { name: 'Vision', href: isHome ? '#vision' : '/#vision' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/ErgoFocus-Icon.png" 
              alt="Logo" 
              className="w-8 h-8 object-contain transition-transform group-hover:scale-110"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-xl font-bold text-white tracking-tight">
              Ergo<span className="text-orange-500">Focus</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-orange-500 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(234,88,12,0.4)]">
              Jetzt Installieren
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;