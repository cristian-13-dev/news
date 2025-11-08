import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

interface CardProps {
  category: string;
  image?: "top" | "left" | "right" | "none";
}

export default function Card({ image = "right", category }: CardProps) {
  const Content = (
    <div className="flex flex-col gap-1 p-6 bg-[var(--neutral-darker)]">
      <span className="text-white font-bold text-xs">{category}</span>
      <h5 className="mb-2 text-3xl tracking-tight text-gray-900 dark:text-white">
        <Link href={""}>Noteworthy technology acquisitions 2021</Link>
      </h5>

      <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">
        Here are the biggest enterprise technology acquisitions of 2021 so
        far, in reverse chronological order.
      </p>
      <div className="flex gap-2">
        <Button type="secondary" size="small" label="Learn" />
        <Button type="text" size="small" label="Explore" />
      </div>
    </div>
  );

  if (image === "none") {
    return (
      <div className="max-w-sm border border-[var(--neutral-darker)] rounded-xl overflow-hidden">
        {Content}
      </div>
    );
  }

  if (image === "top") {
    return (
      <div className="max-w-sm border border-[var(--neutral-darker)] rounded-xl overflow-hidden">
        <Link href="#" className="relative block h-56">
          <Image
            className="rounded-t-xl object-cover border-b border-[var(--neutral-darker)]"
            src="/docs/images/blog/image-1.jpg"
            alt=""
            fill
          />
        </Link>
        <div className="rounded-b-xl">{Content}</div>
      </div>
    );
  }

  const containerClass = image === "left" || image === "right" ? "max-w-md" : "max-w-sm";

  const imageNode = (
    <Link href="#" className="relative block w-48 h-48 sm:w-40 sm:h-40 flex-shrink-0">
      <Image className="object-cover" src="/docs/images/blog/image-1.jpg" alt="" fill />
    </Link>
  );

  return (
    <div className={`${containerClass} border border-[var(--neutral-darker)] rounded-xl overflow-hidden`}>
      <div className={`flex ${image === "left" ? "flex-row" : "flex-row-reverse"} items-stretch gap-4`}>

        <div className={`${image === "left" ? "rounded-l-xl overflow-hidden" : "rounded-r-xl overflow-hidden"}`}>
          {imageNode}
        </div>
        <div className={`flex-1 min-w-0 ${image === "left" ? "rounded-r-xl" : "rounded-l-xl"} overflow-hidden`}>
          {Content}
        </div>
      </div>
    </div>
  );
}
