"use client";
import { ZCOOL_KuaiLe } from "next/font/google";
import { Coiny } from "next/font/google";
import { Heart, Loader2 } from "lucide-react";
import { Single_Day } from "next/font/google";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
const coiny = Coiny({ subsets: ["latin"], weight: "400" });
const single = Single_Day({ weight: "400" });

export default function AppointmentReminder() {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].component
			.AppointmentReminder.page;
	const [isCopied, setIsCopied] = useState(false);
	const [isLogin, setIsLogin] = useState(false);
	const [isLoading, setIsLoading] = useState(true); // 添加加载状态
	const address = "서울 마포구 서교동 325-7 301";
	const [nextReservation, setNextReservation] = useState<{
		date: string;
		weekDay: string;
		timeSlot: string;
		rawDate?: Date; // 添加原始日期用于计算倒计时
	} | null>(null);
	const [timeLeft, setTimeLeft] = useState<{
		days: number;
		hours: number;
		minutes: number;
	} | null>(null);

	// 计算剩余时间的函数
	const calculateTimeLeft = (reservationDate: Date) => {
		const now = new Date();
		const diffTime = reservationDate.getTime() - now.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		const diffHours = Math.floor(
			(diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const diffMinutes = Math.floor(
			(diffTime % (1000 * 60 * 60)) / (1000 * 60)
		);

		return { days: diffDays, hours: diffHours, minutes: diffMinutes };
	};

	const weekDays = data.function.WeekDay;
	useEffect(() => {
		const fetchNextReservation = async () => {
			setIsLoading(true); // 开始加载
			try {
				const response = await fetch(
					"/api/reservations/approachingReservationTime"
				);
				console.log(response);
				if (response.status === 401) {
					setIsLogin(false);
					setIsLoading(false); // 结束加载
					return;
				}
				if (!response.ok) {
					throw new Error("获取预约信息失败");
				}
				const data = await response.json();
				if (data.nextReservation) {
					const reservationDate = new Date(data.nextReservation.date);
					// 解析时间段获取小时
					const timeSlotHour = parseInt(
						data.nextReservation.timeSlot.split(":")[0]
					);
					// 设置预约的具体时间（小时）
					reservationDate.setHours(timeSlotHour);

					setNextReservation({
						date: `${reservationDate.getFullYear()}.${String(
							reservationDate.getMonth() + 1
						).padStart(2, "0")}.${String(
							reservationDate.getDate()
						).padStart(2, "0")}`,
						weekDay: weekDays[reservationDate.getDay()],
						timeSlot: data.nextReservation.timeSlot,
						rawDate: reservationDate, // 保存原始日期对象
					});

					// 计算剩余时间
					setTimeLeft(calculateTimeLeft(reservationDate));
				}
				setIsLogin(true);
			} catch (error) {
				console.error("获取预约信息失败:", error);
			} finally {
				setIsLoading(false); // 结束加载
			}
		};

		fetchNextReservation();

		// 每小时更新一次倒计时
		const timer = setInterval(() => {
			if (nextReservation?.rawDate) {
				setTimeLeft(calculateTimeLeft(nextReservation.rawDate));
			}
		}, 60 * 60 * 1000);

		return () => {
			clearInterval(timer);
		};
	}, [data]);

	const handleCopy = () => {
		try {
			const textarea = document.createElement("textarea");
			textarea.value = address;
			// 确保textarea在视口内但不可见
			textarea.style.position = "fixed";
			textarea.style.left = "0";
			textarea.style.top = "0";
			textarea.style.opacity = "0";
			document.body.appendChild(textarea);
			textarea.focus();
			textarea.select();

			const successful = document.execCommand("copy");
			document.body.removeChild(textarea);

			if (successful) {
				setIsCopied(true);
				toast.success(data.function.CopyAddressSuccess, {
					position: "top-center",
					duration: 2000,
				});
				setTimeout(() => setIsCopied(false), 2000);
			} else {
				toast.error(data.function.CopyAddressError, {
					position: "top-center",
					duration: 2000,
				});
			}
		} catch (err) {
			console.error("复制失败:", err);
			toast.error(data.function.CopyAddressError, {
				position: "top-center",
				duration: 2000,
			});
		}
	};

	return (
		<div className="w-80 h-fit bg-white rounded-t-2xl rounded-bl-2xl p-2 px-4 border-2 ">
			{isLoading ? (
				// 加载中显示加载动画
				<div className="flex flex-col items-center justify-center py-4">
					<Loader2 className="h-8 w-8 animate-spin mb-2" />
					<div className={`${zcool.className} text-[#424242]`}>
						{data.tag.Loading}
					</div>
				</div>
			) : isLogin ? (
				// 已登录显示预约信息
				<>
					<div
						className={`${zcool.className} text-[#fa5e75] flex justify-between`}
					>
						<span className="text-xl">
							{data.tag.AppointmentReminder}
						</span>
						<div>
							<Heart className="inline fill-red-500 w-3 h-3" />
						</div>
					</div>
					<div className={`${zcool.className} text-[#424242]`}>
						{data.tag.NextSchedule}
					</div>

					{nextReservation ? (
						<>
							<div
								className={`${coiny.className} text-[#424242] text-2xl flex items-center gap-2`}
							>
								<span>{nextReservation.date}</span>
								<span>{nextReservation.timeSlot}</span>
								<span className={`${zcool.className} text-xl`}>
									{nextReservation.weekDay}
								</span>
							</div>
							<div
								className={`${coiny.className} text-[#424242] text-xl`}
							></div>
							{/* 添加倒计时显示 */}
							{timeLeft && (
								<div
									className={`${zcool.className} text-[#fa5e75] text-lg mt-1`}
								>
									{data.tag.ApproachingTime.a} {timeLeft.days}{" "}
									{data.tag.ApproachingTime.b} {timeLeft.hours}{" "}
									{data.tag.ApproachingTime.c} {timeLeft.minutes}{" "}
									{data.tag.ApproachingTime.d}
								</div>
							)}
							{/* 其他内容保持不变 */}
						</>
					) : (
						<div className={`${zcool.className} text-[#424242]`}>
							{data.tag.NoReservation}
						</div>
					)}
					<div
						className={`${zcool.className} text-[#424242] text-xl`}
					>
						<div className="">
							<span className="">{data.tag.StoreAddress}</span>
							<Copy
								className={`inline w-4 h-4 ml-1 cursor-pointer ${
									isCopied ? "text-green-500" : ""
								}`}
								onClick={handleCopy}
							/>
						</div>
					</div>
					<div
						className={`${zcool.className} text-[#424242] text-xl`}
					>
						<div
							className={`${single.className} inline ml-1 text-2xl`}
						>
							{address}
						</div>
					</div>
				</>
			) : (
				// 未登录显示提示
				<div
					className={`${zcool.className} py-4 text-center text-[#424242]`}
				>
					{data.tag.NotLogin}
				</div>
			)}
		</div>
	);
}
