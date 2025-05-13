"use client";

import DailyInfo from "./component/daily_info";

import "animate.css";
import AppointmentReminder from "./component/AppointmentReminder";
import { ZCOOL_KuaiLe } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

export default function Home() {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].page;
	const [isMobile, setIsMobile] = useState(false);
	const [shouldAnimate, setShouldAnimate] = useState(true);
	const animationCount = useRef(0);
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

	// 控制动画播放次数
	useEffect(() => {
		if (shouldAnimate) {
			const handleAnimationEnd = () => {
				animationCount.current += 1;
				if (animationCount.current >= 2) {
					setShouldAnimate(false);
				}
			};

			const buttonElement = document.querySelector(".reservation-button");
			if (buttonElement) {
				buttonElement.addEventListener("animationiteration", handleAnimationEnd);
				return () => {
					buttonElement.removeEventListener("animationiteration", handleAnimationEnd);
				};
			}
		}
	}, [shouldAnimate]);

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
							rounded-full
							bg-gradient-to-br from-pink-400 via-rose-300 to-pink-400
							border-2 border-white/60
							shadow-xl shadow-pink-400/40 shadow-[inset_0_2px_5px_rgba(255,255,255,0.6),_inset_0_-4px_4px_rgba(230,60,130,0.25)]
							text-white text-xl md:text-3xl font-bold
							drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]
							transition-all duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)]
							hover:scale-105 hover:shadow-pink-400/60
							active:scale-[0.92] active:brightness-90 active:translate-y-1 active:shadow-pink-300/40
							${shouldAnimate ? 'animate-bounce' : ''}
							overflow-hidden
							reservation-button
							before:content-[''] before:absolute before:top-[4%] before:left-[10%] before:w-[80%] before:h-[40%] before:bg-gradient-to-b before:from-white/50 before:to-transparent before:rounded-t-full before:blur-sm before:opacity-80
							after:content-[''] after:absolute after:bottom-[5%] after:left-[15%] after:w-[70%] after:h-[15%] after:bg-gradient-to-t after:from-white/10 after:to-transparent after:rounded-b-full after:blur-md after:opacity-70
						`}
						onClick={() => handleClick("/reservation")}
					>
						<div className="absolute inset-0 rounded-full bg-gradient-radial from-white/10 via-transparent to-pink-500/20 opacity-80"></div>
						
						<div className="absolute top-[15%] right-[18%] w-3 h-3 md:w-4 md:h-4 bg-white/90 rounded-full shadow-md transform rotate-[15deg] opacity-90 animate-pulse delay-200 duration-1000"></div>
						<div className="absolute bottom-[20%] left-[22%] w-2 h-2 md:w-3 md:h-3 bg-white/80 rounded-full shadow-sm opacity-80 transform -rotate-[10deg]"></div>
						<div className="absolute top-[50%] left-[10%] w-1.5 h-1.5 md:w-2 md:h-2 text-pink-200 opacity-70">
							<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 .5l2.939 5.455 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
						</div>
						
						<span className="z-10 transform transition-transform active:scale-95">
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
