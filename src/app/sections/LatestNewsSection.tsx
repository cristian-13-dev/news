import Card from "../components/Card";
import Section from "../components/Section";
import SectionIntro from "../components/SectionIntro";

export const LatestNewsSection = () => {
  return (
    <Section>
      <SectionIntro category="Tech" title="Latest technology insights" description="Discover the most important technological developments" />
      <Card category="Sport"/>
    </Section>
  );
};
