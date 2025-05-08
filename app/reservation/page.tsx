"use client";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"


import { Coiny } from "next/font/google";
import { ZCOOL_KuaiLe } from "next/font/google";
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";
import { User2 } from "lucide-react";
import { roleNameMap } from "@/lib/roleMap";

const coiny = Coiny({ subsets: ["latin"], weight: "400" });
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

const ReservationPage = () => {
	const { currentLang } = useLanguageStore();
	const lang = (currentLang as 'zh' | 'en' | 'ko');
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
	const [artists, setArtists] = useState<{ id: string; name: string; role?: string }[]>([]);
	const [selectedArtist, setSelectedArtist] = useState<string>("");
	const [isArtistLoading, setIsArtistLoading] = useState(false);

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

	useEffect(() => {
		setIsArtistLoading(true);
		fetch("/api/nail-artists")
			.then(res => res.json())
			.then(data => {
				console.log("nail-artists接口返回：", data);
				const artistsData = Array.isArray(data) ? data : [];
				setArtists(artistsData);
				// 如果只有一个美甲师，自动选择该美甲师
				if (artistsData.length === 1) {
					setSelectedArtist(artistsData[0].id);
				} else {
					// 有多个美甲师时，初始值为空
					setSelectedArtist("");
				}
				setIsArtistLoading(false);
			})
			.catch(err => {
				console.error("获取美甲师列表失败:", err);
				setIsArtistLoading(false);
			});
	}, []);

	// 获取选定日期不可预约的时间段
	const fetchUnavailableTimeSlots = async (selectedDate: Date, artistId: string) => {
		if (!selectedDate || !artistId) return;
		try {
			setIsLoading(true);
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
			const response = await fetch(`/api/reservations/unavailable-times?date=${formattedDate}&nailArtistId=${artistId}`);
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

	// 监听 date 和 selectedArtist 变化
	useEffect(() => {
		if (date && selectedArtist) {
			fetchUnavailableTimeSlots(date, selectedArtist);
			setSelectedTime(null); // 切换老师或日期时重置选中的时间
		}
	}, [date, selectedArtist]);

	const handleDateSelect = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		if (selectedDate) {
			setIsCalendarClicked(true);
			setSelectedTime(null);
		}
	};

	const handleDateTimeCheck = async () => {
		if (!selectedArtist) {
			toast.error("请先选择美甲师", { position: "top-center", duration: 2000 });
			return;
		}
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
					nailArtistId: selectedArtist,
				}),
			});

			if (response.ok) {
				const resData = await response.json();
				localStorage.setItem(
					"latestReservation",
					JSON.stringify({
						reservationId: resData.reservation.id,
						date: formattedDate,
						timeSlot: selectedTime,
						rawDate: date,
					})
				);
				toast.success(data.function.ReservationSuccess, {
					position: "top-center",
					duration: 2000,
				});
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

	// 日历和时间段禁用逻辑
	const isArtistSelected = !!selectedArtist;

	return (
		<div className="flex flex-col items-center justify-start h-full w-full">
			<div className="bg-white rounded-xl p-6 flex flex-col justify-center items-center shadow-2xl">
				<Calendar
					required
					mode="single"
					selected={date}
					onSelect={isArtistSelected ? handleDateSelect : undefined}
					className="rounded-md border-none justify-center items-center"
					disabled={[
						!isArtistSelected,
						{
							before: (() => {
								const startDate = new Date(2025, 3, 25);
								const today = new Date();
								return today > startDate ? today : startDate;
							})(),
						},
						{ dayOfWeek: [1] },
						{
							after: (() => {
								const startDate = new Date(2025, 3, 25);
								const today = new Date();
								const baseDate = today > startDate ? today : startDate;
								const maxDate = new Date(baseDate);
								maxDate.setDate(baseDate.getDate() + 15);
								return maxDate;
							})(),
						},
						...disabledDates.map((disabledDate) => new Date(disabledDate)),
					]}
				/>
				{/* 美甲师选择下拉框 */}
				<div className="mt-6 w-full flex flex-col items-center">

					<div className="w-full flex flex-col items-center">
						<Select value={selectedArtist} onValueChange={setSelectedArtist}>
							<SelectTrigger className="rounded-2xl border-2 border-pink-200 bg-gradient-to-r from-pink-50 via-fuchsia-50 to-pink-100 shadow-lg focus:ring-2 focus:ring-pink-300 text-pink-600 font-bold text-base h-12 px-4 flex items-center justify-between">
								<User2 className="w-5 h-5 text-pink-400 mr-2" />
								{isArtistLoading ? (
									<div className="flex items-center space-x-1">
										<div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: "0ms", opacity: "0.7" }}></div>
										<div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" style={{ animationDelay: "300ms", opacity: "0.8" }}></div>
										<div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: "600ms", opacity: "0.9" }}></div>
									</div>
								) : (
									<SelectValue placeholder={data.tag.PleaseSelectArtist} />
								)}
							</SelectTrigger>
							<SelectContent className="rounded-2xl border-2 border-pink-200 bg-white shadow-2xl animate-in fade-in zoom-in-95">
								{isArtistLoading ? (
									<div className="flex justify-center items-center py-3">
										<div className="flex items-center space-x-1">
											<div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: "0ms", opacity: "0.7" }}></div>
											<div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" style={{ animationDelay: "300ms", opacity: "0.8" }}></div>
											<div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: "600ms", opacity: "0.9" }}></div>
										</div>
									</div>
								) : (
									artists.map(artist => {
										const roleInfo = roleNameMap[artist.role || "L3"] || roleNameMap["L3"];
										return (
											<SelectItem
												key={artist.id}
												value={artist.id}
												className="rounded-xl px-4 py-3 text-base font-semibold text-pink-600 hover:bg-pink-100 hover:text-fuchsia-600 transition-all duration-200 cursor-pointer flex items-center gap-2"
											>
												<span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 mr-2"></span>
												{artist.name}
												<span className={`ml-2 text-xs rounded-full px-2 py-0.5 ${roleInfo.color}`}>{roleInfo.label[lang === "ko" ? "kr" : lang]}</span>
											</SelectItem>
										);
									})
								)}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
			{isCalendarClicked && isArtistSelected ? (
				<div className={`grid grid-cols-3 grid-rows-2 gap-4 w-full max-w-[300px] md:max-w-[600px] mx-auto p-10 ${coiny.className}`}>
					{isLoading ? (
						<div className="col-span-3 text-center">{data.tag.Loading}</div>
					) : (
						<>
							{timeSlots.map((time) => (
								<Button
									key={time}
									variant="default"
									className={`h-14 rounded-2xl ${selectedTime === time ? "bg-pink-300" : "bg-pink-500"} text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)] hover:shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)] hover:bg-pink-400 active:bg-pink-300 focus:bg-pink-300 disabled:opacity-50 disabled:cursor-not-allowed flex-col justify-center items-center`}
									onClick={() => setSelectedTime(time)}
									disabled={unavailableTimeSlots.includes(time) || isTimeSlotPassed(time)}
								>
									{time}
									{unavailableTimeSlots.includes(time) ? (
										<span className="">{data.tag.Reserved}</span>
									) : isTimeSlotPassed(time) ? (
										<span className="">{data.tag.TimePassed}</span>
									) : null}
								</Button>
							))}
							<Button
								variant="default"
								className={`h-14 rounded-2xl ${selectedTime ? "bg-green-600" : "bg-black"} text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)] hover:shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)] ${zcool.className} disabled:opacity-50 disabled:cursor-not-allowed`}
								onClick={handleDateTimeCheck}
								disabled={!selectedTime || isLoading}
							>
								{isLoading ? data.tag.Processing : data.tag.Confirm}
							</Button>
						</>
					)}
				</div>
			) : !isArtistSelected ? (
				<div className={`h-full flex justify-center items-center ${zcool.className}`}>
					<Badge variant="secondary" className="text-2xl p-2">{data.tag.PleaseSelectArtist}</Badge>
				</div>
			) : (
				<div className={`h-full flex justify-center items-center ${zcool.className}`}>
					<Badge variant="secondary" className="text-2xl p-2">{data.tag.PleaseSelectDate}</Badge>
				</div>
			)}
		</div>
	);
};

export default ReservationPage;
