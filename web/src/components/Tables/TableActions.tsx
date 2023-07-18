import { ReactNode } from "react";

interface TableActionsProps {
  children: ReactNode;
}

export function TableActions({ children }: TableActionsProps) {
  return (
    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
      <div className="flex items-center space-x-3.5">{children}</div>
    </td>
  );
}
