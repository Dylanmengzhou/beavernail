import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";

// Notice this is only an object, not a full Auth.js instance
export default {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			// 添加配置，确保获取到用户的姓名和头像
			profile(profile) {
				// 使用 name 作为 username
				console.log("Google profile:", profile);
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
					emailVerified: new Date(),
					username: profile.sub.toString(), // 将 name 赋值给 username
					provider: "google", // 标记为 Google 登录
				};
			},
		}),
		Kakao({
			clientId: process.env.AUTH_KAKAO_ID,
			clientSecret: process.env.AUTH_KAKAO_SECRET,
			// 添加配置，确保获取到用户的姓名和头像
			profile(profile) {
				// 使用 name 作为 username
				console.log("Kakao profile:", profile);
				return {
					// string the id to string
					id: profile.id.toString(),
					name: profile.properties.nickname,
					image: profile.properties.profile_image,
					username: profile.id.toString(), // 将 name 赋值给 username
					provider: "kakao", // 标记为 Kakao 登录
				};
			},
		}),

		Credentials({
			name: "Credentials",
			credentials: {
				username: {
					label: "Username",
					type: "text",
					placeholder: "username",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "password",
				},
			},
			// 添加 authorize 函数
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: {
						username: credentials.username as string,
						provider: 'credentials'  // 确保用户是通过 credentials 方式注册的
					 },
				});

				// 先检查用户是否存在
				if (!user || !user.password) {
					return null;
				}

				// 验证密码
				const isValid = await bcrypt.compare(
					credentials.password as string,
					user.password
				);

				if (!isValid) {
					return null;
				}

				// 更新最后登录时间
				await prisma.user.update({
					where: { id: user.id },
					data: { lastLoginAt: new Date() },
				});

				// 返回用户对象，确保包含 name 字段
				return {
					id: user.id,
					name: user.name || user.nickname || user.username, // 优先使用 name，其次是 nickname 或 username
					username: user.username,
					image: user.image,
					membershipType: user.membershipType,
					securityQuestion: user.securityQuestion,
					securityAnswer: user.securityAnswer,
					nickname: user.nickname,
					gender: user.gender,
					lastLoginAt: user.lastLoginAt,
					createdAt: user.createdAt,
					birthday: user.birthday,
					email: user.email,
				};
			},
		}),
	],
	// 添加页面配置
	pages: {
		signIn: "/auth/login",
		// signOut: '/auth/signout',
		// error: '/auth/error',
	},
} satisfies NextAuthConfig;
