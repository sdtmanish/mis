import { Comic_Neue } from "next/font/google";
import "./globals.css";

// Comic Neue (Sans)
const comicNeue = Comic_Neue({
  subsets: ["latin"],
   weight: ["300", "400", "700"],
  variable: "--font-comic-neue",
  display: "swap",
});

export const metadata = {
  title: "Create Next App",
  description: "Using Comic Neue with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={comicNeue.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
