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
import { GardenWildlife } from './components/GardenWildlife';
import { useGardenActivity } from './components/useGardenActivity';

export default function App() {
  const garden = useGardenActivity();
  const gardenPaused = !garden.running;
  return (
    <LanguageProvider>
      <ScrollExperience />
      <Cursor />
      <ThreeWorld paused={gardenPaused} motionAllowed={garden.motionAllowed} />
      <GardenCompanions paused={gardenPaused} motionAllowed={garden.motionAllowed} suspended={garden.mode === 'pause' || garden.phase === 'hidden'} />
      <GardenWildlife paused={gardenPaused} motionAllowed={garden.motionAllowed} />
      <GardenControl mode={garden.mode} phase={garden.phase} onToggle={garden.toggle} onAuto={garden.enableAuto} />
      <a className="skip-link" href="#selected-work">Skip to selected work</a>
      <div className="scroll-progress" aria-hidden="true"><span className="scroll-progress__bar" /></div>
      <Navigation />
      <main className="site-shell">
        <Hero gardenPaused={gardenPaused} motionAllowed={garden.motionAllowed} />
        <About gardenPaused={gardenPaused} motionAllowed={garden.motionAllowed} />
        <Projects />
        <Skills />
        <Experience />
        <Archive />
      </main>
      <Footer gardenPaused={gardenPaused} motionAllowed={garden.motionAllowed} />
    </LanguageProvider>
  );
}
