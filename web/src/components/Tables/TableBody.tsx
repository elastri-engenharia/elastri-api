import { ReactNode } from "react";

interface TableBodyProps {
  index?: number;
  children: ReactNode;
}

export function TableBody({ index, children }: TableBodyProps) {
  return (
    <tbody>
      <tr key={index}>{children}</tr>
    </tbody>
  );
}
