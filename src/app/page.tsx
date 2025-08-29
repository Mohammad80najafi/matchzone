// app/page.tsx  ← Server Component
import Navbar from '@/components/navbar/Navbar';
import Hero from '@/components/home/Hero';
import FriendsOnline from '@/components/home/FriendsOnline';
import FeatureCards from '@/components/home/FeatureCards';
import QuickMatchWithResults from '@/components/home/QuickMatchWithResults';
import LobbiesCarousel from '@/components/home/LobbiesCarousel';
import StoreCarousel from '@/components/home/StoreCarousel';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <FriendsOnline />
      <FeatureCards />
      {/* کل تعاملات جست‌وجو داخل اینWrapper انجام می‌شود */}
      <QuickMatchWithResults />
      <LobbiesCarousel />
      <StoreCarousel />
      <Footer />
    </>
  );
}
