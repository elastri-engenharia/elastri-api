import { TableHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface TableBodyContentProps
  extends TableHTMLAttributes<HTMLTableDataCellElement> {
  item: string;
}

export function TableBodyContent({ item, ...rest }: TableBodyContentProps) {
  return (
    <td
      {...rest}
      className={twMerge(
        "border-b border-[#eee] px-4 py-5 dark:border-strokedark",
        rest.className
      )}
    >
      {(item === "Sim" && (
        <p className="inline-flex rounded-full bg-success bg-opacity-10 px-3 py-1 text-sm font-medium text-success">
          {item}
        </p>
      )) ||
        (item === "Não" && (
          <p className="inline-flex rounded-full bg-danger bg-opacity-10 px-3 py-1 text-sm font-medium text-danger">
            {item}
          </p>
        )) || <p className="text-black dark:text-white">{item}</p>}
    </td>
  );
}
