import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/50 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-none",
        className
      )}
    >
      {children}
    </div>
  );
}
