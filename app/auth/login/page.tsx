"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ZCOOL_KuaiLe } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { toast } from "sonner";

const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

// 定义登录表单验证模式
const loginSchema = z.object({
  account: z.string().min(1, "请输入账号"),
  password: z.string().min(1, "请输入密码"),
});

const LoginPage = () => {
	const router = useRouter();
	const [account, setAccount] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{ account?: string; password?: string }>({});
	const [loading, setLoading] = useState(false);

	const validateForm = () => {
		try {
			loginSchema.parse({ account, password });
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const formattedErrors: { account?: string; password?: string } = {};
				error.errors.forEach((err) => {
					const path = err.path[0] as string;
					formattedErrors[path as 'account' | 'password'] = err.message;
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
			const res = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ account, password }),
			});
			const data = await res.json();

			if (data?.success === false) {
				toast(data.message, {
					position: "top-center",
					duration: 2000,
				});
			} else {
				await signIn("credentials", {
					username: account,
					password: password,
					redirect: true,
					callbackUrl: "/profile", // 登录成功后跳转的页面
				});
			}
		} catch (error) {
			toast("登录失败，请稍后重试", {
				position: "top-center",
				duration: 2000,
			});
			console.log(error)
		} finally {
			setLoading(false);
		}
	};

	const handleLinkClick = (url?: string) => {
		router.push(url || "/");
	};
	return (
		<div
			className={`bg-[url('/background_img.png')] bg-cover bg-center w-full h-2/3 md:h-full flex items-end justify-center ${zcool.className}`}
		>
			<div className="border-none bg-gradient-to-r from-pink-300 to-pink-400 w-full md:w-2/3 h-full md:h-5/6 rounded-b-none rounded-t-full flex flex-col items-center justify-center">
				<form
					onSubmit={handleSubmit}
					className="w-2/3 flex flex-col justify-between h-full py-10 md:py-12"
				>
					<div className="flex items-center justify-center text-3xl md:text-5xl">
						欢迎回来
					</div>
					<div className="">
						<div className="text-lg md:text-xl">账号</div>
						<Input
							value={account}
							onChange={(e) => setAccount(e.target.value)}
							className="border-b-2 border-black shadow-2xl focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
							disabled={loading}
						/>
						{errors.account && (
							<div className="text-red-500 text-sm mt-1">{errors.account}</div>
						)}
					</div>
					<div className="">
						<div className="text-lg md:text-xl">密码</div>
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
							<div className="text-red-500 text-sm mt-1">{errors.password}</div>
						)}
					</div>
					<div
						className="justify-end w-full flex text-sm md:text-base cursor-pointer"
						onClick={() =>
							handleLinkClick("/auth/forgetPassword/account")
						}
					>
						忘记密码?
					</div>
					<div className="flex justify-center items-center w-full">
						<Button type="submit" disabled={loading}>
							{loading ? "登录中..." : "登录"}
						</Button>
					</div>
					<div className="flex justify-center items-center w-full text-sm md:text-base">
						<div className="flex">
							<div className="">还没有账号？</div>
							<div
								className="cursor-pointer ml-1 text-blue-600"
								onClick={() =>
									handleLinkClick("/auth/register/account")
								}
							>
								注册
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
