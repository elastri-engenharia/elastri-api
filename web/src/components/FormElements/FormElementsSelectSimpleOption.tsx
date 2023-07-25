import { OptionHTMLAttributes } from "react";

interface FormElementsSelectSimpleOption
  extends OptionHTMLAttributes<HTMLOptionElement> {
  text: string;
}

export default function FormElementsSelectSimpleOption({
  text,
  ...rest
}: FormElementsSelectSimpleOption) {
  return <option {...rest}>{text}</option>;
}
