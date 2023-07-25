import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface SwitcherTwoProps {
  registers: any;
  identify: string;
}

export default function SwitcherTwo({ registers, identify }: SwitcherTwoProps) {
  const { register } = useFormContext();
  const [enabled, setEnabled] = useState(false);

  return (
    <div x-data="{ switcherToggle: false }">
      <label
        htmlFor={identify}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            {...register(registers)}
            id={identify}
            type="checkbox"
            className="sr-only"
            onChange={() => {
              setEnabled(!enabled);
            }}
          />
          <div className="h-5 w-14 rounded-full bg-meta-9 shadow-inner dark:bg-[#5A616B]"></div>
          <div
            className={`dot absolute -top-1 left-0 h-7 w-7 rounded-full bg-white shadow-switch-1 transition ${
              enabled && "!right-0 !translate-x-full !bg-primary dark:!bg-white"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
}
