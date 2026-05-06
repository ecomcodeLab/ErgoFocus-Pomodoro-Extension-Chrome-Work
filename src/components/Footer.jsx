import React from 'react';
import SafeIcon from '../common/SafeIcon';
import { FiGithub } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <img 
              src="/ErgoFocus-Icon.png" 
              alt="Logo" 
              className="w-6 h-6 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-lg font-bold text-white tracking-tight">
              Ergo<span className="text-orange-500">Focus</span>
            </span>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <Link to="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
            <span className="text-slate-600">|</span>
            <span className="cursor-default">Keine Cookies verwendet</span>
          </div>

          {/* Social & Copyright */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="flex items-center space-x-4 text-slate-400">
              <a 
                href="https://github.com/ecomcodeLab" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <SafeIcon icon={FiGithub} className="text-lg" />
                <span className="text-sm">ecomcodeLab</span>
              </a>
            </div>
            <div className="text-slate-500 text-[10px] uppercase tracking-widest">
              &copy; {new Date().getFullYear()} ErgoFocus
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;