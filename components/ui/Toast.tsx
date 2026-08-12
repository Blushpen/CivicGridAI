import { ReactNode } from "react";
import clsx from "clsx";

interface ToastProps {
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
}

const variantClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-200",
  error: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-600 dark:bg-rose-950 dark:text-rose-200",
  info: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-600 dark:bg-sky-950 dark:text-sky-200",
};

export function Toast({ title, description, variant = "info" }: ToastProps) {
  return (
    <div className={clsx("rounded-3xl border p-4 shadow-sm", variantClasses[variant])}>
      <p className="font-semibold">{title}</p>
      {description ? <p className="mt-1 text-sm leading-6">{description}</p> : null}
    </div>
  );
}
