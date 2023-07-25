import { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface FormElementsContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function FormElementsContainer({
  children,
  ...rest
}: FormElementsContainerProps) {
  return (
    <div {...rest} className={twMerge("mb-4.5", rest.className)}>
      {children}
    </div>
  );
}
