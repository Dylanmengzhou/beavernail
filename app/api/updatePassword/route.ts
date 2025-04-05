import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import languageData from "@/public/language.json";
import { cookies } from "next/headers";

const updatePassword = async (account: string, password: string) => {
	const cookieStore = cookies();
	const languageCookie = (await cookieStore).get("language-storage");
	let currentLang = "en"; // 默认语言

	// 从 cookie 中解析语言设置
	if (languageCookie) {
		try {
			const languageState = JSON.parse(languageCookie.value);
			currentLang = languageState.state.currentLang;
		} catch (error) {
			console.error("解析语言cookie失败:", error);
		}
	}

	const data =
		languageData[currentLang as keyof typeof languageData].auth
			.forgetPassword.resetPass.api;

	const user = await prisma.user.findUnique({
		where: {
			username: account as string,
			provider: "credentials",
		},
	});

	console.log("user:", user);
	if (!user) {
		return { success: false, error: data.UserNotExist };
	}
	await prisma.user.update({
		where: {
			username: account,
			provider: "credentials",
		},
		data: {
			password: await bcrypt.hash(password, 10),
		},
	});
	return { success: true, error: "" };
};

export async function POST(req: NextRequest) {
	const cookieStore = cookies();
	const languageCookie = (await cookieStore).get("language-storage");
	let currentLang = "en"; // 默认语言

	// 从 cookie 中解析语言设置
	if (languageCookie) {
		try {
			const languageState = JSON.parse(languageCookie.value);
			currentLang = languageState.state.currentLang;
		} catch (error) {
			console.error("解析语言cookie失败:", error);
		}
	}

	const data =
		languageData[currentLang as keyof typeof languageData].auth
			.forgetPassword.resetPass.api;

	const body = await req.json();
	const { account, password } = body;
	try {
		const result = await updatePassword(account, password);
		console.log("result:", result);
		if (result.success) {
			return NextResponse.json({
				success: true,
				message: data.ResetSuccess,
			});
		} else {
			return NextResponse.json(
				{ success: false, message: result.error },
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error("发生错误:", error);
		return NextResponse.json(
			{ success: false, message: data.InternalServerError },
			{ status: 500 }
		);
	}
}
