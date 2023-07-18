import { ReactNode } from "react";

interface TableHeadProps {
  children: ReactNode;
}

export function TableHead({ children }: TableHeadProps) {
  return (
    <thead>
      <tr className="bg-gray-2 text-left dark:bg-meta-4">{children}</tr>
    </thead>
  );
}
