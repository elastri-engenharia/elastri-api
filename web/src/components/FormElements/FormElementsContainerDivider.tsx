import { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface FormElementsContainerDivider extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function FormElementsContainerDivider({
  children,
  ...rest
}: FormElementsContainerDivider) {
  return (
    <div className={twMerge("w-full xl:w-1/2", rest.className)}>{children}</div>
  );
}
