"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ZCOOL_KuaiLe } from "next/font/google";
import { useState, useEffect } from "react";
import { useForgetPasswordStore } from "@/lib/store/forgetPasswordStore";
import { toast } from "sonner";
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";

const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

const ResetPasswordPage = () => {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].auth
			.forgetPassword.resetPass.page;
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const {
		account,
		newPassword,
		confirmPassword,
		setNewPassword,
		setConfirmPassword,
		reset,
		step,
	} = useForgetPasswordStore();

	// 如果用户直接访问此页面而不是通过流程，则重定向回账户确认页面
	useEffect(() => {
		// 添加一个标记，防止重置密码成功后的跳转被拦截
		const isRedirecting = sessionStorage.getItem(
			"isRedirectingToLogin"
		);

		if (isRedirecting === "true") {
			// 如果是重置成功后的跳转，清除标记并允许跳转
			sessionStorage.removeItem("isRedirectingToLogin");
			return;
		}

		if (step !== "resetPassword" || !account) {
			router.push("/auth/forgetPassword/account");
		}
	}, [account, router, step]);

	const handleLinkClick = (url?: string) => {
		router.push(url || "/");
	};

	const handleResetPassword = async () => {
		// 验证密码
		if (!newPassword) {
			toast.warning(data.function.InputPasswordError, {
				position: "top-center",
				duration: 2000,
			});
			return;
		}

		if (newPassword.length < 6) {
			toast.warning(data.function.InputPasswordPatternError, {
				position: "top-center",
				duration: 2000,
			});
			return;
		}

		if (newPassword !== confirmPassword) {
			toast.warning(data.function.InputPasswordMissMatchError, {
				position: "top-center",
				duration: 2000,
			});
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch("/api/updatePassword", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					account,
					password: newPassword,
				}),
			});

			const data_api = await response.json();

			if (data_api.success) {
				toast.success(data.function.ResetPasswordSuccess, {
					position: "top-center",
					duration: 2000,
				});

				// 设置标记，表示即将跳转到登录页
				sessionStorage.setItem("isRedirectingToLogin", "true");

				reset(); // 重置状态
				router.push("/auth/login");
			} else {
				toast.error(data_api.message, {
					position: "top-center",
					duration: 2000,
				});
			}
		} catch (error) {
			console.error(data.function.ResetPasswordFailed, error);

			toast.error(data.function.ServerError, {
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
						{data.tag.ResetPassword}
					</div>
					<div className="">
            <div className="text-lg md:text-xl">{data.tag.NewPassword}</div>
						<div className="flex gap-3 items-center">
							<Input
								type="password"
								className="border-b-2 border-black shadow-2xl focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
					</div>
					<div className="">
						<div className="text-lg md:text-xl">{data.tag.ConfirmPassword}</div>
						<div className="flex gap-3 items-center">
							<Input
								type="password"
								className="border-b-2 border-black shadow-2xl focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</div>
					</div>

					<div className="flex">
						<div className="flex justify-center items-center w-full">
							<Button
								onClick={handleResetPassword}
								disabled={isLoading}
							>
								{isLoading ? data.tag.Resetting : data.tag.Reset}
							</Button>
						</div>
					</div>

					<div className="flex justify-center items-center w-full text-sm md:text-base">
						<div className="flex">
							<div
								className="cursor-pointer hover:underline"
								onClick={() => handleLinkClick("/auth/login")}
							>
								{data.tag.BackToLogin}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordPage;
