import { ButtonHTMLAttributes } from "react";

interface FormElementsActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

export default function FormElementsAction({
  title,
  ...rest
}: FormElementsActionProps) {
  return (
    <button
      {...rest}
      className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
    >
      {title}
    </button>
  );
}
