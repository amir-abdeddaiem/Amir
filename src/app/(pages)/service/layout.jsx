import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PetCare Reservations - Find Perfect Pet Services",
  description:
    "Book trusted pet care services for your furry friends. Veterinary, grooming, training, and more!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
