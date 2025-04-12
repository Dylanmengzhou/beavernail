"use client";
import {
	ZCOOL_KuaiLe,
	Rubik_Iso,
	Rubik_Bubbles,
} from "next/font/google";
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
const rubikiso = Rubik_Iso({ subsets: ["latin"], weight: "400" });
const rubikkub = Rubik_Bubbles({ subsets: ["latin"], weight: "400" });



const PriceListPage = () => {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].priceList
			.page;
	return (
		<div
			className={`flex flex-col w-full h-full md:w-1/2  rounded-sm text-xs ${zcool.className} p-0.5`}
		>
			<div className={`${rubikkub.className} text-8xl text-[#ff7dac]`}>MENU</div>
			<div className="w-full h-full bg-amber-30 flex p-5 pr-0">
				<div className="flex flex-col h-full w-4/6 gap-5">
					<div className="w-full h-5/6 flex flex-col gap-2">
						<div className="w-full ">
							<div className="h-8 w-30 bg-[#ffb2cd] rounded-full flex justify-center items-center text-white">
								{data.tag.Hand}
							</div>
						</div>
						<div className="w-full flex text-[#ff7dac]">
							<div className="w-7/12 flex flex-col gap-2 pl-2 ">
								<div className="flex items-center">{data.tag.Pure}</div>
								<div className="flex items-center">{data.tag.CatEye}</div>
								<div className="flex items-center">{data.tag.FrenchGradiation}</div>
								<div className="flex items-center">{data.tag.Extension}</div>
								<div className="flex items-center">{data.tag.Basic}</div>
								<div className="flex items-center">{data.tag.Complex}</div>
							</div>
							<div className="w-5/12 flex flex-col gap-2 ">
								<div className="flex items-center">45,000</div>
								<div className="flex items-center">50,000</div>
								<div className="flex items-center">55,000</div>
								<div className="flex items-center">6,000</div>
								<div className="flex items-center">65,000~</div>
								<div className="flex items-center">80,000~</div>
							</div>
						</div>
					</div>
					<div className="w-full h-5/6 flex flex-col gap-2">
						<div className="w-full ">
							<div className="h-8 w-30 bg-[#ffb2cd] rounded-full flex justify-center items-center text-white">
							{data.tag.Pedi}
							</div>
						</div>
						<div className="w-full flex text-[#ff7dac]">
							<div className="w-7/12 flex flex-col gap-2 pl-2">
								<div className="">{data.tag.Pure}</div>
								<div className="">{data.tag.Style}</div>
							</div>
							<div className="w-5/12 flex flex-col gap-2">
								<div className="">55,000</div>
								<div className="">75,000~</div>
							</div>
						</div>
					</div>
					<div className="w-full h-5/6 flex flex-col gap-2">
						<div className="w-full ">
							<div className="h-8 w-30 bg-[#ffb2cd] rounded-full flex justify-center items-center text-white">
							{data.tag.Removal}
							</div>
						</div>
						<div className="w-full flex text-[#ff7dac]">
							<div className="w-7/12 flex flex-col gap-2 pl-2">
								<div className="">{data.tag.OurStore}</div>
								<div className="">{data.tag.OtherStore}</div>
							</div>
							<div className="w-5/12 flex flex-col gap-2">
								<div className="">5,000/10,000</div>
								<div className="">15,000/20,000</div>
							</div>
						</div>
					</div>
					<div className="w-full h-1/6">
						<ul className="">
							<li>{data.tag.WarningA}</li>
							<li>{data.tag.WarningB}</li>
							<li>{data.tag.WarningC}</li>
							<li>{data.tag.WarningD}</li>
						</ul>
					</div>
				</div>
				<div className="bg-green-20 w-2/6 h-full flex items-center justify-center">
					<div className={`transform rotate-90 text-[#ffbae1] text-8xl  opacity-60 ${rubikiso.className}`}>
						Beaver
					</div>
				</div>
			</div>
		</div>
	);
};

export default PriceListPage;
