import { TableHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface TableHeadContentProps extends TableHTMLAttributes<HTMLTableElement> {
  item: string;
}

export function TableHeadContent({ item, ...rest }: TableHeadContentProps) {
  return (
    <th
      className={twMerge(
        "px-4 py-4 font-medium text-black dark:text-white",
        rest.className
      )}
    >
      {item}
    </th>
  );
}
