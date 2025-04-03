import { ZCOOL_KuaiLe } from "next/font/google";
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
const AboutUsPage = () => {
	return (
		<section className={`w-full h-full mx-auto px-4 py-8 md:px-10 md:py-16 ${zcool.className}`}>
			<h1 className="text-4xl font-bold text-pink-600 mb-6">
				关于我们
			</h1>
			<p className="text-base leading-relaxed mb-4">
				嘿～欢迎光临我们的指尖星球！✨
				<br />
				我们是一家藏在弘大樱花步行街旁的{" "}
				<strong>私人美甲工作室</strong>
				，温柔又有点小俏皮，专治各种“不开心”和“手部空虚症”～🌸
			</p>
			<p className="text-base leading-relaxed mb-4">
				在这里，你可以慢慢选颜色，慢慢挑风格，也可以一边做指甲一边大聊八卦，
				反正 <strong>时间是你的，美也只属于你自己</strong> 💅。
			</p>

			<h2 className="text-2xl font-semibold text-pink-500 mt-8 mb-4">
				老板娘碎碎念
			</h2>
			<p className="text-base leading-relaxed mb-4">
				我是这家店的创始人 &amp;
				唯一指定造梦师（请叫我老板娘也行嘿嘿😎）
				<br />
				从小就超爱打扮，小时候用妈妈的指甲油涂得满手都是，还觉得自己美得不得了～
			</p>
			<p className="text-base leading-relaxed mb-4">
				高中时一个人来到韩国，语言不通、人生重启，但对「美」的热爱没变过！
				<br />
				我读的是西京大学美容美发专业，从高中开始就狂考国家资格证：
				<br />
				✔️ 国家级化妆师证
				<br />
				✔️ 国家级色彩鉴定资格证
				<br />
				✔️ 国家级美甲师证
				<br />
				✔️ 还有无数个练手模型小手陪我熬夜奋斗
			</p>
			<p className="text-base leading-relaxed mb-4">
				疫情时期，一边上课一边做单，还得养活自己交学费，靠双手换生活。
				一步步从小白变成专业美甲师，收获了无数来自不同国家的朋友，真的太值得了。
			</p>
			<p className="text-base leading-relaxed mb-4">
				五年过去，我终于！把这个属于我的小店开出来啦 🎉
			</p>

			<h2 className="text-2xl font-semibold text-pink-500 mt-8 mb-4">
				我们的店，有点特别
			</h2>
			<ul className="list-disc list-inside text-base leading-relaxed mb-4 space-y-2">
				<li>
					🌸 <strong>在樱花路边，推门就能拍出春日感大片</strong>
				</li>
				<li>
					💅 <strong>私人定制，每次来都不重样</strong>
				</li>
				<li>
					🎧 <strong>安静舒服，聊天or躺平随你选</strong>
				</li>
				<li>
					💖 <strong>Y2K、多巴胺、甜酷辣妹风，全部安排！</strong>
				</li>
				<li>
					🎁 <strong>每次来都有小惊喜，我们就是爱整活儿！</strong>
				</li>
				<li>
					🫶 <strong>我们不赶时间，更在乎你有没有开心</strong>
				</li>
			</ul>

			<h2 className="text-2xl font-semibold text-pink-500 mt-8 mb-4">
				我们的宗旨
			</h2>
			<blockquote className="border-l-4 border-pink-300 pl-4 italic text-pink-600 mb-4">
				“没有最好的美甲，
				<br />
				只有永远的服务 + 真心的友情！”
			</blockquote>
			<p className="text-base leading-relaxed mb-4">
				每一双手背后，都是一个努力生活的你，而我希望能在你最需要的小空隙里，成为你的“快乐制造机”
				🎈
			</p>
			<p className="text-base leading-relaxed">
				下次心情不好？来坐坐。
				<br />
				不做美甲也欢迎喝杯咖啡聊聊天～
				<br />
				因为我们不仅是美甲店，更是你生活里的小确幸✨
			</p>
		</section>
	);
};

export default AboutUsPage;
