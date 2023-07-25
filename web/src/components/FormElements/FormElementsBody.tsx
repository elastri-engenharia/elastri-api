import { FormHTMLAttributes, ReactNode } from "react";

interface FormElementsBodyProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export default function FormElementsBody({
  children,
  ...rest
}: FormElementsBodyProps) {
  return (
    <form {...rest}>
      <div className="p-6.5">{children}</div>
    </form>
  );
}
