import React, { JSX } from "react";
import Close from "./symbols/Close";
import Hamburger from "./symbols/Menu";
import ArrowRight from "./symbols/ArrowRight";

interface ButtonProps {
  type: "main" | "secondary" | "hamburger" | "close" | "text";
  label?: string | JSX.Element;
  size?: "small" | "medium" | "large";
}

export default function Button({ type, label, size }: ButtonProps) {
  const baseClasses = `rounded ${size==='small' && 'text-sm'} cursor-pointer font-semibold`;
  let classType;

    if(type === "main") { classType = `${baseClasses} bg-white text-black border-white px-5 py-2`} 
    if (type === 'secondary') { classType = `${baseClasses} bg-neutral-900 text-white border border-1 border-neutral-700 px-5 py-2`}
    if (type === 'close') { label = <Close/>}
    if (type === 'hamburger') { label = <Hamburger/>}
    if (type === 'text') { classType = `${baseClasses} text-white mx-5 my-2 flex items-center justify-center` } 
  return <button className={`${classType}`}>{label} {type === 'text' && <ArrowRight/>}</button>;
}
