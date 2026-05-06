import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Vision from '../components/Vision';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Vision />
      </main>
      <Footer />
    </div>
  );
};

export default Home;