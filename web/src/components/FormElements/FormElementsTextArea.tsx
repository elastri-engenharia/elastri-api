import { TextareaHTMLAttributes } from "react";

interface FormElementsTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  text?: string;
}

export default function FormElementsTextArea({
  text,
  ...rest
}: FormElementsTextAreaProps) {
  return (
    <textarea
      {...rest}
      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
    >
      {text}
    </textarea>
  );
}
