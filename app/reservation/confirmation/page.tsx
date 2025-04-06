"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ZCOOL_KuaiLe } from "next/font/google";
import { Loader2 } from "lucide-react"; // 添加Loader2图标
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

export default function ConfirmationPage() {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].reservation
			.confirmation.page;
	const router = useRouter();
	const [reservation, setReservation] = useState<{
		date: string;
		timeSlot: string;
		rawDate: Date;
	} | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [reservationId, setReservationId] = useState<string | null>(
		null
	);

	useEffect(() => {
		try {
			// 从本地存储获取预约信息
			const storedReservation = localStorage.getItem(
				"latestReservation"
			);
			console.log("存储的预约信息:", storedReservation);

			if (storedReservation) {
				const parsedReservation = JSON.parse(storedReservation);
				setReservation(parsedReservation);

				// 获取预约ID
				fetchReservationId(
					parsedReservation.date,
					parsedReservation.timeSlot
				);
			} else {
				setError(data.function.NotFoundReservationInfo);
			}
		} catch (err) {
			console.error("读取预约信息失败:", err);
			setError(data.function.ReadingReservationInfoError);
		}
	}, []);

	const [isLoading, setIsLoading] = useState(true); // 添加加载状态

	// 获取预约ID的函数
	const fetchReservationId = async (
		date: string,
		timeSlot: string
	) => {
		setIsLoading(true); // 开始加载
		try {
			const response = await fetch("/api/reservations/getById", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ date, timeSlot }),
			});

			if (response.ok) {
				const data = await response.json();
				setReservationId(data.id);
			} else {
				console.error("获取预约ID失败");
			}
		} catch (error) {
			console.error("获取预约ID请求失败:", error);
		} finally {
			setIsLoading(false); // 结束加载
		}
	};

	const [hasCopiedId, setHasCopiedId] = useState(false); // 添加状态跟踪是否已复制预约编号

	// 复制预约编号到剪贴板
	const copyReservationId = () => {
		if (reservationId) {
			// 检查navigator.clipboard是否可用
			if (
				navigator.clipboard &&
				typeof navigator.clipboard.writeText === "function"
			) {
				navigator.clipboard
					.writeText(reservationId)
					.then(() => {
						toast.success(data.function.ReservationCodeCopied, {
							position: "top-center",
							duration: 2000,
						});
						setHasCopiedId(true); // 设置已复制状态为true
					})
					.catch((err) => {
						console.error(
							data.function.CopyReservationCodeError,
							err
						);
						// 如果现代API失败，回退到传统方法
						fallbackCopyTextToClipboard(reservationId,data.function.ReservationCodeCopied);
					});
			} else {
				// 如果不支持现代API，使用传统方法
				fallbackCopyTextToClipboard(reservationId,data.function.ReservationCodeCopied);
			}
		}
	};

	// 传统复制方法作为后备
	const fallbackCopyTextToClipboard = (text: string, message: string): void => {
		try {
			const textarea = document.createElement("textarea");
			textarea.value = text;
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
				toast.success(message, {
					position: "top-center",
					duration: 2000,
				});
				setHasCopiedId(true);
			} else {
				toast.error(data.function.CopyReservationCodeError, {
					position: "top-center",
				});
			}
		} catch (err) {
			console.error("复制失败:", err);
			toast.error(data.function.CopyReservationCodeError, {
				position: "top-center",
			});
		}
	};

	// 处理联系客服按钮点击
	const handleContactClick = () => {
		if (!hasCopiedId && reservationId) {
			toast.warning(data.function.CopyReservationCodeFirst, {
				position: "top-center",
				duration: 2000,
			});
		} else {
			router.push("/contact");
		}
	};

	// 如果没有预约信息，提供返回预约页面的选项
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-4">
				<Card className="w-full max-w-md shadow-xl">
					<CardHeader
						className={`bg-red-100 text-center ${zcool.className}`}
					>
						<CardTitle className="text-2xl text-red-800">
							{data.tag.CannotLoadReservationInfo}
						</CardTitle>
						<CardDescription className="text-red-600">
							{error}
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-6 text-center">
						<p>{data.tag.Reason}</p>
					</CardContent>
					<CardFooter className="flex justify-center gap-4">
						<Button
							variant="outline"
							onClick={() => router.push("/")}
							className="border-pink-300 text-pink-500 hover:bg-pink-50"
						>
							{data.tag.BackToMain}
						</Button>
						<Button
							onClick={() => router.push("/reservation")}
							className="bg-pink-500 hover:bg-pink-600"
						>
							{data.tag.Rereserve}
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center h-full p-4">
			<Card className="w-full max-w-md shadow-xl border-none pt-0 ">
				<CardHeader
					className={`bg-green-100 text-center rounded-t-xl py-4 ${zcool.className}`}
				>
					<CardTitle className="text-2xl text-green-800">
						{data.tag.ReservedSuccessfully}
					</CardTitle>
				</CardHeader>
				<CardContent className="">
					{reservation ? (
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<span className="font-medium">
									{data.tag.ReservationCode}:
								</span>
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<Loader2 className="h-4 w-4 animate-spin text-gray-500" />
										<span className="text-gray-500 text-sm">
											{data.tag.Loading}
										</span>
									</div>
								) : (
									<div className="flex items-center space-x-2">
										<span className="font-mono text-base">
											{reservationId?.substring(0, 8)}
										</span>
										{reservationId && (
											<Button
												variant="outline"
												size="sm"
												className="h-7 px-2 text-xs border-pink-300 text-pink-500 hover:bg-pink-50"
												onClick={copyReservationId}
											>
												{data.tag.Copy}
											</Button>
										)}
									</div>
								)}
							</div>
							<div className="flex justify-between">
								<span className="font-medium">
									{data.tag.DepositAmount}
								</span>
								<span>20,000 원</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium flex justify-center items-center">
									{data.tag.DepositAccount}
								</span>
								<div className="flex flex-col">
									<span className=" text-end">정영나 토스뱅크</span>
									<span className="flex justify-center item-center gap-2">
										<span className="flex justify-center items-center">
											1001-****-8397
										</span>
										<Button
											variant="outline"
											size="sm"
											className="h-7 px-2 text-xs border-pink-300 text-pink-500 hover:bg-pink-50"
											onClick={() => {
												const address =
													"정영나 토스뱅크 1001-2704-8397";
												// 检查navigator.clipboard是否可用
												if (
													navigator.clipboard &&
													typeof navigator.clipboard.writeText ===
														"function"
												) {
													navigator.clipboard
														.writeText(address)
														.then(() => {
															toast.success(
																data.tag.AccountAlreadyCopied,
																{
																	position: "top-center",
																	duration: 2000,
																}
															);
														})
														.catch((err) => {
															console.error("复制失败:", err);
															// 如果现代API失败，回退到传统方法
															fallbackCopyTextToClipboard(address,data.tag.AccountAlreadyCopied);
														});
												} else {
													// 如果不支持现代API，使用传统方法
													fallbackCopyTextToClipboard(address,data.tag.AccountAlreadyCopied);
												}
											}}
										>
											{data.tag.Copy}
										</Button>
									</span>
								</div>
							</div>

							<div className="flex justify-between">
								<span className="font-medium">
									{data.tag.ReservationDate}
								</span>
								<span>
									{new Date(reservation.date).toLocaleDateString(
										"zh-CN"
									)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">
									{data.tag.ReservationTime}
								</span>
								<span>{reservation.timeSlot}</span>
							</div>
							<div className="bg-yellow-50 p-2 rounded-md mt-4">
								<p className="text-yellow-800 text-sm text-center font-medium">
									{data.tag.Attention}
								</p>
								<ul className="text-yellow-800 text-sm list-inside space-y-1">
									<li className="flex items-start">
										<span className="mr-2">•</span>
										<span>
											<strong className="font-bold text-red-400">
												{data.tag.AttentionA.a}
											</strong>
											{data.tag.AttentionA.b}
											<strong className="font-bold text-red-400">
												{data.tag.AttentionA.c}
											</strong>
											{data.tag.AttentionA.d}
											<strong className="font-bold text-red-400">
												{data.tag.AttentionA.e}
											</strong>
											.
										</span>
									</li>
									<li className="flex items-start">
										<span className="mr-2">•</span>
										<span>
											{data.tag.AttentionB.a}
											<strong className="font-bold text-red-400">
												{data.tag.AttentionB.b}
											</strong>
											{data.tag.AttentionB.c}
										</span>
									</li>
									<li className="flex items-start">
										<span className="mr-2">•</span>
										<span>
											<strong className="font-bold text-red-400">
												{data.tag.AttentionC.a}
											</strong>
											{data.tag.AttentionC.b}
											<strong className="font-bold text-red-400">
												{data.tag.AttentionC.c}
											</strong>
											{data.tag.AttentionC.d}
											<strong className="font-bold text-red-400">
												{data.tag.AttentionC.e}
											</strong>
											{data.tag.AttentionC.f}
										</span>
									</li>
									<li className="flex items-start">
										<span className="mr-2">•</span>
										<span>
											{data.tag.AttentionD.a}
											<strong className="font-bold text-red-400">
												{data.tag.AttentionD.b}
											</strong>
											{data.tag.AttentionD.c}
										</span>
									</li>
								</ul>
							</div>
						</div>
					) : (
						<div className="text-center py-4">
							<p>{data.tag.LoadingInfo}</p>
						</div>
					)}
				</CardContent>
				<CardFooter className="flex justify-center gap-4">
					{/* <Button
						variant="outline"
						onClick={() => router.push("/")}
						className="border-pink-300 text-pink-500 hover:bg-pink-50"
					>
						返回首页
					</Button> */}
					<Button
						onClick={handleContactClick}
						className="bg-pink-500 hover:bg-pink-600"
						disabled={isLoading}
					>
						{data.tag.Contact}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
