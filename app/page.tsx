"use client";

import DailyInfo from "./component/daily_info";

import "animate.css";
import AppointmentReminder from "./component/AppointmentReminder";
import { ZCOOL_KuaiLe } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

export default function Home() {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].page;
	const [isMobile, setIsMobile] = useState(false);
	const router = useRouter();

	// 检测设备是否为移动设备
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

	const handleClick = (url?: string) => {
		router.push(url || "/");
	};
	return (
		<div className="w-full h-full flex flex-col">
			<Toaster />
			<div className="w-full flex-1 flex flex-col justify-between px-4 md:px-10">

				<div
					className={`w-full flex-1 bg-transparent flex flex-col gap-6 md:gap-10 items-center justify-center ${zcool.className} mt-4 md:mt-0`}
				>
					{/* <span
						className={`text-5xl md:text-7xl bg-gradient-to-r from-fuchsia-600 to-purple-600 inline-block text-transparent bg-clip-text opacity-50 text-center`}
					>
						想要进店体验美甲吗？
					</span> */}
					<Button
						className={`${zcool.className} flex justify-center items-center bg-gradient-to-r from-red-400 to-pink-500 drop-shadow-2xl text-xl md:text-3xl p-3 md:p-5  w-24 h-24 rounded-full md:w-52 md:h-52`}
						onClick={() => handleClick("/reservation")}
					>
						{data.tag.QuickReservation}
					</Button>
				</div>

				<div
					className={`${
						isMobile ? "flex flex-col gap-4" : "flex justify-between"
					} p-3 md:p-5 mb-2 md:mb-0 w-full mt-auto`}
				>
					<div className={isMobile ? "self-center" : ""}>
						<DailyInfo />
					</div>
					<div className={isMobile ? "self-center" : ""}>
						<AppointmentReminder />
					</div>
				</div>
			</div>
		</div>
	);
}
