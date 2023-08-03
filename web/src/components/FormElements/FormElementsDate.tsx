import { useFormContext } from "react-hook-form";

export interface FormElementsDateProps {
  registers: any;
}

export default function FormElementsDate({ registers }: FormElementsDateProps) {
  const { register } = useFormContext();
  return (
    <input
      type="date"
      {...register(registers)}
      className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
    />
  );
}
