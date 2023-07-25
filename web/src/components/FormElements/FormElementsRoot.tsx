import { ReactNode } from "react";

interface FormElementsRootProps {
  children: ReactNode;
}

export default function FormElementsRoot({ children }: FormElementsRootProps) {
  return (
    <div className="max-h-[90%] w-[40%] max-w-[50%] overflow-y-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {children}
    </div>
  );
}
