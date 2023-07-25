import { ReactNode } from "react";

interface ModalConfirmationProps {
  isOpen: boolean;
  children: ReactNode;
}

export function ModalConfirmationRoot({
  isOpen,
  children,
}: ModalConfirmationProps) {
  return isOpen ? (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-25 p-1 backdrop-blur-sm">
      <div className="w-82 h-92 flex flex-col items-center justify-between rounded-xl border border-strokedark bg-white px-4 py-1 text-black dark:border-white dark:bg-boxdark dark:text-white">
        {children}
      </div>
    </div>
  ) : null;
}
