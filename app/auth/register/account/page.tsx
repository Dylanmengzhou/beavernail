"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ZCOOL_KuaiLe } from "next/font/google";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { useRegisterStore } from "../registerStore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

const AccountRegisterPage = () => {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].auth
			.register.account.page;


	const router = useRouter();
	const {
		account,
		password,
		confirmPassword,
		setAccount,
		setPassword,
		setConfirmPassword,
	} = useRegisterStore();
	const [errors, setErrors] = useState<{
		account?: string;
		password?: string;
		confirmPassword?: string;
	}>({});
	const [isLoading, setIsLoading] = useState(false);


	const handleLinkClick = (url?: string) => {
		router.push(url || "/");
	};

	const validateForm = () => {
		const newErrors: {
			account?: string;
			password?: string;
			confirmPassword?: string;
		} = {};

		if (!account) {
			newErrors.account = data.function.EnterAccount;
		}

		if (!password) {
			newErrors.password = data.function.EnterPassword;
		} else if (password.length < 6) {
			newErrors.password = data.function.PasswordPatternError;
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = data.function.PleaseConfirmPassword;
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = data.function.ConfirmPasswordError;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNextStep = async () => {
		if (validateForm()) {
			setIsLoading(true);
			try {
				const response = await fetch("/api/register", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						account,
						password: "test",
						securityQuestion: "test",
						securityAnswer: "test",
						nickname: "test",
						gender: "test",
						mode: "check",
					}),
				});

				const data_api = await response.json();
				console.log(data_api);

				if (data_api.success) {
					router.push("/auth/register/securityQuestion");
				} else {
					toast.error(data_api.message, {
						position: "top-center",
						duration: 2000,
					});
					setIsLoading(false);
				}
			} catch (error) {
				console.error(data.function.RegisterRequestFailed, error);
				toast.error(data.function.RegisterRequestFailed, {
					position: "top-center",
					duration: 2000,
				});
				setIsLoading(false);
			}
		} else {
			toast.error(data.function.CheckTheFormPattern, {
				position: "top-center",
				duration: 2000,
			});
		}
	};

	return (
		<div
			className={`bg-[url('/background_img.png')] bg-cover bg-center w-full h-full flex items-end justify-center ${zcool.className}`}
		>
			<div className="border-none bg-gradient-to-r from-pink-300 to-pink-400 w-full md:w-2/3 h-fit md:h-full rounded-b-none rounded-t-full flex flex-col items-center justify-center">
				<div className="w-2/3 flex flex-col justify-between h-full py-12 gap-5">
					<div className="flex items-center justify-center text-3xl md:text-5xl">
						{data.tag.Register}
					</div>
					<div className="">
						<div className="text-lg">{data.tag.Account}</div>
						<Input
							value={account}
							onChange={(e) => setAccount(e.target.value)}
							className="border-b-2 border-transparent shadow-sm focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
							disabled={isLoading}
						/>
						{errors.account && (
							<p className="text-red-500 text-sm mt-1">
								{errors.account}
							</p>
						)}
					</div>
					<div className="">
						<div className="text-lg">{data.tag.Password}</div>
						<div className="flex gap-3 items-center">
							<Input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="border-b-2 border-transparent shadow-sm focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
								disabled={isLoading}
							/>
						</div>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">
								{errors.password}
							</p>
						)}
					</div>
					<div className="">
						<div className="text-lg">{data.tag.ConfirmPassword}</div>
						<div className="flex gap-3 items-center">
							<Input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="border-b-2 border-transparent shadow-sm focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
								disabled={isLoading}
							/>
						</div>
						{errors.confirmPassword && (
							<p className="text-red-500 text-sm mt-1">
								{errors.confirmPassword}
							</p>
						)}
					</div>
					<div className="flex justify-center items-center w-full">
						<Button
							onClick={handleNextStep}
							disabled={isLoading}
							className="min-w-[100px]"
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{data.tag.Checking}
								</>
							) : (
								data.tag.Next
							)}
						</Button>
					</div>
					<div className="flex justify-center items-center w-full text-sm md:text-base">
						<div className="flex">
							<div className="">{data.tag.AlreadyHaveAnAccount}</div>
							<div
								className={`ml-1 cursor-pointer text-blue-600 ${
									isLoading ? "pointer-events-none opacity-70" : ""
								}`}
								onClick={() =>
									!isLoading && handleLinkClick("/auth/login")
								}
							>
								{data.tag.LoginNow}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AccountRegisterPage;
