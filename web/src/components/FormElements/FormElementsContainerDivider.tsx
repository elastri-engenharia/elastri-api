import { ReactNode } from "react";

interface FormElementsContainerDivider {
  children: ReactNode;
}

export default function FormElementsContainerDivider({
  children,
}: FormElementsContainerDivider) {
  return <div className="w-full xl:w-1/2">{children}</div>;
}
