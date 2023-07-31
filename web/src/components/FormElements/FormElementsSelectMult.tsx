import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { HiChevronDown, HiXMark } from "react-icons/hi2";

interface FormElementsSelectMultProps {
  registers: string;
  selected: [];
  optionTitle: string;
  option: [];
}

export default function FormElementsSelectMult({
  registers,
  selected,
  optionTitle,
  option,
}: FormElementsSelectMultProps) {
  const { register, setValue } = useFormContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [select, setSelect] = useState<string[]>(selected);

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    setSelect((prevSelected) => [...prevSelected, selectedOption]);
    setIsDropdownOpen(false);
    setValue(registers, selectedOption);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevValue) => !prevValue);
  };

  const removeItem = (index: number) => {
    const updatedSelected = [...select];
    updatedSelected.splice(index, 1);
    setSelect(updatedSelected);
    setValue(registers, updatedSelected);
  };

  const updateFormValue = () => {
    register(registers);
    setSelect((prevSelected) => {
      setValue(registers, prevSelected);
      return prevSelected;
    });
  };

  const filteredOptions = option.filter((item) => !select.includes(item));

  useEffect(() => {
    setValue(registers, selected);
  }, [registers, selected, setValue]);

  return (
    <div className="relative z-20 w-full rounded border border-stroke p-1.5 pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
      <div className="flex flex-wrap items-center">
        {select.map((option, index) => (
          <span
            key={index}
            className="m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
          >
            {option}
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
        {...register(registers)}
        onChange={handleSelectChange}
        onBlur={updateFormValue}
      >
        <option disabled>{optionTitle}</option>
        {filteredOptions.map((options, index) => (
          <option key={index} value={options}>
            {options}
          </option>
        ))}
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
