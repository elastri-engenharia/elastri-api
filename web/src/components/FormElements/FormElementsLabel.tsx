interface FormElementsLabelProps {
  title?: string;
  symbol?: string;
}

export default function FormElementsLabel({
  title,
  symbol,
}: FormElementsLabelProps) {
  return (
    <label className="mb-2.5 block text-black dark:text-white">
      {title} {!!symbol && <span className="text-meta-1">{symbol}</span>}
    </label>
  );
}
