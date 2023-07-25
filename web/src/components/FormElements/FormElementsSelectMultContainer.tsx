import { ReactNode, useState } from "react";
import { HiChevronDown, HiXMark } from "react-icons/hi2";

interface FormElementsSelectMultContainerProps {
  text: { value: string }[];
  children: ReactNode;
}

export default function FormElementsSelectMultContainer({
  text,
  children,
}: FormElementsSelectMultContainerProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevValue) => !prevValue);
  };

  const removeItem = (index: number) => {
    const updatedText = [...text];
    updatedText.splice(index, 1);
  };

  return (
    <div className="relative z-20 w-full rounded border border-stroke p-1.5 pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
      <div className="flex flex-wrap items-center">
        {text.map((value, index) => (
          <span
            key={index}
            className="m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
          >
            {value.value}
            <span
              className="cursor-pointer pl-2 hover:text-danger"
              onClick={() => removeItem(index)}
            >
              <HiXMark className="h-3 w-3" />
            </span>
          </span>
        ))}
      </div>
      <select
        className={`absolute left-0 top-0 z-20 h-full w-full bg-transparent opacity-0 ${
          isDropdownOpen ? "block" : "hidden"
        }`}
      >
        {children}
      </select>
      <span
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2"
        onClick={toggleDropdown}
      >
        <HiChevronDown className="h-6 w-6" />
      </span>
    </div>
  );
}
