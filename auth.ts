import NextAuth from "next-auth";
import { prisma } from "@/prisma";
// import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string | null; // 添加 name 字段
			username?: string | null;
			image?: string | null;
			membershipType?: string | null;
			securityQuestion?: string | null;
			securityAnswer?: string | null;
			nickname?: string | null;
			gender?: string | null;
			lastLoginAt?: Date | null;
			createdAt?: Date | null;
			birthday?: Date | null;
			email?: string | null;
			provider?: string | null;
		};
	}

	interface User {
		name?: string | null; // 添加 name 字段
		username?: string | null;
		image?: string | null;
		membershipType?: string | null;
		securityQuestion?: string | null;
		securityAnswer?: string | null;
		nickname?: string | null;
		gender?: string | null;
		lastLoginAt?: Date | null;
		createdAt?: Date | null;
		birthday?: Date | null;
		email?: string | null;
		provider?: string | null;
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	adapter: PrismaAdapter(prisma),

	session: {
		strategy: "jwt",
		maxAge: 100 * 24 * 60 * 60, // 改为90天
	},
	callbacks: {
		async jwt({ token, user, account, trigger, session }) {
			// ✅ 处理前端手动触发的 session.update()
			if (trigger === "update" && session?.user) {
				console.log("Manual session update triggered");
				if (session.user.name) token.name = session.user.name;
				if (session.user.email) token.email = session.user.email;
				if (session.user.nickname)
					token.nickname = session.user.nickname;
				if (session.user.image) token.image = session.user.image;
			}

			// 登录时，存储用户信息
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.username = user.username;
				token.image = user.image;
				token.membershipType = user.membershipType;
				token.securityQuestion = user.securityQuestion;
				token.securityAnswer = user.securityAnswer;
				token.nickname = user.nickname;
				token.gender = user.gender;
				token.lastLoginAt = user.lastLoginAt;
				token.createdAt = user.createdAt;
				token.birthday = user.birthday;
				token.email = user.email;
				token.provider = user.provider;
			}

			// OAuth 登录时更新 lastLoginAt
			if (
				account?.provider === "google" ||
				account?.provider === "kakao"
			) {
				console.log(
					"use oauth:",
					account?.provider,
					"update lastLoginAt"
				);
				await prisma.user.update({
					where: {
						id: token.id as string,
						provider: account.provider as string,
					},
					data: { lastLoginAt: new Date() },
				});
			}

			// 如果是首次 Google/Kakao 登录且没 nickname
			if (
				(account?.provider === "google" ||
					account?.provider === "kakao") &&
				user?.name &&
				!user?.nickname
			) {
				await prisma.user.update({
					where: {
						id: token.id as string,
						provider: account.provider as string,
					},
					data: {
						lastLoginAt: new Date(),
						nickname: user.name,
					},
				});
			}

			return token;
		},

		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string;
				session.user.name = token.name as string;
				session.user.username = token.username as string;
				session.user.image = token.image as string;
				session.user.membershipType = token.membershipType as string;
				session.user.securityQuestion =
					token.securityQuestion as string;
				session.user.securityAnswer = token.securityAnswer as string;
				session.user.nickname = token.nickname as string;
				session.user.gender = token.gender as string;
				session.user.lastLoginAt = token.lastLoginAt as Date;
				session.user.createdAt = token.createdAt as Date;
				session.user.birthday = token.birthday as Date;
				session.user.email = token.email as string;
				session.user.provider = token.provider as string;
			}
			// console.log("session:", session);
			return session;
		},
	},
});
