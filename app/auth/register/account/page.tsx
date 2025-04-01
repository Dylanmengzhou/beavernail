"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ZCOOL_KuaiLe } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegisterStore } from "../registerStore";
import { toast } from "sonner";

const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

const AccountRegisterPage = () => {
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
			newErrors.account = "请输入账号";
		}

		if (!password) {
			newErrors.password = "请输入密码";
		} else if (password.length < 6) {
			newErrors.password = "密码长度至少为6位";
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = "请确认密码";
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = "两次输入的密码不一致";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

  const handleNextStep = async () => {
    if (validateForm()) {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account,
            password:"test",
            securityQuestion:"test",
            securityAnswer:"test",
            nickname:"test",
            gender: "test",
            mode:"check"
          }),
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
          router.push("/auth/register/securityQuestion");
        } else {
          toast(data.message, {
            position: "top-center",
            duration: 2000,
          });
        }
      } catch (error) {
        console.error("我靠:", error);
        toast("注册请求失败", {
          position: "top-center",
          duration: 2000,
        });
      }

    } else {
      toast.error("请检查表单填写是否正确");
    }

	};

	return (
		<div
			className={`bg-[url('/background_img.png')] bg-cover bg-center w-full h-full flex items-end justify-center ${zcool.className}`}
		>
			<div className="border-none bg-gradient-to-r from-pink-300 to-pink-400 w-full md:w-2/3 h-fit md:h-full rounded-b-none rounded-t-full flex flex-col items-center justify-center">
				<div className="w-2/3 flex flex-col justify-between h-full py-12 gap-5">
					<div className="flex items-center justify-center text-3xl md:text-5xl">
						注册
					</div>
					<div className="">
						<div className="text-lg">账号</div>
						<Input
							value={account}
							onChange={(e) => setAccount(e.target.value)}
							className="border-b-2 border-transparent shadow-sm focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
						/>
						{errors.account && (
							<p className="text-red-500 text-sm mt-1">
								{errors.account}
							</p>
						)}
					</div>
					<div className="">
						<div className="text-lg">密码</div>
						<div className="flex gap-3 items-center">
							<Input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="border-b-2 border-transparent shadow-sm focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
							/>
						</div>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">
								{errors.password}
							</p>
						)}
					</div>
					<div className="">
						<div className="text-lg">确认密码</div>
						<div className="flex gap-3 items-center">
							<Input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="border-b-2 border-transparent shadow-sm focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
							/>
						</div>
						{errors.confirmPassword && (
							<p className="text-red-500 text-sm mt-1">
								{errors.confirmPassword}
							</p>
						)}
					</div>
					<div className="flex justify-center items-center w-full">
						<Button onClick={handleNextStep}>下一步</Button>
					</div>
					<div className="flex justify-center items-center w-full text-sm md:text-base">
						<div className="flex">
							<div className="">已经有账号？</div>
							<div
								className="ml-1 cursor-pointer hover:underline"
								onClick={() => handleLinkClick("/auth/login")}
							>
								登录
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AccountRegisterPage;
