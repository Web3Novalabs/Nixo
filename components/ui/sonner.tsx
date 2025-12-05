"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-950 group-[.toaster]:text-slate-50 group-[.toaster]:border-purple-900/50 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-slate-400",
          actionButton:
            "group-[.toast]:bg-purple-700 group-[.toast]:text-slate-50",
          cancelButton:
            "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-400",
          success:
            "group-[.toast]:border-green-900/50 group-[.toast]:bg-green-950/50",
          error:
            "group-[.toast]:border-red-900/50 group-[.toast]:bg-red-950/50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
