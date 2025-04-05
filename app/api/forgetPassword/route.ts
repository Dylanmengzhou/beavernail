import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import languageData from "@/public/language.json";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
	// 使用 cookies() 方法获取语言设置
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
			.forgetPassword.account.api;

	const url = new URL(req.url);
	const account = url.searchParams.get("account");

	if (!account) {
		return NextResponse.json(
			{ success: false, message: data.CheckAccountError },
			{ status: 400 }
		);
	}

	try {
		const user = await prisma.user.findUnique({
			where: { username: account, provider: "credentials" },
			select: {
				id: true,
				securityQuestion: true,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ success: false, message: data.MissingAccountError },
				{ status: 404 }
			);
		}

		if (!user.securityQuestion) {
			return NextResponse.json(
				{
					success: false,
					message: data.SecurityQuestionMissingError,
				},
				{ status: 400 }
			);
		}

		return NextResponse.json({
			success: true,
			securityQuestion: user.securityQuestion,
		});
	} catch (error) {
		console.error(data.SecurityQuestionRequsetError, error);
		return NextResponse.json(
			{ success: false, message: data.InternalServerError },
			{ status: 500 }
		);
	}
}

// 验证安全问题答案
export async function POST(req: NextRequest) {
	// 使用 cookies() 方法获取语言设置
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
      .forgetPassword.account.api;

  
	const body = await req.json();
	const { account, securityAnswer } = body;

	if (!account || !securityAnswer) {
		return NextResponse.json(
			{ success: false, message: data.NoAccountSecurityAnswerError },
			{ status: 400 }
		);
	}

	try {
		const user = await prisma.user.findUnique({
			where: { username: account, provider: "credentials" },
			select: {
				id: true,
				securityAnswer: true,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ success: false, message: data.MissingAccountError },
				{ status: 404 }
			);
		}

		// 验证安全问题答案
		if (user.securityAnswer !== securityAnswer) {
			return NextResponse.json(
				{ success: false, message: data.SecurityAnswerMissMatch },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			success: true,
			message: data.Success,
		});
	} catch (error) {
		console.error(data.VerifedSecurityQuestionFailed, error);
		return NextResponse.json(
			{ success: false, message: data.InternalServerError },
			{ status: 500 }
		);
	}
}
