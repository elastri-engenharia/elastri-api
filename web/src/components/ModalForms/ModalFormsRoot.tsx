import { ReactNode } from "react";

interface ModalFormsRootProps {
  isOpen?: boolean;
  children: ReactNode;
}

export function ModalFormsRoot({ isOpen, children }: ModalFormsRootProps) {
  return isOpen ? (
    <div className="fixed inset-0 z-9999 flex items-center justify-center  bg-black bg-opacity-25 p-1 backdrop-blur-sm">
      <div className="flex h-screen w-screen items-center justify-center">
        {children}
      </div>
    </div>
  ) : null;
}
