"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";
import { Coiny } from "next/font/google";
import { ZCOOL_KuaiLe } from "next/font/google";
import { History } from "lucide-react";
import { UserRoundPen } from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
const coiny = Coiny({ subsets: ["latin"], weight: "400" });
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
const ProfilePage = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [isSigningOut, setIsSigningOut] = useState(false);
	const handleSignOut = async () => {
		setIsSigningOut(true);
		await signOut({ callbackUrl: "/auth/login" });
	};

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/auth/login");
		}
	}, [status, router]);

	if (status === "loading") {
		return (
			<div className="flex justify-center items-center h-screen">
				加载中...
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 ">
			<Card
				className={`${coiny.className} border-none rounded-4xl bg-gradient-to-r from-violet-200 to-pink-200`}
			>
				<CardHeader className="flex gap-4 items-center justify-center ">
					<CardTitle>
						<Avatar className="w-14 h-14 md:w-20 md:h-20">
							<AvatarImage src={"./avatarHead.png"} />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</CardTitle>
					<CardDescription className="text-black">
						<div className="flex flex-col">
							<div
								className="text-xl truncate max-w-[200px] md:max-w-[250px]"
								title={session?.user.username || ""}
							>
								{session?.user.username}
							</div>
							<div className="flex items-center gap-3">
								<div className={`text-sm ${zcool.className}`}>
									预约次数
								</div>
								<div className={`text-sm ${zcool.className}`}>3</div>
							</div>
						</div>
					</CardDescription>
				</CardHeader>
				<CardContent className="w-full">
					<CardContent className="flex flex-col gap-5 items-center justify-center px-0">
						<div className="w-full flex flex-col items-center justify-center">
							<Button
								className=" w-5/6 h-12 flex items-center justify-center gap-2 bg-white hover:bg-white text-black rounded-4xl"
								onClick={() => router.push("/reservation/history")}
							>
								<History size={18} />
								<span className={`text-base ${zcool.className}`}>
									预约历史
								</span>
							</Button>
						</div>
						<div className="w-full flex flex-col items-center justify-center">
							<Button className=" w-5/6 h-12 flex items-center justify-center gap-2 bg-white hover:bg-white text-black rounded-4xl">
								<UserRoundPen size={18} />
								<span
									className={`text-base ${zcool.className}`}
									onClick={() => router.push("/profile/setting")}
								>
									个人名片
								</span>
							</Button>
						</div>
						<div className="w-full flex flex-col items-center justify-center">
							<Button
								className="w-5/6 h-12 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-500 text-white rounded-4xl disabled:opacity-70"
								onClick={handleSignOut}
								disabled={isSigningOut}
							>
								{isSigningOut ? (
									<Loader2 className="h-5 w-5 animate-spin" />
								) : (
									<LogOut size={18} />
								)}
								<span className={`text-base ${zcool.className}`}>
									{isSigningOut ? "退出中..." : "退出"}
								</span>
							</Button>
						</div>
					</CardContent>
				</CardContent>
				<CardFooter></CardFooter>
			</Card>
		</div>
	);
};

export default ProfilePage;
