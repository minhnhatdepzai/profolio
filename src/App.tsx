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

export default function App() {
  return (
    <LanguageProvider>
      <ScrollExperience />
      <Cursor />
      <ThreeWorld />
      <a className="skip-link" href="#selected-work">Skip to selected work</a>
      <div className="scroll-progress" aria-hidden="true"><span className="scroll-progress__bar" /></div>
      <Navigation />
      <main className="site-shell">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Archive />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
