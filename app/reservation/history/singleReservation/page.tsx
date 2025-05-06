"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, addHours, isBefore, subHours } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Loader2, ArrowLeft, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ZCOOL_KuaiLe } from "next/font/google";
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
// 预约数据类型
type Reservation = {
	id: string;
	date: Date;
	timeSlot: string;
	status: "upcoming" | "completed" | "cancelled";
};

export default function ReservationDetailPage() {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].reservation
			.history.singleReservation.page;

	// 状态映射
	const statusMap = {
		upcoming: {
			label: data.function.Upcoming,
			className: "bg-blue-100 text-blue-800",
		},
		completed: {
			label: data.function.Accomplished,
			className: "bg-green-100 text-green-800",
		},
		cancelled: {
			label: data.function.Canceled,
			className: "bg-red-100 text-red-800",
		},
	};
	const router = useRouter();
	const [reservation, setReservation] = useState<Reservation | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [cancelLoading, setCancelLoading] = useState(false);
	const searchParams = useSearchParams();
	const reservationId = searchParams.get("reservationId");
	console.log("reservationId", reservationId);
	// type of reservationId
	console.log("type of reservationId", typeof reservationId);

	const [copying, setCopying] = useState(false);

	// 获取预约详情
	useEffect(() => {
		const fetchReservationDetail = async () => {
			try {
				const response = await fetch(
					`/api/reservations/history/getSingleReservation?reservationId=${reservationId}`
				);

				if (!response.ok) {
					throw new Error("获取预约详情失败");
				}

				const data = await response.json();
				setReservation({
					...data,
					date: new Date(data.date),
				});
			} catch (error) {
				console.error("获取预约详情失败:", error);
				toast.error("获取预约详情失败", {
					position: "top-center",
					duration: 2000,
				});
			} finally {
				setLoading(false);
			}
		};

		fetchReservationDetail();
	}, [reservationId]);

	// 获取韩国时间（UTC+9）
	const getKoreanTime = () => {
		const now = new Date();
		return addHours(now, 9 - now.getTimezoneOffset() / 60);
	};

	// 检查是否可以取消预约（至少提前24小时）
	const canCancelInTime = (reservationDate: Date) => {
		const koreanTime = getKoreanTime();
		const reservationTimeMinusDayKST = subHours(reservationDate, 24);
		return isBefore(koreanTime, reservationTimeMinusDayKST);
	};

	// 取消预约
	const handleCancelReservation = async () => {
		setCancelLoading(true);
		try {
			const response = await fetch(
				`/api/reservations/history/getSingleReservation?reservationId=${reservationId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error("取消预约失败");
			}

			toast.success(data.function.ReservationCancelledSuccess, {
				position: "top-center",
				duration: 2000,
			});

			setDialogOpen(false);

			// 延迟导航回列表页面，让用户看到成功提示
			setTimeout(() => {
				router.push("/reservation/history");
			}, 1500);
		} catch (error) {
			console.error("取消预约失败:", error);
			toast.error(data.function.ReservationCancelledFailed, {
				position: "top-center",
				duration: 2000,
			});
		} finally {
			setCancelLoading(false);
		}
	};

	// 返回按钮处理
	const handleBack = () => {
		router.push("/reservation/history");
	};

	// 复制账户号码
	const copyAccountNumber = () => {
		const accountNumber = "110599652515";

		// 创建临时输入框元素
		const tempInput = document.createElement("input");
		tempInput.value = accountNumber;
		document.body.appendChild(tempInput);

		// 选择内容
		tempInput.select();
		tempInput.setSelectionRange(0, 99999); // 兼容移动端

		// 尝试复制
		try {
			document.execCommand("copy");
			setCopying(true);
			toast.success("账号已复制到剪贴板", {
				position: "top-center",
				duration: 1500,
			});

			setTimeout(() => {
				setCopying(false);
			}, 2000);
		} catch (err) {
			console.error("复制失败:", err);
			toast.error("复制失败，请手动复制", {
				position: "top-center",
				duration: 2000,
			});
		} finally {
			// 删除临时元素
			document.body.removeChild(tempInput);
		}
	};

	if (loading) {
		return (
			<div className="w-11/12 pt-4 md:py-6 px-4 md:px-6 h-full bg-amber-200 rounded-t-3xl flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
			</div>
		);
	}

	if (!reservation) {
		return (
			<div
				className={`w-11/12 pt-4 md:py-6 px-4 md:px-6 h-full bg-amber-200 rounded-t-3xl ${zcool.className}`}
			>
				<div className="flex items-center mb-4">
					<Button variant="ghost" size="icon" onClick={handleBack}>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<h1 className="text-xl md:text-2xl font-bold ml-2">
						{data.tag.ReservationTitle}
					</h1>
				</div>
				<div className="bg-white rounded-lg p-6 text-center">
					<p className="text-gray-500">{data.tag.ReservationNotExist}</p>
					<Button className="mt-4" onClick={handleBack}>
						{data.tag.ReturnReservationList}
					</Button>
				</div>
			</div>
		);
	}

	const canCancel = reservation.status === "upcoming";
	const isWithin24Hours = !canCancelInTime(reservation.date);

	return (
		<div
			className={`w-11/12 pt-4 md:py-6 px-4 md:px-6 h-full bg-amber-200 rounded-t-3xl ${zcool.className}`}
		>
			<div className="flex items-center mb-4">
				<Button variant="ghost" size="icon" onClick={handleBack}>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-xl md:text-2xl font-bold ml-2">
					{data.tag.ReservationTitle}
				</h1>
			</div>

			<Card className="bg-white rounded-lg shadow-sm border-gray-100">
				<CardHeader className="pb-2">
					<div className="flex justify-between items-center">
						<CardTitle className="text-xl font-medium text-teal-400 gap-1 flex flex-col">
							<div className="">
								{data.tag.ReservationCode}
							</div>
							<div className="">
								#{reservation.id.substring(0, 8)}
							</div>
						</CardTitle>
						<Badge
							variant="outline"
							className={`${statusMap[reservation.status].className
								} px-2 py-1`}
						>
							{statusMap[reservation.status].label}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						<div className="flex justify-between items-center">
							<div className="text-gray-500">{data.tag.ReservationDate}</div>
							<div className="flex justify-end">
								{format(reservation.date, data.tag.DateFormat, {
									locale: zhCN,
								})}
							</div>
						</div>
						<div className="flex justify-between">
							<div className="text-gray-500">{data.tag.ReservationTime}</div>
							<div className="flex justify-end">
								{reservation.timeSlot}
							</div>
						</div>
						<div className="flex justify-between">
							<div className="text-gray-500">定金金额</div>
							<div className="flex justify-end">
								20,000 원
							</div>
						</div>
						<div className="flex justify-between items-center">
							<div className="text-gray-500">转账账户</div>
							<div className="flex flex-col justify-end items-end">
								<span>정영나(비버네일) 신한</span>
								<div className="flex items-center gap-1">
									<span>110599652515</span>
									<button
										onClick={copyAccountNumber}
										className="p-0.5 rounded hover:bg-gray-100 transition-colors"
										title="复制账号"
									>
										{copying ? (
											<Check className="h-3.5 w-3.5 text-green-500" />
										) : (
											<Copy className="h-3.5 w-3.5 text-gray-400" />
										)}
									</button>
								</div>
							</div>
						</div>
						{isWithin24Hours && canCancel && (
							<div className="col-span-2 mt-2 text-red-500 text-sm">
								{data.tag.ReservationWarning}
							</div>
						)}
					</div>
				</CardContent>
				<CardFooter>
					{canCancel ? (
						<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
							<DialogTrigger asChild>
								<Button
									variant="destructive"
									className="w-full"
									disabled={isWithin24Hours}
									title={
										isWithin24Hours
											? "预约无法取消：距离预约时间不足24小时（韩国时间）"
											: ""
									}
								>
									{data.tag.CancelReservation}
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>{data.tag.CancelReservationConfirm}</DialogTitle>
									<DialogDescription>
										{data.tag.CancelReservationConfirmWarning}
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => setDialogOpen(false)}
									>
										{data.tag.Return}
									</Button>
									<Button
										variant="destructive"
										onClick={handleCancelReservation}
										disabled={cancelLoading}
									>
										{cancelLoading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												{data.tag.Processing}
											</>
										) : (
											data.tag.ConfirmCancelled
										)}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					) : (
						<Button
							variant="outline"
							className="w-full"
							onClick={handleBack}
						>
							{data.tag.ReturnReservationList}
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
