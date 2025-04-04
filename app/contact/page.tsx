"use client";

import { useState } from "react";
import { Instagram, Mail, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { ZCOOL_KuaiLe } from "next/font/google";
import { Coiny } from "next/font/google";
import { Link } from "lucide-react";

// 导入 React Icons 中的图标
import { SiXiaohongshu } from "react-icons/si";
import { FaWeixin } from "react-icons/fa";

const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
const coiny = Coiny({ subsets: ["latin"], weight: "400" });

const ContactPage = () => {
	// 使用状态管理复制状态和显示状态
	const [copied, setCopied] = useState<string | null>(null);
	const [revealed, setRevealed] = useState<string | null>(null);

	// 联系方式信息（使用简单加密或混淆）
	const contactInfo = {
		xiaohongshu: {
			account: "beaver_NANA",
			url: "https://www.xiaohongshu.com/user/profile/5ddb68510000000001003b3a?xsec_token=YB0QRP36hbA-7jfGNH2ydpk3AdAZM5RSAtv79CGxUONXs=&xsec_source=app_share&xhsshare=CopyLink&appuid=5ddb68510000000001003b3a&apptime=1743658474&share_id=83f47d7167e94fa8976e7244d38222f1",
		},
		instagram: {
			account: "beaver_nail",
			url: " https://www.instagram.com/beaver_nail?igsh=OHRmbDcxbzdtZGx3&utm_source=qr",
		},
		wechat: "Beaver_nail",
		email: "beavernail2025" + "@" + "gmail.com",
	};

	// 处理复制功能
	const handleCopy = (type: string, value: string) => {
		navigator.clipboard.writeText(value);
		setCopied(type);
		toast.success(`${type}已复制到剪贴板`, {
			duration: 2000,
		});
		setTimeout(() => setCopied(null), 2000);
	};

	// 处理显示/隐藏功能
	const toggleReveal = (type: string) => {
		if (revealed === type) {
			setRevealed(null);
		} else {
			setRevealed(type);
			// 5秒后自动隐藏
			setTimeout(() => setRevealed(null), 5000);
		}
	};

	return (
		<div className="w-full max-w-3xl mx-auto p-6 rounded-2xl ">
			<h1
				className={`${zcool.className} text-3xl text-center text-pink-500 mb-8`}
			>
				联系我们
			</h1>

			<div className="space-y-8">
				{/* 小红书 - 使用 React Icons */}
				<div className="flex items-center p-4 bg-gradient-to-r from-pink-100 to-red-100 rounded-xl">
					<div className="bg-red-500 p-3 rounded-full mr-4 flex items-center justify-center">
						<SiXiaohongshu size={24} className="text-white" />
					</div>
					<div className="flex-grow">
						<h2 className={`${coiny.className} text-xl text-red-600`}>
							小红书
						</h2>
						<p className={`${zcool.className} text-gray-600`}>
							{revealed === "xiaohongshu"
								? contactInfo.xiaohongshu.account
								: "点击查看我们的小红书账号"}
						</p>
					</div>
					<div className="flex space-x-2">
						<button
							onClick={() => toggleReveal("xiaohongshu")}
							className="p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
						>
							{revealed === "xiaohongshu" ? "隐藏" : "查看"}
						</button>
						{revealed === "xiaohongshu" && (
							<>
								<button
									onClick={() =>
										handleCopy(
											"小红书账号",
											contactInfo.xiaohongshu.account
										)
									}
									className="p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
								>
									{copied === "小红书账号" ? (
										<Check size={20} />
									) : (
										<Copy size={20} />
									)}
								</button>
								<button
									onClick={() =>
										window.open(contactInfo.xiaohongshu.url, "_blank")
									}
									className="p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
								>
									{copied === "小红书账号" ? (
										<Link size={20} />
									) : (
										<Link size={20} />
									)}
								</button>
							</>
						)}
					</div>
				</div>

				{/* Instagram - 保持不变 */}
				<div className="flex items-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
					<div className="bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 p-3 rounded-full mr-4">
						<Instagram size={24} className="text-white" />
					</div>
					<div className="flex-grow">
						<h2
							className={`${coiny.className} text-xl text-purple-600`}
						>
							Instagram
						</h2>
						<p className={`${zcool.className} text-gray-600`}>
							{revealed === "instagram"
								? contactInfo.instagram.account
								: "点击查看我们的Instagram账号"}
						</p>
					</div>
					<div className="flex space-x-2">
						<button
							onClick={() => toggleReveal("instagram")}
							className="p-2 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors"
						>
							{revealed === "instagram" ? "隐藏" : "查看"}
						</button>
						{revealed === "instagram" && (
							<>
								<button
									onClick={() =>
										handleCopy(
											"Instagram账号",
											contactInfo.instagram.account
										)
									}
									className="p-2 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors"
								>
									{copied === "Instagram账号" ? (
										<Check size={20} />
									) : (
										<Copy size={20} />
									)}
                                </button>

								<button
									onClick={() =>
										window.open(contactInfo.instagram.url, "_blank")
									}
									className="p-2 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors"
								>
									{copied === "Instagram账号" ? (
										<Link size={20} />
									) : (
										<Link size={20} />
									)}
								</button>
							</>
						)}
					</div>
				</div>

				{/* 微信 - 使用 React Icons */}
				<div className="flex items-center p-4 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl">
					<div className="bg-green-500 p-3 rounded-full mr-4 flex items-center justify-center">
						<FaWeixin size={24} className="text-white" />
					</div>
					<div className="flex-grow">
						<h2
							className={`${coiny.className} text-xl text-green-600`}
						>
							微信
						</h2>
						<p className={`${zcool.className} text-gray-600`}>
							{revealed === "wechat"
								? contactInfo.wechat
								: "点击查看我们的微信账号"}
						</p>
					</div>
					<div className="flex space-x-2">
						<button
							onClick={() => toggleReveal("wechat")}
							className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
						>
							{revealed === "wechat" ? "隐藏" : "查看"}
						</button>
						{revealed === "wechat" && (
							<button
								onClick={() =>
									handleCopy("微信账号", contactInfo.wechat)
								}
								className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
							>
								{copied === "微信账号" ? (
									<Check size={20} />
								) : (
									<Copy size={20} />
								)}
							</button>
						)}
					</div>
				</div>

				{/* 邮箱 - 保持不变 */}
				<div className="flex items-center p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
					<div className="bg-blue-500 p-3 rounded-full mr-4">
						<Mail size={24} className="text-white" />
					</div>
					<div className="flex-grow">
						<h2
							className={`${coiny.className} text-xl text-blue-600`}
						>
							合作邮箱
						</h2>
						<p className={`${zcool.className} text-gray-600`}>
							{revealed === "email"
								? contactInfo.email
								: "点击查看我们的合作邮箱"}
						</p>
					</div>
					<div className="flex space-x-2">
						<button
							onClick={() => toggleReveal("email")}
							className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
						>
							{revealed === "email" ? "隐藏" : "查看"}
						</button>
						{revealed === "email" && (
							<button
								onClick={() =>
									handleCopy("合作邮箱", contactInfo.email)
								}
								className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
							>
								{copied === "合作邮箱" ? (
									<Check size={20} />
								) : (
									<Copy size={20} />
								)}
							</button>
						)}
					</div>
				</div>
			</div>

			<div
				className={`${zcool.className} mt-10 text-center text-gray-500`}
			>
				<p>我们会在1小时内回复您的咨询</p>
				<p className="mt-2">期待您的到来！</p>
			</div>
		</div>
	);
};

export default ContactPage;
