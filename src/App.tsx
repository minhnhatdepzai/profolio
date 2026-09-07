import { useEffect, useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { Navigation } from './components/Navigation';
import { ThreeWorld } from './components/ThreeWorld';
import { ScrollExperience } from './components/ScrollExperience';
import { Cursor } from './components/Cursor';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Experience } from './sections/Experience';
import { Skills } from './sections/Skills';
import { Projects } from './sections/Projects';
import { Archive } from './sections/Archive';
import { Footer } from './sections/Footer';
import { GardenCompanions } from './components/GardenCompanions';
import { GardenControl } from './components/GardenControl';

export default function App() {
  const [gardenPaused, setGardenPaused] = useState(() => {
    try { return localStorage.getItem('portfolio_garden_paused') === 'true'; }
    catch { return false; }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('garden-is-paused', gardenPaused);
    try { localStorage.setItem('portfolio_garden_paused', String(gardenPaused)); } catch { /* The garden works without storage. */ }
    return () => document.documentElement.classList.remove('garden-is-paused');
  }, [gardenPaused]);
  return (
    <LanguageProvider>
      <ScrollExperience />
      <Cursor />
      <ThreeWorld paused={gardenPaused} />
      <GardenCompanions paused={gardenPaused} />
      <GardenControl paused={gardenPaused} onToggle={() => setGardenPaused(value => !value)} />
      <a className="skip-link" href="#selected-work">Skip to selected work</a>
      <div className="scroll-progress" aria-hidden="true"><span className="scroll-progress__bar" /></div>
      <Navigation />
      <main className="site-shell">
        <Hero gardenPaused={gardenPaused} />
        <About gardenPaused={gardenPaused} />
        <Projects />
        <Skills />
        <Experience />
        <Archive />
      </main>
      <Footer gardenPaused={gardenPaused} />
    </LanguageProvider>
  );
}
