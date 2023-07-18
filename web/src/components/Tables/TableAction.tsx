import { ButtonHTMLAttributes, ElementType } from "react";



interface TableActionProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  icon: ElementType;
}

export function TableAction({ icon: Icon, ...rest }: TableActionProps) {
  return (
    <button {...rest} className="hover:text-primary">
      <Icon className="w-4.5 h-4.5"/>
    </button>
  );
}
