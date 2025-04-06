"use client";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

import { Coiny } from "next/font/google";
import { ZCOOL_KuaiLe } from "next/font/google";

const coiny = Coiny({ subsets: ["latin"], weight: "400" });
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";
const ReservationPage = () => {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].reservation
			.page;
	const router = useRouter();
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [isCalendarClicked, setIsCalendarClicked] = useState(false);
	const [selectedTime, setSelectedTime] = useState<string | null>(
		null
	);
	const [disabledDates, setDisabledDates] = useState<Date[]>([]);
	const [unavailableTimeSlots, setUnavailableTimeSlots] = useState<
		string[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);

	const timeSlots = ["10:00", "12:00", "14:00", "16:00", "19:00"];

	// 获取不可预约的日期
	useEffect(() => {
		const fetchDisabledDates = async () => {
			try {
				// 这里应该调用API获取已满的日期
				// 示例代码，实际需要替换为真实API调用
				const response = await fetch(
					"/api/reservations/disabled-dates"
				);
				const data = await response.json();
				if (data.disabledDates) {
					setDisabledDates(
						data.disabledDates.map(
							(dateStr: string) => new Date(dateStr)
						)
					);
				}
			} catch (error) {
				console.error("获取不可预约日期失败:", error);
				toast.error(data.function.GetReservationInfoError, {
					position: "top-center",
					duration: 2000,
				});
			}
		};

		fetchDisabledDates();
	}, []);

	// 获取选定日期不可预约的时间段
	const fetchUnavailableTimeSlots = async (selectedDate: Date) => {
		if (!selectedDate) return;

		try {
			setIsLoading(true);
			// 使用韩国时区格式化日期
			const formattedDate = selectedDate
				.toLocaleDateString("ko-KR", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					timeZone: "Asia/Seoul",
				})
				.split(". ")
				.join("-")
				.replace(".", "");

			const response = await fetch(
				`/api/reservations/unavailable-times?date=${formattedDate}`
			);
			const data = await response.json();

			if (data.unavailableTimes) {
				setUnavailableTimeSlots(data.unavailableTimes);
			} else {
				setUnavailableTimeSlots([]);
			}
		} catch (error) {
			console.error("获取不可预约时间段失败:", error);
			toast.error(data.function.GetReservationInfoError, {
				position: "top-center",
				duration: 2000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDateSelect = (selectedDate: Date | undefined) => {
		console.log(Date);
		setDate(selectedDate);
		if (selectedDate) {
			setIsCalendarClicked(true);
			fetchUnavailableTimeSlots(selectedDate);
			setSelectedTime(null); // 重置选中的时间
		}
	};

	const handleDateTimeCheck = async () => {
		if (!date || !selectedTime) return;

		try {
			setIsLoading(true);
			// 使用韩国时区格式化日期
			const formattedDate = date
				.toLocaleDateString("ko-KR", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					timeZone: "Asia/Seoul",
				})
				.split(". ")
				.join("-")
				.replace(".", "");

			const response = await fetch("/api/reservations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					date: formattedDate,
					timeSlot: selectedTime,
				}),
			});

			// const data = await response.json();

			if (response.ok) {
				// 保存预约信息到localStorage
				localStorage.setItem(
					"latestReservation",
					JSON.stringify({
						date: formattedDate,
						timeSlot: selectedTime,
						rawDate: date,
					})
				);

				toast.success(data.function.ReservationSuccess, {
					position: "top-center",
					duration: 2000,
				});
				// 跳转到确认页面
				router.push("/reservation/confirmation");
			} else {
				toast.error(data.function.ReservationFailed, {
					position: "top-center",
					duration: 2000,
				});
			}
		} catch (error) {
			console.error("预约失败:", error);
			toast.error(data.function.ReservationFailed, {
				position: "top-center",
				duration: 2000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	// 添加检查时间段是否已过期的函数
	const isTimeSlotPassed = (timeSlot: string) => {
		if (!date) return false;

		const now = new Date();
		const today = new Date().setHours(0, 0, 0, 0);
		const selectedDate = new Date(date).setHours(0, 0, 0, 0);

		// 如果不是今天，不需要检查时间
		if (selectedDate !== today) return false;

		// 解析时间段
		const [hours, minutes] = timeSlot.split(":").map(Number);
		const slotTime = new Date();
		slotTime.setHours(hours, minutes, 0, 0);

		// 如果当前时间已经过了预约时间，返回true
		return now > slotTime;
	};

	return (
		<div className="flex flex-col items-center justify-start h-full w-full">
			<div className="bg-white rounded-xl p-6 flex flex-col justify-center items-center shadow-2xl">
				<Calendar
					required
					mode="single"
					selected={date}
					onSelect={handleDateSelect}
					className="rounded-md border-none justify-center items-center"
					disabled={[
						{
							before: (() => {
								// 起始日期是2025年4月25日
								const startDate = new Date(2025, 3, 25);
								// 获取当前日期
								const today = new Date();
								// 如果当前日期已经超过起始日期，则使用当前日期作为最早可选日期
								return today > startDate ? today : startDate;
							})(),
						},
						{ dayOfWeek: [1] }, // 禁用周一
						{
							after: (() => {
								// 起始日期是2025年4月25日
								const startDate = new Date(2025, 3, 25);
								// 获取当前日期
								const today = new Date();
								// 使用较晚的日期作为计算基准
								const baseDate =
									today > startDate ? today : startDate;
								// 从基准日期开始计算15天后的日期
								const maxDate = new Date(baseDate);
								maxDate.setDate(baseDate.getDate() + 15);
								return maxDate;
							})(),
						},
						...disabledDates.map(
							(disabledDate) => new Date(disabledDate)
						),
					]}
				/>
			</div>
			{isCalendarClicked ? (
				<div
					className={`grid grid-cols-3 grid-rows-2 gap-4 w-full max-w-[300px] md:max-w-[600px] mx-auto p-10 ${coiny.className}`}
				>
					{isLoading ? (
						<div className="col-span-3 text-center">
							{data.tag.Loading}
						</div>
					) : (
						<>
							{timeSlots.map((time) => (
								<Button
									key={time}
									variant="default"
									className={`h-14 rounded-2xl ${
										selectedTime === time
											? "bg-pink-300"
											: "bg-pink-500"
									} text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)] hover:shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)] hover:bg-pink-400 active:bg-pink-300 focus:bg-pink-300 disabled:opacity-50 disabled:cursor-not-allowed flex-col justify-center items-center`}
									onClick={() => setSelectedTime(time)}
									disabled={
										unavailableTimeSlots.includes(time) ||
										isTimeSlotPassed(time)
									}
								>
									{time}
									{unavailableTimeSlots.includes(time) ? (
										<span className="">{data.tag.Reserved}</span>
									) : isTimeSlotPassed(time) ? (
										<span className="">
											{data.tag.TimePassed}
										</span>
									) : null}
								</Button>
							))}
							<Button
								variant="default"
								className={`h-14 rounded-2xl ${
									selectedTime ? "bg-green-600" : "bg-black"
								} text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)] hover:shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)] ${
									zcool.className
								} disabled:opacity-50 disabled:cursor-not-allowed`}
								onClick={handleDateTimeCheck}
								disabled={!selectedTime || isLoading}
							>
								{isLoading ? data.tag.Processing : data.tag.Confirm}
							</Button>
						</>
					)}
				</div>
			) : (
				<div
					className={`h-full flex justify-center items-center ${zcool.className}`}
				>
					<Badge variant="secondary" className="text-2xl p-2">
							{ data.tag.PleaseSelectDate}
					</Badge>
				</div>
			)}
		</div>
	);
};

export default ReservationPage;
