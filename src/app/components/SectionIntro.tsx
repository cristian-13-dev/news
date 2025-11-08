interface SectionIntroProps {
  category: string;
  title: string;
  description: string;
}

export default function SectionIntro({category, title, description}: SectionIntroProps) {
  return <div className="mx-auto flex flex-col gap-5 text-center text-white px-4 md:px-8 xl:px-16 mb-20">
    <span>{category}</span>
    <h1 className="text-5xl">{title}</h1>
    <p>{description}</p>
  </div>
}