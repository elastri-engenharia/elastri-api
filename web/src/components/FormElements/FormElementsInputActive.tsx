import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface FormElementsInputsActiveProps
  extends InputHTMLAttributes<HTMLInputElement> {
  registers: string;
}

export default function FormElementsInputsActive({
  registers,
  ...rest
}: FormElementsInputsActiveProps) {
  const { register } = useFormContext();
  return (
    <input
      {...rest}
      {...register(registers)}
      className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
    />
  );
}
