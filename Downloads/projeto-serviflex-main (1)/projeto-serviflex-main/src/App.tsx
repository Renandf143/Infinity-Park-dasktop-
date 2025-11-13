import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBadges } from './components/TrustBadges';
import { Categories } from './components/Categories';
import { HowItWorks } from './components/HowItWorks';
import { About } from './components/About';
import { Professionals } from './components/Professionals';
import { BrazilMap } from './components/BrazilMap';
import { Stats } from './components/Stats';
import { Footer } from './components/Footer';

export function App() {

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />
      <Hero />
      <TrustBadges />
      <Categories />
      <HowItWorks />
      <BrazilMap />
      <About />
      <Professionals />
      <Stats />
      <Footer />
    </div>
  );
}