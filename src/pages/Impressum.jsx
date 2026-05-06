import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const Impressum = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8 border-b border-slate-800 pb-4">Impressum</h1>
          
          <section className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-orange-400 mb-4">Angaben gemäß § 5 TMG</h2>
              <p className="text-lg">
                Billy Kittler<br />
                Demminer Straße 17<br />
                13059 Berlin
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-orange-400 mb-4">Kontakt</h2>
              <p className="text-lg">
                Telefon: +49 176 91397228<br />
                E-Mail: ecomcodelab@gmail.com
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-orange-400 mb-4">Redaktionell verantwortlich</h2>
              <p className="text-lg">
                Billy Kittler<br />
                Demminer Straße 17<br />
                13059 Berlin
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-orange-400 mb-4">EU-Streitbeilegung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
                  https://ec.europa.eu/consumers/odr/
                </a>.
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-orange-400 mb-4">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Impressum;