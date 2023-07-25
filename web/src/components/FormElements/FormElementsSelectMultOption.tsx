import { OptionHTMLAttributes } from "react";

interface FormElementsSelectMultOption
  extends OptionHTMLAttributes<HTMLOptionElement> {
  text: string;
}

export default function FormElementsSelectMultOption({
  text,
  ...rest
}: FormElementsSelectMultOption) {
  return <option {...rest}>{text}</option>;
}
