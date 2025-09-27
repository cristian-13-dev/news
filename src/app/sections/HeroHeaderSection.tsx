import Section from "../components/Section";
import Button from "@/app/components/Button";
import Video from "@/app/components/Video";

export const HeroHeaderSection = () => {
  return (
    <Section className="flex flex-col gap-10 xl:gap-20">
      <header className="flex flex-col gap-8 items-center" aria-labelledby="hero-title">
        <div className="flex flex-col gap-6 items-center">
          <h1 id="hero-title" className="text-white text-5xl max-w-2xl text-center leading-14">
            Technology&apos;s edge cuts through the digital noise
          </h1>
          <p className="text-white max-w-2xl text-center">
            We track the pulse of innovation with razor-sharp precision. Our reporting strips technology down to its essential truth.
          </p>
        </div>

        <nav className="flex justify-center gap-4" aria-label="Hero actions">
          <Button type="main" label="Explore" />
          <Button type="secondary" label="Connect" />
        </nav>
      </header>

      <figure>
        <Video source="https://www.youtube.com/watch?v=G0cmfY7qdmY" />
        <figcaption className="sr-only">
          A short looped hero video showcasing technology and innovation.
        </figcaption>
      </figure>
    </Section>
  );
};

export default HeroHeaderSection;