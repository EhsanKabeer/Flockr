"use client";

import { Toaster } from "react-hot-toast";
import FeedLayout from "@/components/layout/FeedLayout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FeedLayout>{children}</FeedLayout>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#16181c",
            color: "#ededed",
            border: "1px solid #2f3336",
          },
          success: {
            iconTheme: {
              primary: "#1d9bf0",
              secondary: "#ededed",
            },
          },
          error: {
            iconTheme: {
              primary: "#f4212e",
              secondary: "#ededed",
            },
          },
        }}
      />
    </>
  );
}

