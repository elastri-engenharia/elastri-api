import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface SwitcherFourProps {
  registers: any;
  identify: string;
}

export default function SwitcherFour({
  registers,
  identify,
}: SwitcherFourProps) {
  const { register } = useFormContext();
  const [enabled, setEnabled] = useState<boolean>(false);

  return (
    <div>
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
          <div className="block h-8 w-14 rounded-full bg-black"></div>
          <div
            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
              enabled && "!right-1 !translate-x-full"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
}
