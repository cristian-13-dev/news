import Navigation from "./components/Navigation";
import HeroHeaderSection from "@/app/sections/HeroHeaderSection";
import { LatestNewsSection } from "./sections/LatestNewsSection";

export default function Home() {
  return (
    <div>
      <Navigation />
      <HeroHeaderSection />
      <LatestNewsSection/>
    </div>
  );
}
