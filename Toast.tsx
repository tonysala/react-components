import React, { createContext, ReactNode, useContext, useState } from "react";

interface ToastType {
  id: number;
  content: ReactNode;
  duration: number;
  callback?: () => void;
}

type ToastContextType = {
  notify: (content: ReactNode, duration?: number, callback?: () => void) => void;
  success: (content: ReactNode, duration?: number, callback?: () => void) => void;
  failure: (content: ReactNode, duration?: number, callback?: () => void) => void;
  remove: (id?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const notify = (content: ReactNode, duration = 10000, callback?: () => void) => {
    const id = new Date().getTime();
    setToasts((prevToasts) => [...prevToasts, { id, content, duration, callback }]);

    const timer = setTimeout(() => {
      if (callback) {
        callback();
      }
      remove(id);
    }, duration);

    return () => clearTimeout(timer);
  };

  const success = (content: ReactNode, duration = 10000, callback?: () => void) => {
    notify(<div className={"success"}>{content}</div>, duration, callback);
  };

  const failure = (content: ReactNode, duration = 10000, callback?: () => void) => {
    notify(<div className={"danger"}>{content}</div>, duration, callback);
  };

  const remove = (id?: number) => {
    setToasts((prevToasts) => {
      if (id) {
        return prevToasts.filter((toast) => toast.id !== id);
      } else {
        return [];
      }
    });
  };

  return (
    <ToastContext.Provider value={{ notify, remove, success, failure }}>
      {children}
      <div id="toasts" className="flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast gap-1 flex-col"
            onClick={() => remove(toast.id)}
          >
            {toast.content}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};