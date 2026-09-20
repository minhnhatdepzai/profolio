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
import { BrandExperience } from './components/BrandExperience';
import { Lab } from './sections/Lab';
import { AuraEdge } from './components/AuraEdge';
import { useTimePalette } from './components/useTimePalette';

export default function App() {
  const garden = useGardenActivity();
  const gardenPaused = !garden.running;
  // One clock drives the edge glow, the lab scene and the page's CSS tokens.
  const palette = useTimePalette();
  const ambientSuspended = garden.mode === 'pause' || garden.phase === 'hidden';
  return (
    <LanguageProvider>
      <BrandExperience>
        <ScrollExperience />
        <AuraEdge palette={palette.aura} suspended={ambientSuspended || !garden.motionAllowed} />
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
          <Lab palette={palette} motionAllowed={garden.motionAllowed} suspended={ambientSuspended} />
          <Experience />
          <Archive />
        </main>
        <Footer gardenPaused={gardenPaused} motionAllowed={garden.motionAllowed} />
      </BrandExperience>
    </LanguageProvider>
  );
}
