"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Roboto } from "next/font/google";
import { ZCOOL_KuaiLe } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
const roboto = Roboto({ subsets: ["latin"], weight: "400" });
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";

const LoginPage = () => {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].auth.login
			.page;
	// 定义登录表单验证模式
	const loginSchema = z.object({
		account: z.string().min(1, data.function.SetAccountError),
		password: z.string().min(1, data.function.SetPasswordError),
	});

	const router = useRouter();
	const [account, setAccount] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{
		account?: string;
		password?: string;
	}>({});
	const [loading, setLoading] = useState(false);
	const searchParams = useSearchParams();

	useEffect(() => {
		// 检查是否有requireLogin参数
		if (searchParams.get("requireLogin") === "true") {
			toast.warning(data.function.LoginWarning, {
				position: "top-center",
				duration: 3000,
			});
		}
	}, [searchParams, data]);

	const validateForm = () => {
		try {
			loginSchema.parse({ account, password });
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const formattedErrors: {
					account?: string;
					password?: string;
				} = {};
				error.errors.forEach((err) => {
					const path = err.path[0] as string;
					formattedErrors[path as "account" | "password"] =
						err.message;
				});
				setErrors(formattedErrors);
			}
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// 验证表单
		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			// 直接使用 NextAuth 的 signIn 方法
			const result = await signIn("credentials", {
				username: account,
				password: password,
				redirect: false,
			});

			if (result?.error) {
				toast.error(data.function.AccountError, {
					position: "top-center",
					duration: 2000,
				});
			} else {
				// 获取回调URL或默认跳转到首页
				const callbackUrl = searchParams.get("callbackUrl") || "/";
				router.push(callbackUrl);
				toast.success(data.function.LoginSuccess, {
					position: "top-center",
					duration: 2000,
				});
			}
		} catch (error) {
			toast.error(data.function.LoginFailed, {
				position: "top-center",
				duration: 2000,
			});
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const handleLinkClick = (url?: string) => {
		router.push(url || "/");
	};
	const handleGoogleSignIn = (provider: string) => {
		setLoading(true);
		signIn(provider, { callbackUrl: "/" });
	};

	return (
		<div
			className={`w-full h-2/3 md:h-full flex items-end justify-center ${zcool.className}`}
		>
			<div className="border-none bg-gradient-to-r from-pink-300 to-pink-400 w-full md:w-2/3 h-full md:h-5/6 rounded-b-none rounded-t-full flex flex-col items-center justify-center">
				<form
					onSubmit={handleSubmit}
					className="w-2/3 flex flex-col justify-between h-full py-10 md:py-12"
				>
					<div className="flex items-center justify-center text-3xl md:text-5xl">
						{data.tag.WelcomeBack}
					</div>
					<div className="">
						<div className="text-lg md:text-xl">
							{data.tag.Account}
						</div>
						<Input
							value={account}
							onChange={(e) => setAccount(e.target.value)}
							className="border-b-2 border-black shadow-2xl focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
							disabled={loading}
						/>
						{errors.account && (
							<div className="text-red-500 text-sm mt-1">
								{errors.account}
							</div>
						)}
					</div>
					<div className="">
						<div className="text-lg md:text-xl">
							{data.tag.Password}
						</div>
						<div className="flex gap-3 items-center">
							<Input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="border-b-2 border-black shadow-2xl focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
								disabled={loading}
							/>
						</div>
						{errors.password && (
							<div className="text-red-500 text-sm mt-1">
								{errors.password}
							</div>
						)}
					</div>
					<div
						className="justify-end w-full flex text-sm md:text-base cursor-pointer"
						onClick={() =>
							handleLinkClick("/auth/forgetPassword/account")
						}
					>
						{data.tag.ForgetPassword}
					</div>
					<div className="flex justify-center items-center w-full">
						<Button type="submit" disabled={loading}>
							{loading ? data.tag.Logging : data.tag.Login}
						</Button>
					</div>

					{/* 添加 Google 登录按钮 */}
					<div
						className={`flex  gap-2 justify-center items-center w-full mt-4 ${roboto.className}`}
					>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								handleGoogleSignIn("google");
							}}
							disabled={loading}
							className="border-none rounded-4xl"
						>
							<FcGoogle size={20} />
							Google
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								handleGoogleSignIn("kakao");
							}}
							disabled={loading}
							className="border-none rounded-4xl bg-[#FEE500]"
						>
							<RiKakaoTalkFill className="" size={20} />
							Kakao
						</Button>
					</div>
					<div className="flex justify-center items-center w-full text-sm md:text-base mt-4">
						<div className="flex">
							<div className="">{data.tag.NoAccountYet}</div>
							<div
								className="cursor-pointer ml-1 text-blue-600"
								onClick={() =>
									handleLinkClick("/auth/register/account")
								}
							>
								{data.tag.RegisterNow}
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
