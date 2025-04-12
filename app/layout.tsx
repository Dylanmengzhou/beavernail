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
import { Analytics } from "@vercel/analytics/next";
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
	const metadata = {
		title: "Beaver Nail - 韩国弘大专业美甲店",
		description:
			"位于韩国弘大的专业美甲店，提供高品质的美甲服务，包括日式美甲、韩式美甲等多种风格。在线预约，轻松体验专业美甲服务。",
		keywords:
			"美甲, 韩国美甲, 弘大美甲, 日式美甲, 韩式美甲, 美甲预约",
	};

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
			<head>
				<link rel="icon" href="/favicon.png" sizes="any" />
				<link
					rel="icon"
					href="/icon?<generated>"
					type="image/<generated>"
					sizes="<generated>"
				/>
				<meta name="description" content={metadata.description} />
				<meta name="keywords" content={metadata.keywords} />
				<meta property="og:title" content={metadata.title} />
				<meta
					property="og:description"
					content={metadata.description}
				/>
				<meta property="og:image" content="/og-image.png" />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={metadata.title} />
				<meta
					name="twitter:description"
					content={metadata.description}
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full flex flex-col bg-[url('/background_img.png')] bg-cover bg-center`}
			>

					<div className=" flex-grow flex flex-col h-full">
						<SessionProvider>
							<div className="flex justify-between items-center w-full px-4 pt-4 pr-0">
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
								<Suspense>
									{children}
									<Analytics />
								</Suspense>
							</div>
						</SessionProvider>
					</div>
					<Toaster richColors />

			</body>
		</html>
	);
}
