"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MenuComponent from "./component/MenuComponent";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [isMobile, setIsMobile] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		// 初始检查
		checkIfMobile();

		// 监听窗口大小变化
		window.addEventListener("resize", checkIfMobile);

		// 清理事件监听器
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);
	return (
		<html lang="en" className="h-full">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full flex flex-col`}
			>
				<div className="bg-[url('/background_img.png')] bg-cover bg-center flex-grow flex flex-col h-full">
					<SessionProvider>
						<div className="flex justify-between items-center w-full px-4 pt-4">
							<Image
								src="/Beaver.svg"
								alt="美甲店标志"
								width={isMobile ? 90 : 100}
								height={isMobile ? 90 : 100}
								className="z-10"
								onClick={() => router.push("/")}
							/>
							<MenuComponent
								className={`${
									isMobile ? "absolute" : "fixed"
								} top-0 right-0`}
							/>
						</div>
						<div className="flex-grow flex flex-col h-full justify-end md:justify-center items-center">
							<Suspense>{children}</Suspense>
						</div>
					</SessionProvider>
				</div>
				<Toaster richColors />
			</body>
		</html>
	);
}
