// src/app/page.tsx
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsStrip from '@/components/StatsStrip';
import DemoGrid from '@/components/DemoGrid';
import Footer from '@/components/Footer';
import ScrollTopButton from '@/components/ScrollTopButton';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatsStrip />
      <DemoGrid />
      <Footer />
      <ScrollTopButton />
    </>
  );
}
