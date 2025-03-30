import { ZCOOL_KuaiLe } from "next/font/google";
import { Coiny } from "next/font/google";
import { Heart } from "lucide-react";
import { Single_Day } from "next/font/google";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
const coiny = Coiny({ subsets: ["latin"], weight: "400" });
const single = Single_Day({ weight: "400" });

export default function AppointmentReminder() {
	const [isCopied, setIsCopied] = useState(false);
	const address = "서울 마포구 서교동 325-7 301";

	const handleCopy = () => {
		navigator.clipboard.writeText(address)
			.then(() => {
				setIsCopied(true);
				toast("地址复制成功", {
					position: "top-center",
					duration: 2000,
				});
				setTimeout(() => setIsCopied(false), 2000);
			})
			.catch(err => {
				console.error("复制失败:", err);
				toast("复制失败，请重试", {
					position: "top-center",
				});
			});
	};

	return (
		<div className="w-80 h-40 bg-white rounded-t-2xl rounded-bl-2xl p-2 px-4 border-2 ">
			<div
				className={`${zcool.className} text-[#fa5e75] flex justify-between`}
			>
				<span className="text-xl">预约提醒!!</span>
				<div>
					<Heart className="inline fill-red-500 w-3 h-3" />
				</div>
			</div>
			<div className={`${zcool.className} text-[#424242]`}>
				您的本次预约时间为:
			</div>
			<div className={`${coiny.className} text-[#424242] text-2xl`}>
				2023.04.02
			</div>
			<div className={`${zcool.className} text-[#424242] text-xl`}>
				<div className="">
					<span className="">店铺地址</span>
					<Copy
						className={`inline w-4 h-4 ml-1 cursor-pointer ${isCopied ? 'text-green-500' : ''}`}
						onClick={handleCopy}
					/>
				</div>
			</div>
			<div className={`${zcool.className} text-[#424242] text-xl`}>
				<div className={`${single.className} inline ml-1 text-2xl`}>
					{address}
				</div>
			</div>
		</div>
	);
}
