import Image from "next/image";
import { Coiny } from "next/font/google";

const coiny = Coiny({ subsets: ["latin"], weight: "400" });
const DailyInfo = () => {
	return (
		<div className={`text-[#424242] ${coiny.className}`}>
			<div className=" opacity-60 text-lg ">Today is</div>
			<div className=" text-4xl">2025</div>
			<div className="text-6xl">03.30</div>
			<div className=" text-xl flex items-center">
				<Image
					src="/weather/thunder.svg"
					alt="description"
					width={40}
					height={40}
				/>
				<span>Hongdae</span>
			</div>
		</div>
	);
};

export default DailyInfo;
