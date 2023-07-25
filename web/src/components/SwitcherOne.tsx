import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface SwitcherOneProps {
  registers: any;
  identify: string;
}

export default function SwitcherOne({ registers, identify }: SwitcherOneProps) {
  const { register } = useFormContext();

  const [enabled, setEnabled] = useState<boolean>(false);

  return (
    <div className="align-center flex justify-center py-2.5">
      <label
        htmlFor={identify}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            {...register(registers)}
            type="checkbox"
            id={identify}
            className="sr-only"
            onChange={() => {
              setEnabled(!enabled);
            }}
          />
          <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
          <div
            className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
              enabled && "!right-1 !translate-x-full !bg-primary dark:!bg-white"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
}
