import { OptionHTMLAttributes } from "react";

interface FormElementsSelectSimpleOptionProps
  extends OptionHTMLAttributes<HTMLOptionElement> {
  option: string
}

export default function FormElementsSelectSimpleOption({
  option,
  ...rest
}: FormElementsSelectSimpleOptionProps) {
  return (
    <option {...rest}>
      {option}
    </option>
  );
}
