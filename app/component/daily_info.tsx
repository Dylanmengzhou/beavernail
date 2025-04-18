"use client";

import Image from "next/image";
import { Coiny } from "next/font/google";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const coiny = Coiny({ subsets: ["latin"], weight: "400" });

// 天气代码映射到我们的图标
const weatherMapping: Record<string, string> = {
	Clear: "sunny",
	Sunny: "sunny",
	"Partly cloudy": "cloudy",
	Cloudy: "cloudy",
	Overcast: "cloudy",
	Mist: "cloudy",
	Fog: "cloudy",
	"Patchy rain possible": "rain",
	"Patchy light rain": "rain",
	"Light rain": "rain",
	"Moderate rain at times": "rain",
	"Moderate rain": "rain",
	"Heavy rain": "rain",
	"Light freezing rain": "rain",
	"Patchy light drizzle": "rain",
	"Light drizzle": "rain",
	"Freezing drizzle": "rain",
	"Thundery outbreaks possible": "thunder",
	"Patchy light snow": "snowy",
	"Light snow": "snowy",
	"Patchy moderate snow": "snowy",
	"Moderate snow": "snowy",
	"Heavy snow": "snowy",
	"Ice pellets": "snowy",
	"Light sleet": "snowy",
	"Moderate or heavy sleet": "snowy",
};

const DailyInfo = () => {
	const [date, setDate] = useState(new Date());
	const [weather, setWeather] = useState("sunny"); // 默认天气改为sunny
	const [isLoading, setIsLoading] = useState(true); // 添加加载状态

	useEffect(() => {
		// 更新日期
		const timer = setInterval(() => {
			setDate(new Date());
		}, 60000 * 60 * 24); // 每天更新一次

		// 获取天气信息
		const fetchWeather = async () => {
			setIsLoading(true); // 开始加载
			try {
				// 使用wttr.in API获取首尔的天气
				const response = await fetch(
					`https://wttr.in/Seoul?format=j1`,
					{ cache: "no-store" }
				);

				if (!response.ok) {
					throw new Error("天气数据获取失败");
				}

				const data = await response.json();

				// 获取当前天气状况
				const condition =
					data.current_condition[0].weatherDesc[0].value;

				// 映射到我们的天气类型
				const mappedWeather = weatherMapping[condition] || "sunny";

				setWeather(mappedWeather);

				console.log(
					"天气更新成功:",
					mappedWeather,
					"原始天气:",
					condition
				);
			} catch (error) {
				console.error("获取天气失败:", error);
				// 出错时使用默认天气
			} finally {
				setIsLoading(false); // 结束加载
			}
		};

		// 初始获取天气
		fetchWeather();

		// 每6小时更新一次天气
		const weatherTimer = setInterval(
			fetchWeather,
			6 * 60 * 60 * 1000
		);

		return () => {
			clearInterval(timer);
			clearInterval(weatherTimer);
		};
	}, []);

	// 格式化日期
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return (
		<div className={`text-[#424242] ${coiny.className}`}>
			<div className="opacity-60 text-lg">Today is</div>
			<div className="text-4xl">{year}</div>
			<div className="text-6xl">
				{month}.{day}
			</div>
			<div className="text-xl flex items-center gap-2">
				<div className="w-10 h-10 flex items-center justify-center">
					{isLoading ? (
						<Loader2 className="h-5 w-5 animate-spin text-gray-500" />
					) : (
						<Image
							src={`/weather/${weather}.svg`}
							alt={weather}
							width={40}
							height={40}
						/>
					)}
				</div>
				<span className="flex justify-center items-center">Hongdae</span>
			</div>
		</div>
	);
};

export default DailyInfo;
