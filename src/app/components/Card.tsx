import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

interface CardProps {
  category: string;
}

export default function Card({ category }: CardProps) {
  return (
    <div className="max-w-sm border border-[var(--neutral-darker)] rounded-xl">
      <Link href="#" className="relative block h-56">
        <Image
          className="rounded-t-xl object-cover border-b border-[var(--neutral-darker)]"
          src="/docs/images/blog/image-1.jpg"
          alt=""
          fill
        />
      </Link>
      <div className="flex flex-col gap-1 p-6 bg-[var(--neutral-darker)] rounded-b-xl">
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
          <Button type="text" size='small' label="Explore" />
        </div>
      </div>
    </div>
  );
}
