import { TextareaHTMLAttributes } from "react";

interface FormElementsTextAreaDisabledProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  text?: string;
}

export default function FormElementsTextAreaDisabled({
  text,
  ...rest
}: FormElementsTextAreaDisabledProps) {
  return (
    <textarea
      {...rest}
      disabled
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:disabled:bg-black"
    >
      {text}
    </textarea>
  );
}
