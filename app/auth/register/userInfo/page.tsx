"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ZCOOL_KuaiLe } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useRegisterStore } from "../registerStore";
import { toast } from "react-hot-toast";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";

const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

const UserInfoPage = () => {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].auth
			.register.userInfo.page;
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [birthdayString, setBirthdayString] = useState("");
	const {
		account,
		password,
		securityQuestion,
		securityAnswer,
		nickname,
		gender,
		birthday,
		setNickname,
		setGender,
		setBirthday,
		reset,
	} = useRegisterStore();

	// 添加一个useEffect来处理birthdayString的变化
	useEffect(() => {
		if (birthdayString.length === 8) {
			// 格式为YYYYMMDD，如20000613
			const year = parseInt(birthdayString.substring(0, 4));
			const month = parseInt(birthdayString.substring(4, 6)) - 1; // 月份从0开始
			const day = parseInt(birthdayString.substring(6, 8));

			// 创建Date对象
			const birthdayDate = new Date(year, month, day);

			// 检查日期是否有效
			if (!isNaN(birthdayDate.getTime())) {
				setBirthday(birthdayDate);
			}
		}
	}, [birthdayString, setBirthday]);

	const handleLinkClick = (url?: string) => {
		router.push(url || "/");
	};

	const handleRegister = async () => {
		// 验证前面步骤的数据是否完整
		if (
			!account ||
			!password ||
			!securityQuestion ||
			!securityAnswer
		) {
			toast.error(data.function.PleaseAccomplishBeforeRegister, {
				position: "top-center",
				duration: 2000,
			});
			router.push("/auth/register/account");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					account,
					password,
					securityQuestion,
					securityAnswer,
					birthday: birthday || undefined,
					nickname: nickname || undefined,
					gender: gender || undefined,
					mode: "create",
				}),
			});

			const data_api = await response.json();

			if (data_api.success) {
				toast.success(data.function.RegisterSuccess, {
					position: "top-center",
					duration: 2000,
				});
				reset(); // 重置表单
				router.push("/auth/login");
			} else {
				toast.error(data.function.RegisterFailed, {
					position: "top-center",
					duration: 2000,
				});
				// toast.error(`注册失败: ${data_api.message}`, {
				// 	position: "top-center",
				// 	duration: 2000,
				// });
			}
		} catch (error) {
			console.error("注册请求失败:", error);
			toast.error(data.function.RegisterFailed, {
				position: "top-center",
				duration: 2000,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			className={`bg-[url('/background_img.png')] bg-cover bg-center w-full h-full flex items-end justify-center ${zcool.className}`}
		>
			<div className="border-none bg-gradient-to-r from-pink-300 to-pink-400 w-full md:w-2/3 h-fit md:h-full rounded-b-none rounded-t-full flex flex-col items-center justify-center">
				<div className="w-2/3 flex flex-col justify-between h-full py-12 gap-5">
					<div className="flex items-center justify-center text-3xl md:text-5xl">
						{data.tag.PersonalInfo}
					</div>
					<div className="">
						<div className="text-lg">{data.tag.NickName}</div>
						<div className="flex gap-3 items-center">
							<Input
								value={nickname}
								onChange={(e) => setNickname(e.target.value)}
								className="border-b-2 border-transparent shadow-sm focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
								disabled={isSubmitting}
							/>
						</div>
					</div>
					<div className="">
						<div className="text-lg">{data.tag.Birthday}</div>
						<div className="flex gap-3 items-center">
							<InputOTP
								maxLength={8}
								className="border-black"
								value={birthdayString}
								onChange={(birthdayString) =>
									setBirthdayString(birthdayString)
								}
								disabled={isSubmitting}
							>
								<InputOTPGroup>
									<InputOTPSlot index={0} />
									<InputOTPSlot index={1} />
									<InputOTPSlot index={2} />
									<InputOTPSlot index={3} />
								</InputOTPGroup>
								<div className="">-</div>
								<InputOTPGroup>
									<InputOTPSlot index={4} />
									<InputOTPSlot index={5} />
								</InputOTPGroup>
								<div className="">-</div>
								<InputOTPGroup>
									<InputOTPSlot index={6} />
									<InputOTPSlot index={7} />
								</InputOTPGroup>
							</InputOTP>
						</div>
					</div>
					<div className="">
						<div className="text-lg">{data.tag.Gender}</div>
						<div className="flex gap-3 items-center">
							<Select
								value={gender}
								onValueChange={setGender}
								disabled={isSubmitting}
							>
								<SelectTrigger className="w-[180px] border-none">
									<SelectValue placeholder={data.tag.PleaseEnterGender} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="MALE">{data.tag.Male}</SelectItem>
									<SelectItem value="FEMALE">{data.tag.Female}</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex">
						<div
							className="flex justify-center items-center w-full"
							onClick={() =>
								handleLinkClick("/auth/register/securityQuestion")
							}
						>
							<Button variant="outline">{data.tag.Back }</Button>
						</div>
						<div className="flex justify-center items-center w-full">
							<Button
								onClick={handleRegister}
								disabled={isSubmitting}
							>
								{isSubmitting ? data.tag.Registering : data.tag.Register}
							</Button>
						</div>
					</div>
					<div className="flex justify-center items-center w-full text-sm md:text-base">
						<div className="flex">
							<div className="">{data.tag.AlreadyHaveAnAccount}</div>
							<div
								className="ml-1 cursor-pointer text-blue-600"
								onClick={() => handleLinkClick("/auth/login")}
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

export default UserInfoPage;
