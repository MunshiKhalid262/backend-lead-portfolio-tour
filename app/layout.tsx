import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Backend Lead | Interactive Portfolio", description: "Explore backend systems, platform engineering and real-world projects through a 3D portfolio tour." };
export default function RootLayout({ children }: Readonly<{children:React.ReactNode}>) {return <html lang="en"><body>{children}</body></html>}
