import {
	ZCOOL_KuaiLe,
	Rubik_Iso,
	Rubik_Bubbles,
} from "next/font/google";

const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
const rubikiso = Rubik_Iso({ subsets: ["latin"], weight: "400" });
const rubikkub = Rubik_Bubbles({ subsets: ["latin"], weight: "400" });



const PriceListPage = () => {
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
								手 Hands
							</div>
						</div>
						<div className="w-full flex text-[#ff7dac]">
							<div className="w-7/12 flex flex-col gap-2 pl-2 ">
								<div className="flex items-center">纯色</div>
								<div className="flex items-center">猫眼</div>
								<div className="flex items-center">法式/渐变</div>
								<div className="flex items-center">延长（单根）</div>
								<div className="flex items-center">基础款式</div>
								<div className="flex items-center">复杂款式</div>
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
								脚 Pedi
							</div>
						</div>
						<div className="w-full flex text-[#ff7dac]">
							<div className="w-7/12 flex flex-col gap-2 pl-2">
								<div className="">纯色</div>
								<div className="">款式</div>
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
								卸甲 Removal
							</div>
						</div>
						<div className="w-full flex text-[#ff7dac]">
							<div className="w-7/12 flex flex-col gap-2 pl-2">
								<div className="">本店无/有延长</div>
								<div className="">他店无/有延长</div>
							</div>
							<div className="w-5/12 flex flex-col gap-2">
								<div className="">5,000/10,000</div>
								<div className="">15,000/20,000</div>
							</div>
						</div>
					</div>
					<div className="w-full h-1/6">
						<ul className="">
							<li>* 所有项目均带建构</li>
							<li>* 以上价格为现金价 (刷卡的话附加税+10%)</li>
							<li>* 本店美甲续做时，免费卸甲</li>
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
