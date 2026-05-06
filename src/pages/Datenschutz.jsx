import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const Datenschutz = () => {
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
          <h1 className="text-4xl font-bold text-white mb-8 border-b border-slate-800 pb-4">Datenschutzerklärung</h1>
          
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 mb-8">
            <h2 className="text-orange-400 font-bold mb-2">Wichtiger Hinweis zur Privatsphäre:</h2>
            <p className="text-slate-300">
              Diese Webseite ist darauf ausgelegt, Ihre Privatsphäre maximal zu schützen. 
              <strong> Wir verwenden keine Cookies</strong> und binden keine externen Schriftarten (wie Google Fonts) direkt von fremden Servern ein. 
              Alle Ressourcen werden lokal von unserem Server geladen.
            </p>
          </div>

          <section className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">1. Datenschutz auf einen Blick</h2>
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">2. Verantwortliche Stelle</h2>
              <p>
                Billy Kittler<br />
                Demminer Straße 17<br />
                13059 Berlin<br />
                E-Mail: ecomcodelab@gmail.com
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">3. Datenerfassung auf dieser Website</h2>
              <p className="mb-4">
                <strong>Cookies:</strong> Unsere Website verwendet keine Cookies. Es werden keine Tracker oder Analyse-Tools eingesetzt, die Informationen auf Ihrem Endgerät speichern.
              </p>
              <p className="mb-4">
                <strong>Server-Log-Dateien:</strong> Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp/Version, Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.
              </p>
              <p>
                <strong>Schriftarten:</strong> Wir nutzen lokal gehostete Schriftarten (@fontsource). Es findet keine Verbindung zu Google-Servern statt.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">4. Ihre Rechte</h2>
              <p>
                Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
              </p>
            </div>
          </section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Datenschutz;