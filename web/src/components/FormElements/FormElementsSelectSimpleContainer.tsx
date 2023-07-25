import { ElementType, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { HiChevronDown } from "react-icons/hi2";

interface FormElementsSelectSimpleContainer {
  icon: ElementType;
  registers: string;
  children: ReactNode;
}

export default function FormElementsSelectSimpleContainer({
  icon: Icon,
  registers,
  children,
}: FormElementsSelectSimpleContainer) {
  const { register } = useFormContext();
  return (
    <div className="relative z-20 bg-white dark:bg-form-input">
      <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
        <Icon className="h-5 w-5" />
      </span>
      <select
        {...register(registers)}
        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
      >
        {children}
      </select>
      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
        <HiChevronDown className="h-6 w-6" />
      </span>
    </div>
  );
}
