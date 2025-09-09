import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";


const MontserratFont = Montserrat({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: "Goold | Agendamentos de Salas",
  description: "Sistema de agendamento de salas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${MontserratFont.className} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
