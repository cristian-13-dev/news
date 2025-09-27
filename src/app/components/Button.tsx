import React, { JSX } from "react";
import Close from "./symbols/Close";
import Hamburger from "./symbols/Menu";

interface ButtonProps {
  type: "main" | "secondary" | "hamburger" | "close";
  label?: string | JSX.Element;
}

export default function Button({ type, label }: ButtonProps) {
  const baseClasses = `rounded px-5 py-2 cursor-pointer`;
  let classType;

    if(type === "main") { classType = `${baseClasses} bg-white text-black border-white`} 
    if (type === 'secondary') { classType = `${baseClasses} bg-neutral-900 text-white border border-1 border-neutral-700`}
    if (type === 'close') { label = <Close/>}
    if (type === 'hamburger') { label = <Hamburger/>}
  return <button className={`${classType}`}>{label}</button>;
}
