"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Toast } from "@/components/ui/Toast";

type Notification = {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "info" | "error";
};

type ContextType = {
  notify: (n: Omit<Notification, "id">) => string;
  dismiss: (id: string) => void;
};

const NotificationContext = createContext<ContextType | undefined>(undefined);

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Notification[]>([]);

  function notify(n: Omit<Notification, "id">) {
    const id = `notif-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    setList((s) => [{ id, ...n }, ...s]);
    // auto dismiss
    setTimeout(() => {
      setList((s) => s.filter((x) => x.id !== id));
    }, 8000);
    return id;
  }

  function dismiss(id: string) {
    setList((s) => s.filter((x) => x.id !== id));
  }

  return (
    <NotificationContext.Provider value={{ notify, dismiss }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex w-96 flex-col gap-3">
        {list.map((n) => (
          <div key={n.id}>
            <Toast title={n.title} description={n.description} variant={n.variant} />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
