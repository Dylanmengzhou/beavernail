import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import Credentials from "next-auth/providers/credentials";
declare module "next-auth" {
	interface Session {
		user: {
			id: string;
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
		};
	}
	// 添加这个接口声明
	interface User {
		username: string;
		image?: string | null;
		membershipType?: string | null;
		securityQuestion: string;
		securityAnswer: string;
		nickname?: string | null;
		gender?: string | null;
		lastLoginAt?: Date | null;
		createdAt?: Date | null;
		birthday?: Date | null;
	}
}
export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [
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
					where: { username: credentials.username as string },
				});

				// 先检查用户是否存在
				if (!user) {
					return null;
				}

				return {
					id: user.id,
					username: user.username,
					image: user.image,
					membershipType: user.membershipType,
					securityQuestion: user.securityQuestion,
					securityAnswer: user.securityAnswer,
					nickname: user.nickname,
					gender: user.gender,
					lastLoginAt: user.lastLoginAt,
					createdAt: user.createdAt, // 修改这里，将 createdAt 改为 createAt
					birthday: user.birthday,
				};
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 100 * 24 * 60 * 60, // 改为90天
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
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
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string;
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
			}
			return session;
		},
	},
});
