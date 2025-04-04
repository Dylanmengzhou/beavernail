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

const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

export default function ConfirmationPage() {
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
				setError("未找到预约信息");
			}
		} catch (err) {
			console.error("读取预约信息失败:", err);
			setError("读取预约信息失败");
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
			const textarea = document.createElement("textarea");
			textarea.value = reservationId;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand("copy");
			document.body.removeChild(textarea);
			toast.success("预约编号已复制到剪贴板", {
				position: "top-center",
				duration: 2000,
			});
			setHasCopiedId(true); // 设置已复制状态为true
		}
	};

	// 处理联系客服按钮点击
	const handleContactClick = () => {
		if (!hasCopiedId && reservationId) {
			toast.warning("请先复制预约编号，再联系客服哟～", {
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
							无法加载预约信息
						</CardTitle>
						<CardDescription className="text-red-600">
							{error}
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-6 text-center">
						<p>可能是因为您尚未完成预约或者会话已过期</p>
					</CardContent>
					<CardFooter className="flex justify-center gap-4">
						<Button
							variant="outline"
							onClick={() => router.push("/")}
							className="border-pink-300 text-pink-500 hover:bg-pink-50"
						>
							返回首页
						</Button>
						<Button
							onClick={() => router.push("/reservation")}
							className="bg-pink-500 hover:bg-pink-600"
						>
							重新预约
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
						预约成功！
					</CardTitle>
				</CardHeader>
				<CardContent className="">
					{reservation ? (
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<span className="font-medium">预约编号:</span>
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<Loader2 className="h-4 w-4 animate-spin text-gray-500" />
										<span className="text-gray-500 text-sm">
											加载中...
										</span>
									</div>
								) : (
									<div className="flex items-center space-x-2">
										<span className="font-mono text-xs">
											{reservationId}
										</span>
										{reservationId && (
											<Button
												variant="outline"
												size="sm"
												className="h-7 px-2 text-xs border-pink-300 text-pink-500 hover:bg-pink-50"
												onClick={copyReservationId}
											>
												复制
											</Button>
										)}
									</div>
								)}
							</div>
							<div className="flex justify-between">
								<span className="font-medium">订金金额：</span>
								<span>20,000 원</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium flex justify-center items-center">
									订金转账账户:
								</span>
								<div className="flex flex-col">
									<span className=" text-end">정영나 토스뱅크</span>
									<span className="flex justify-center item-center gap-2">
										<span className="flex justify-center items-center">1001-2704-8397</span>
										<Button
											variant="outline"
											size="sm"
											className="h-7 px-2 text-xs border-pink-300 text-pink-500 hover:bg-pink-50"
											onClick={
												// 复制到剪切板
												() => {
													const textarea =
														document.createElement("textarea");
													textarea.value = "전영나 토스뱅크 1001-2704-8397";
													document.body.appendChild(textarea);
													textarea.select();
													document.execCommand("copy");
													document.body.removeChild(textarea);
													toast.success("账户已复制到剪切板", {
														position: "top-center",
														duration: 2000,
													  });
												}
											}
										>
											复制
										</Button>
									</span>
								</div>
							</div>

							<div className="flex justify-between">
								<span className="font-medium">预约日期:</span>
								<span>
									{new Date(reservation.date).toLocaleDateString(
										"zh-CN"
									)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">预约时间:</span>
								<span>{reservation.timeSlot}</span>
							</div>
							<div className="bg-yellow-50 p-2 rounded-md mt-4">
								<p className="text-yellow-800 text-sm text-center font-medium">
									注意
								</p>
								<ul className="text-yellow-800 text-sm list-inside space-y-1">
									<li className="flex items-start">
										<span className="mr-2">•</span>
										<span>
											点击
											<strong className="font-bold text-red-400">
												联系客服
											</strong>
											，发送
											<strong className="font-bold text-red-400">
												订单编号
											</strong>
											与
											<strong className="font-bold text-red-400">
												定金转账截图
											</strong>
											。
										</span>
									</li>
									<li className="flex items-start">
										<span className="mr-2">•</span>
										<span>
											如预约后
											<strong className="font-bold text-red-400">
												一小时内
											</strong>
											未支付定金，将视为放弃预约。
										</span>
									</li>
									<li className="flex items-start">
										<span className="mr-2">•</span>
										<span>
											<strong className="font-bold text-red-400">
												定金是不予退还的！
											</strong>
											如需修改时间，请您
											<strong className="font-bold text-red-400">
												提前一天
											</strong>
											声明（不追加额外定金）。
										</span>
									</li>
								</ul>
							</div>
						</div>
					) : (
						<div className="text-center py-4">
							<p>加载预约信息中...</p>
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
						联系客服
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
