import { ReactNode } from "react";

interface ModalConfirmationBodyProps {
  children: ReactNode;
}

export function ModalConfirmationBody({
  children,
}: ModalConfirmationBodyProps) {
  return <div className="flex w-full justify-evenly pb-4">{children}</div>;
}
