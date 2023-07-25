import { ElementType, HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ModalConfirmationHeadProps
  extends HTMLAttributes<HTMLParagraphElement> {
  icon: ElementType;
  children: ReactNode;
}

export function ModalConfirmationHead({
  children,
  icon: Icon,
  ...rest
}: ModalConfirmationHeadProps) {
  return (
    <div className="flex w-3/4 flex-col items-center gap-2 p-4">
      <Icon {...rest} className={twMerge("h-10 w-10", rest.className)} />
      {children}
    </div>
  );
}
