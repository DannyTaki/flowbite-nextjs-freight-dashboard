"use client";

import React, { createContext, useContext, useState } from 'react';
import { Toast } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { Duration } from 'flowbite-react/lib/esm/components/Toast/ToastContext';

interface ToastState { 
    show: boolean;
    message: string;
    duration?: Duration;
}

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (message) => setToast({ show: true, message });
  const hideToast = () => setToast({ show: false, message: "" });

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {toast.show && (
        <div className="fixed top-5 right-5">
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
              <HiX className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{toast.message}</div>
            <Toast.Toggle onClick={hideToast} />
          </Toast>
        </div>
      )}
      {children}
    </ToastContext.Provider>
  );
};