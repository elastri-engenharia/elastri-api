import { TextareaHTMLAttributes } from "react";

interface FormElementsTextAreaActiveProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  text?: string;
}

export default function FormElementsTextAreaActive({
  text,
  ...rest
}: FormElementsTextAreaActiveProps) {
  return (
    <textarea
      {...rest}
      className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
    >
      {text}
    </textarea>
  );
}
