import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface FormElementsInputsProps
  extends InputHTMLAttributes<HTMLInputElement> {
  registers: any;
  isResponseError: boolean;
  responseError: any;
}

export default function FormElementsInputs({
  registers,
  isResponseError,
  responseError,
  ...rest
}: FormElementsInputsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <input
        {...rest}
        {...register(registers)}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
      {isResponseError ? (
        <span className="text-xs text-danger">
          {responseError?.response.data.message}
        </span>
      ) : (
        errors[registers] && (
          <span className="text-xs text-danger">
            {errors[registers]?.message}
          </span>
        )
      )}
    </>
  );
}
