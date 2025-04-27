"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";
import { signOut } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const UpdateProfilePage = () => {
    const { currentLang } = useLanguageStore();
	const textData =
		languageData[currentLang as keyof typeof languageData].profile.updateProfile
			.page;
	const [contactNumber, setContactNumber] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// 处理表单提交
	const { data: session } = useSession(); // 解构出 update
	// 初始化表单数据
	useEffect(() => {
		if (session?.user?.email) {
			setContactNumber(session.user.email);
		}
	}, [session]);
	const handleUpdate = async () => {
		if (!contactNumber.trim()) {
			toast.error(textData.function.PleaseEnterContactInfo, {
				position: "top-center",
				duration: 2000,
			});
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/updateProfile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: session?.user?.id,
					nickName: session?.user?.nickname || session?.user?.name,
					contactNumber: contactNumber,
				}),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				toast.success(textData.function.ChangeSuccessPleaseRelogin);

				// 更新成功后跳转
				await signOut({ callbackUrl: "/auth/login" });
			} else {
				toast.error(textData.function.UpdateContactInfoFailed, {
					position: "top-center",
					duration: 2000,
				});
			}
		} catch (error) {
			console.error("更新个人信息出错:", error);
			toast.error(textData.function.UpdateContactInfoFailed, {
				position: "top-center",
				duration: 2000,
			});
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Card className="rounded-b-none w-11/12 md:w-1/2 h-2/3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-pink-300">
			<CardHeader className="w-full flex justify-center items-center">
				<CardTitle className="text-2xl">{textData.tag.UpdateContactInfo}</CardTitle>
			</CardHeader>
			<CardContent>
				<Input
					className="border-2 border-black"
					placeholder={textData.tag.InputPlaceholder}
					value={contactNumber}
					onChange={(e) => setContactNumber(e.target.value)}
					disabled={isLoading}
				/>
			</CardContent>
			<CardFooter className="flex items-center justify-center">
				<Button
					className="shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white text-black hover:bg-white
               active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
               transition-all"
					onClick={handleUpdate}
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{textData.tag.Updating}
						</>
					) : (
						textData.tag.Update
					)}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default UpdateProfilePage;
