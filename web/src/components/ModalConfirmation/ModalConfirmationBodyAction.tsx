import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ModalConfirmationBodyActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export function ModalConfirmationBodyAction({
  text,
  ...rest
}: ModalConfirmationBodyActionProps) {
  return (
    <button
      {...rest}
      className={twMerge(
        "rounded-sm p-2 text-xl font-semibold text-black dark:text-white",
        rest.className
      )}
    >
      {text}
    </button>
  );
}
