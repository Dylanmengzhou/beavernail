"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ZCOOL_KuaiLe } from "next/font/google";
import { useState } from "react";
import { useForgetPasswordStore } from "@/lib/store/forgetPasswordStore";
import { toast } from "sonner";
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";

const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

const ForgetPasswordPage = () => {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].auth
			.forgetPassword.account.page;

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
			setError(data.function.SetCheckAccountError);
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
				setError(
					data.message || data.function.SetMissingAccountError
				);

				toast.error(data.message, {
					position: "top-center",
					duration: 2000,
				});
			}
		} catch (error) {
			console.error(data.function.GetSecurityQuestionError, error);
			setError(data.function.InternalServerError);

			toast.error(data.function.InternalServerError, {
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
			setError(data.function.InputSecurityQuestionAnswer);
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
				setError(data.message || data.function.SecurityAnswerError);

				toast.warning(data.message, {
					position: "top-center",
					duration: 2000,
				});
			}
		} catch (error) {
			console.error(data.function.CheckSecurityAnswerError, error);
			setError(data.function.InternalServerError);

			toast.error(data.function.InternalServerError, {
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
						{data.tag.AccountConfirmation}
					</div>
					<div className="">
						<div className="text-lg md:text-xl">
							{data.tag.Account}
						</div>
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
								{data.tag.SecurityQuestion}
								{securityQuestion}
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
								{isLoading
									? data.tag.Checking
									: data.tag.CheckAccount}
							</Button>
						) : (
							<Button
								onClick={handleVerifyAnswer}
								disabled={isLoading}
							>
								{isLoading ? data.tag.Verifying : data.tag.Next}
							</Button>
						)}
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

export default ForgetPasswordPage;
