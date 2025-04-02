"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ZCOOL_KuaiLe } from "next/font/google";
import { useState } from "react";
import { useForgetPasswordStore } from "@/lib/store/forgetPasswordStore";
import { toast } from "sonner";

const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

const ForgetPasswordPage = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [localAccount, setLocalAccount] = useState("");
	const [localAnswer, setLocalAnswer] = useState("");

	const {
		securityQuestion,
		setAccount,
		setSecurityQuestion,
		setSecurityAnswer,
		setStep,
		setError,
	} = useForgetPasswordStore();

	const handleLinkClick = (url?: string) => {
		router.push(url || "/");
	};

	// 检查账号并获取安全问题
	const handleCheckAccount = async () => {
		if (!localAccount) {
			setError("请输入账号");
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/forgetPassword?account=${localAccount}`
			);
			const data = await response.json();

			if (data.success) {
				setAccount(localAccount);
				setSecurityQuestion(data.securityQuestion);
				setError("");
			} else {
				setError(data.message || "账号不存在");

				toast.error(data.message, {
					position: "top-center",
					duration: 2000,
				});
			}
		} catch (error) {
			console.error("获取安全问题失败:", error);
			setError("服务器错误，请稍后再试");

			toast.error("服务器错误，请稍后再试", {
				position: "top-center",
				duration: 2000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	// 验证安全问题答案
	const handleVerifyAnswer = async () => {
		if (!localAnswer) {
			setError("请输入安全问题答案");
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch("/api/forgetPassword", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					account: localAccount,
					securityAnswer: localAnswer,
				}),
			});

			const data = await response.json();

			if (data.success) {
				setSecurityAnswer(localAnswer);
				setStep("resetPassword");
				router.push("/auth/forgetPassword/resetPass");
			} else {
				setError(data.message || "安全问题答案错误");

				toast.warning(data.message, {
					position: "top-center",
					duration: 2000,
				});
			}
		} catch (error) {
			console.error("验证安全问题失败:", error);
			setError("服务器错误，请稍后再试");

			toast.error("服务器错误，请稍后再试", {
				position: "top-center",
				duration: 2000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className={`bg-[url('/background_img.png')] bg-cover bg-center w-full h-full flex items-end justify-center ${zcool.className}`}
		>
			<div className="border-none bg-gradient-to-r from-pink-300 to-pink-400 w-full md:w-2/3 h-2/3 md:h-full rounded-b-none rounded-t-full flex flex-col items-center justify-center">
				<div className="w-2/3 flex flex-col justify-between h-full py-12">
					<div className="flex items-center justify-center text-3xl md:text-5xl">
						账户确认
					</div>
					<div className="">
						<div className="text-lg md:text-xl">账号</div>
						<Input
							className="border-b-2 border-black shadow-2xl focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
							value={localAccount}
							onChange={(e) => setLocalAccount(e.target.value)}
							disabled={!!securityQuestion}
						/>
					</div>

					{!securityQuestion ? (
						<div className=""></div>
					) : (
						<div className="">
							<div className="text-lg md:text-xl">
								安全问题：{securityQuestion}
							</div>
							<Input
								className="border-b-2 border-black shadow-2xl focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
								value={localAnswer}
								onChange={(e) => setLocalAnswer(e.target.value)}
							/>
						</div>
					)}

					{/* {error && (
						<div className="text-red-500 text-sm">{error}</div>
					)} */}

					<div className="flex justify-center items-center w-full">
						{!securityQuestion ? (
							<Button
								onClick={handleCheckAccount}
								disabled={isLoading}
							>
								{isLoading ? "检查中..." : "检查账号"}
							</Button>
						) : (
							<Button
								onClick={handleVerifyAnswer}
								disabled={isLoading}
							>
								{isLoading ? "验证中..." : "下一步"}
							</Button>
						)}
					</div>

					<div className="flex justify-center items-center w-full text-sm md:text-base">
						<div className="flex">
							<div
								className="cursor-pointer hover:underline"
								onClick={() => handleLinkClick("/auth/login")}
							>
								返回登录页面
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgetPasswordPage;
