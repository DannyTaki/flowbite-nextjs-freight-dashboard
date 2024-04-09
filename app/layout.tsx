import { Flowbite, ThemeModeScript } from "flowbite-react";
import { ToastContext } from "flowbite-react/lib/esm/components/Toast/ToastContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import { customTheme } from "./theme";
import { toastTheme } from "flowbite-react/lib/esm/components/Toast";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Alliance Chemical - FreightView - Book Freight",
  description:
    "Get started with a premium admin dashboard layout built with React, Tailwind CSS and Flowbite featuring 21 example pages including charts, kanban board, mailing system, and more.",
};

export default function RootLayout({ children }: PropsWithChildren) {

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <ThemeModeScript />
      </head>
      <body className={twMerge("bg-gray-50 dark:bg-gray-900", inter.className)}>
        <ToastContext.Provider
          value={{
            isClosed: true,
            setIsClosed: () => {},
            setIsRemoved: () => {},
            theme: toastTheme,
            isRemoved: true,
          }}
        >
          <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>
        </ToastContext.Provider>
      </body>
    </html>
  );
}
