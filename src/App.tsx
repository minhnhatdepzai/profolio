/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { DesktopNav, MobileNav } from './components/Navigation';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Experience } from './sections/Experience';
import { Education } from './sections/Education';
import { Projects } from './sections/Projects';
import { Awards } from './sections/Awards';
import { Footer } from './sections/Footer';

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen font-sans selection:bg-blue-500/30 selection:text-white">
        <DesktopNav />
        <MobileNav />
        
        <main>
          <Hero />
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <About />
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <Experience />
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <Education />
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <Skills />
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <Projects />
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <Awards />
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  );
}
