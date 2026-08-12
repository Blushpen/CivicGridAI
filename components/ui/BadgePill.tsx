import { ReactNode } from "react";
import clsx from "clsx";

interface BadgePillProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "info";
}

const variantClasses = {
  default: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200",
};

export function BadgePill({ children, variant = "default" }: BadgePillProps) {
  return (
    <span className={clsx("inline-flex rounded-full px-3 py-1 text-xs font-semibold", variantClasses[variant])}>
      {children}
    </span>
  );
}
