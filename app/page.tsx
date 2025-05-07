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
					<Button
						className={`
							${zcool.className}
							flex justify-center items-center
							relative
							w-32 h-32 md:w-60 md:h-60
							rounded-[2.5rem] md:rounded-[4rem]
							bg-gradient-to-br from-pink-300 via-pink-200 to-fuchsia-200
							border-4 border-pink-200/80
							shadow-[0_8px_32px_0_rgba(255,120,200,0.18),0_1.5px_0_0_rgba(255,255,255,0.7)_inset,0_0_0_8px_rgba(255,182,193,0.10)]
							backdrop-blur-xl
							text-pink-600 text-2xl md:text-4xl font-extrabold tracking-wider
							drop-shadow-[0_2px_8px_rgba(255,120,200,0.18)]
							transition-all duration-200
							active:scale-95 active:shadow-[0_2px_8px_0_rgba(255,120,200,0.10)]
							overflow-hidden
							group
						`}
						onClick={() => handleClick("/reservation")}
					>
						{/* 玻璃高光 */}
						<span className="absolute left-0 top-0 w-full h-1/2 rounded-t-[2.5rem] md:rounded-t-[4rem] bg-white/40 blur-lg opacity-60 pointer-events-none"></span>
						{/* 按钮文字 */}
						<span className="z-10 drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)] text-shadow-pink">
							{data.tag.QuickReservation}
						</span>
					</Button>
				</div>

				<div
					className={`${isMobile ? "flex flex-col gap-4" : "flex justify-between"
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
