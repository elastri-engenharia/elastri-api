import { ReactNode } from "react";

interface TableRootProps {
  children: ReactNode;
}

export function TableRoot({ children }: TableRootProps) {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">{children}</table>
      </div>
    </div>
  );
}
