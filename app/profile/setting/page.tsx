"use client";

import { useSession } from "next-auth/react";
import { Coiny } from "next/font/google";
// import { ZCOOL_KuaiLe } from "next/font/google";

import Image from "next/image";

const coiny = Coiny({ subsets: ["latin"], weight: "400" });
// const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
const SettingPage = () => {
	const { data: session } = useSession();
	console.log(session);
	return (
		<div className="flex flex-col text-pink-600/90  p-10 pb-2 items-end bg-transparent md:pr-30 h-full mb-5 w-5/6 rounded-3xl bg-[url('/cardBackground.png')] bg-cover bg-center shadow-2xl">
			<div
				className={`w-full text-xl md:text-2xl flex flex-col gap-3 ${coiny.className}`}
			>
				<div className="text-4xl flex gap-5">
					<div className="text-pink-950">
						{session?.user.nickname}
					</div>
				</div>
				<div className="">
					<div className="">{session?.user.gender}</div>
					<div className="">ID: {session?.user.username}</div>
					<div className="">
						Birthday:{" "}
						{session?.user.birthday
							? new Date(session.user.birthday).toLocaleDateString()
							: ""}
					</div>
					<div className="">
						Create At:{" "}
						{session?.user.createdAt
							? new Date(session.user.createdAt).toLocaleDateString()
							: ""}
					</div>
				</div>
			</div>

			<div className="flex">
				<Image
					src="/avatarDog.png"
					alt="test"
					width={150}
					height={200}
				/>
				<Image
					src="/avatar.png"
					alt="test"
					width={150}
					height={200}
				/>
			</div>
		</div>
	);
};

export default SettingPage;
