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
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";

const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
const coiny = Coiny({ subsets: ["latin"], weight: "400" });

const ContactPage = () => {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].contact
			.page;
	
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
		// 检查navigator.clipboard是否可用
		if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
			navigator.clipboard
				.writeText(value)
				.then(() => {
					setCopied(type);
					toast.success(`${type}${data.function.AlreadyCopyToClipboard}`, {
						duration: 2000,
					});
					setTimeout(() => setCopied(null), 2000);
				})
				.catch((err) => {
					console.error("复制失败:", err);
					// 如果现代API失败，回退到传统方法
					fallbackCopyTextToClipboard(value, type);
				});
		} else {
			// 如果不支持现代API，使用传统方法
			fallbackCopyTextToClipboard(value, type);
		}
	};

	// 添加传统复制方法作为后备
	const fallbackCopyTextToClipboard = (text: string, type: string) => {
		try {
			const textarea = document.createElement("textarea");
			textarea.value = text;
			// 确保textarea在视口内但不可见
			textarea.style.position = 'fixed';
			textarea.style.left = '0';
			textarea.style.top = '0';
			textarea.style.opacity = '0';
			document.body.appendChild(textarea);
			textarea.focus();
			textarea.select();

			const successful = document.execCommand("copy");
			document.body.removeChild(textarea);

			if (successful) {
				setCopied(type);
				toast.success(`${data.function.AlreadyCopyToClipboard}`, {
					position: "top-center",
					duration: 2000,
				});
				setTimeout(() => setCopied(null), 2000);
			} else {
				toast.error(data.function.FailCopyToClipboard, {
					position: "top-center",
					duration: 2000,
				});
			}
		} catch (err) {
			console.error("复制失败:", err);
			toast.error(data.function.FailCopyToClipboard, {
				position: "top-center",
				duration: 2000,
			});
		}
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
		<div className="w-full max-w-3xl mx-auto p-6 rounded-2xl">
			<h1
				className={`${zcool.className} text-3xl text-center text-pink-500 mb-8`}
			>
				{data.tag.ContactUs}
			</h1>

			<div className="space-y-8">
				{/* 小红书 - 使用 React Icons */}
				<div className="flex items-center p-4 bg-gradient-to-r from-pink-100 to-red-100 rounded-xl">
					<div className="bg-red-500 p-3 rounded-full mr-4 flex items-center justify-center">
						<SiXiaohongshu size={24} className="text-white" />
					</div>
					<div className="flex-grow">
						<h2 className={`${coiny.className} text-xl text-red-600`}>
							{data.tag.RedBook}
						</h2>
						<p className={`${zcool.className} text-gray-600 text-xs`}>
							{revealed === "xiaohongshu"
								? contactInfo.xiaohongshu.account
								: data.tag.ClickToShowRedBook}
						</p>
					</div>
					<div className="flex space-x-2">
						<button
							onClick={() => toggleReveal("xiaohongshu")}
							className="p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
						>
							{revealed === "xiaohongshu"
								? data.tag.Hide
								: data.tag.Reveal}
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
						<p className={`${zcool.className} text-gray-600 text-xs`}>
							{revealed === "instagram"
								? contactInfo.instagram.account
								: data.tag.ClickToShowInstagram}
						</p>
					</div>
					<div className="flex space-x-2">
						<button
							onClick={() => toggleReveal("instagram")}
							className="p-2 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors"
						>
							{revealed === "instagram"
								? data.tag.Hide
								: data.tag.Reveal}
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
							{data.tag.Wechat}
						</h2>
						<p className={`${zcool.className} text-gray-600 text-xs`}>
							{revealed === "wechat"
								? contactInfo.wechat
								: data.tag.ClickToShowWeChat}
						</p>
					</div>
					<div className="flex space-x-2">
						<button
							onClick={() => toggleReveal("wechat")}
							className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
						>
							{revealed === "wechat"
								? data.tag.Hide
								: data.tag.Reveal}
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
							Email
						</h2>
						<p className={`${zcool.className} text-gray-600 text-xs`}>
							{revealed === "email"
								? contactInfo.email
								: data.tag.ClickToShowEmail}
						</p>
					</div>
					<div className="flex space-x-2">
						<button
							onClick={() => toggleReveal("email")}
							className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
						>
							{revealed === "email" ? data.tag.Hide : data.tag.Reveal}
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
				<p>{data.tag.WillReplySoon}</p>
				<p className="mt-2">{data.tag.Welcome}</p>
			</div>
		</div>
	);
};

export default ContactPage;
