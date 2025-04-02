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

const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

export default function ConfirmationPage() {
	const router = useRouter();
	const [reservation, setReservation] = useState<{
		date: string;
		timeSlot: string;
	} | null>(null);
	const [error, setError] = useState<string | null>(null);

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
			} else {
				setError("未找到预约信息");
			}
		} catch (err) {
			console.error("读取预约信息失败:", err);
			setError("读取预约信息失败");
		}
	}, []);

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
					<CardDescription className="text-green-600">
						您的美甲服务已成功预约
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-6">
					{reservation ? (

						<div className="space-y-4">
                            <div className="flex justify-between">
								<span className="font-medium">订金金额：</span>
                                <span>
                                    20,000 원
								</span>
							</div>
							<div
								className="flex justify-between"
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
										toast.success("账户已复制到剪切板");
									}
								}
							>
								<span className="font-medium flex justify-center items-center">订金转账账户:</span>
								<div className="flex flex-col">
									<span className=" text-end">정영나 토스뱅크</span>
									<span className="">
										1001-2704-8397
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
							<div className="bg-yellow-50 p-4 rounded-md mt-4">
								<p className="text-yellow-800 text-sm">
									注意：定金是不予退还的！如需修改时间，请您提前一天声明（不追加额外定金）。
								</p>
							</div>
						</div>
					) : (
						<div className="text-center py-4">
							<p>加载预约信息中...</p>
						</div>
					)}
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
						onClick={() => router.push("/reservation/history")}
						className="bg-pink-500 hover:bg-pink-600"
					>
						查看我的预约
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
