import "../styles/globals.css";
import { AuthProvider } from "../lib/auth";
import { Montserrat } from "@next/font/google";
import Modal from "../components/WalletConnectModals/Modal";
import React from "react";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main
          className={montserrat.className}
          style={{ height: "100%", width: "100%" }}
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Modal />
        </main>
      </body>
    </html>
  );
}
