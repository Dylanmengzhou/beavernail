"use client";
import { useLanguageStore } from '@/store/languageStore'
import { ZCOOL_KuaiLe } from "next/font/google";
import languageData from "@/public/language.json";
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
const AboutUsPage = () => {
	const { currentLang } = useLanguageStore();
	const data = languageData[currentLang as keyof typeof languageData];

	return (
		<section
			className={`w-full h-full mx-auto px-4 py-8 md:px-10 md:py-16 ${zcool.className}`}
		>
			<h1 className="text-4xl font-bold text-pink-600 mb-6">
				{data.aboutUs.title}
			</h1>
			<p className="text-base leading-relaxed mb-4">
				{data.aboutUs.intro.welcome}
				<br />
				{data.aboutUs.intro.description.a}{" "}
				<strong>{data.aboutUs.intro.description.b}</strong>
				{data.aboutUs.intro.description.c}
			</p>
			<p className="text-base leading-relaxed mb-4">
				{data.aboutUs.intro.service.a}
				<strong>{data.aboutUs.intro.service.b}</strong>
			</p>

			<h2 className="text-2xl font-semibold text-pink-500 mt-8 mb-4">
				{data.aboutUs.owner.title}
			</h2>
			<p className="text-base leading-relaxed mb-4">
				{data.aboutUs.owner.intro}
				<br />
				{data.aboutUs.owner.childhood}
			</p>
			<p className="text-base leading-relaxed mb-4">
				{data.aboutUs.owner.background}
				<br />
				{data.aboutUs.owner.education}
				<br />
				✔️ {data.aboutUs.owner.certificates[0]}
				<br />
				✔️ {data.aboutUs.owner.certificates[1]}
				<br />
				✔️ {data.aboutUs.owner.certificates[2]}
				<br />
				✔️ {data.aboutUs.owner.certificates[3]}
			</p>
			<p className="text-base leading-relaxed mb-4">
				{data.aboutUs.owner.experience}
			</p>
			<p className="text-base leading-relaxed mb-4">
				{data.aboutUs.owner.achievement}
			</p>

			<h2 className="text-2xl font-semibold text-pink-500 mt-8 mb-4">
				{data.aboutUs.specialFeatures.title}
			</h2>
			<ul className="list-disc list-inside text-base leading-relaxed mb-4 space-y-2">
				<li>
					<strong>{data.aboutUs.specialFeatures.features[0]}</strong>
				</li>
				<li>
					<strong>{data.aboutUs.specialFeatures.features[1]}</strong>
				</li>
				<li>
					<strong>{data.aboutUs.specialFeatures.features[2]}</strong>
				</li>
				<li>
					<strong>{data.aboutUs.specialFeatures.features[3]}</strong>
				</li>
				<li>
					<strong>{data.aboutUs.specialFeatures.features[4]}</strong>
				</li>
				<li>
					<strong>{data.aboutUs.specialFeatures.features[5]}</strong>
				</li>
			</ul>

			<h2 className="text-2xl font-semibold text-pink-500 mt-8 mb-4">
				{data.aboutUs.mission.title}
			</h2>
			<blockquote className="border-l-4 border-pink-300 pl-4 italic text-pink-600 mb-4">
				{data.aboutUs.mission.quote.a}
				<br />
				{data.aboutUs.mission.quote.b}
			</blockquote>
			<p className="text-base leading-relaxed mb-4">
				{data.aboutUs.mission.message}
			</p>
			<p className="text-base leading-relaxed">
				{data.aboutUs.mission.closing[0]}
				<br />
				{data.aboutUs.mission.closing[1]}
				<br />
				{data.aboutUs.mission.closing[2]}
			</p>
		</section>
	);
};

export default AboutUsPage;
