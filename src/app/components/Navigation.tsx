import Logo from "./Logo";
import Button from "./Button";
import ArrowDown from "./symbols/ArrowDown";

export default function Navigation() {
  return (
    <div className="w-full border-b border-[var(--neutral-darker)] bg-black">
      <nav className="flex px-4 md:px-8 xl:px-16 h-19 items-center justify-between container mx-auto bg-black">
        <div className="flex gap-7 items-center">
          <Logo />

          {/* prettier-ignore */}
          <ul className="hidden xl:flex gap-6 text-white">
            <li><a href="#">News</a></li>
            <li><a href="#">Reviews</a></li>
            <li><a href="#">Comparisons</a></li>
            <div className="flex cursor-pointer">
            <li><a href="#">Categories</a></li>
            <ArrowDown/>
            </div>
            <li><a href="#">About</a></li>
          </ul>
        </div>

        <div className="hidden xl:flex gap-2">
          <Button type="secondary" label="Subscribe" />
          <Button type="main" label="Explore" />
        </div>

        <div className="flex xl:hidden">
          <Button type="hamburger" />
        </div>
      </nav>
    </div>
  );
}
