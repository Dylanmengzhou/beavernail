"use client";

import { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react"; // 添加Loader2图标导入
import { useRouter } from "next/navigation";
import { ZCOOL_KuaiLe } from "next/font/google";
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

// 预约数据类型
type Reservation = {
	id: string;
	date: Date;
	timeSlot: string;
	status: "upcoming" | "completed" | "cancelled";
	nailArtistName?: string;
};

// API返回的预约数据类型
interface ApiReservation {
	id: string;
	date: string; // API返回的日期是字符串格式
	timeSlot: string;
	status: "upcoming" | "completed" | "cancelled";
}

// 分页数据类型
type PaginationData = {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};

// 状态映射

const HistoryPage = () => {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].reservation
			.history.page;

	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [pagination, setPagination] = useState<PaginationData>({
		total: 0,
		page: 1,
		limit: 5,
		totalPages: 0,
	});
	const [activeTab, setActiveTab] = useState<
		"all" | "upcoming" | "completed"
	>("all");
	const [loading, setLoading] = useState(true);

	// 从API获取数据
	const fetchReservations = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`/api/reservations/history?page=${pagination.page}&limit=${pagination.limit}&filter=${activeTab}`
			);

			if (!response.ok) {
				throw new Error("获取预约记录失败");
			}

			const data = await response.json();

			// 转换日期字符串为Date对象
			const formattedReservations = data.reservations.map(
				(res: ApiReservation) => ({
					...res,
					date: new Date(res.date),
				})
			);

			setReservations(formattedReservations);
			setPagination(data.pagination);
		} catch (error) {
			console.error("获取预约记录失败:", error);
		} finally {
			setLoading(false);
		}
	};

	// 初始加载和筛选/分页变化时获取数据
	useEffect(() => {
		fetchReservations();
	}, [pagination.page, activeTab]);

	// 处理页面变化
	const handlePageChange = (page: number) => {
		setPagination((prev) => ({ ...prev, page }));
	};

	// 处理标签变化
	const handleTabChange = (value: string) => {
		setActiveTab(value as "all" | "upcoming" | "completed");
		setPagination((prev) => ({ ...prev, page: 1 })); // 切换标签时重置到第一页
	};

	return (
		<div
			className={` w-11/12 pt-4 md:py-6 px-4 md:px-6 h-full  bg-amber-200  rounded-t-3xl ${zcool.className}`}
		>
			<h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex justify-center items-center">
				{data.tag.MyReservation}
			</h1>

			<Tabs
				defaultValue="all"
				onValueChange={handleTabChange}
				className="w-full"
			>
				<TabsList className="mb-4 w-full md:w-auto grid grid-cols-3 md:flex">
					<TabsTrigger value="all" className="flex-1 md:flex-none">
						{data.tag.AllReservation}
					</TabsTrigger>
					<TabsTrigger
						value="upcoming"
						className="flex-1 md:flex-none"
					>
						{data.tag.UpcomingReservation}
					</TabsTrigger>
					<TabsTrigger
						value="completed"
						className="flex-1 md:flex-none"
					>
						{data.tag.AccomplishedReservation}
					</TabsTrigger>
				</TabsList>

				{/* 电脑端内容 */}
				<div className="hidden md:block bg-white rounded-lg shadow-sm p-5 mb-4 h-[300px] overflow-y-auto">
					<TabsContent value="all" className="mt-0 h-full">
						{loading ? (
							<div className="flex items-center justify-center h-full">
								<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
							</div>
						) : (
							<ReservationTable reservations={reservations} />
						)}
					</TabsContent>

					<TabsContent value="upcoming" className="mt-0 h-full">
						{loading ? (
							<div className="flex items-center justify-center h-full">
								<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
							</div>
						) : (
							<ReservationTable reservations={reservations} />
						)}
					</TabsContent>

					<TabsContent value="completed" className="mt-0 h-full">
						{loading ? (
							<div className="flex items-center justify-center h-full">
								<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
							</div>
						) : (
							<ReservationTable reservations={reservations} />
						)}
					</TabsContent>
				</div>

				{/* 移动端内容 */}
				<div className="block md:hidden h-[320px]">
					<TabsContent value="all" className="mt-0 h-full">
						{loading ? (
							<div className="flex items-center justify-center h-full bg-white rounded-lg shadow-sm">
								<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
							</div>
						) : (
							<ReservationCards reservations={reservations} />
						)}
					</TabsContent>

					<TabsContent value="upcoming" className="mt-0 h-full">
						{loading ? (
							<div className="flex items-center justify-center h-full bg-white rounded-lg shadow-sm">
								<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
							</div>
						) : (
							<ReservationCards reservations={reservations} />
						)}
					</TabsContent>

					<TabsContent value="completed" className="mt-0 h-full">
						{loading ? (
							<div className="flex items-center justify-center h-full bg-white rounded-lg shadow-sm">
								<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
							</div>
						) : (
							<ReservationCards reservations={reservations} />
						)}
					</TabsContent>
				</div>
			</Tabs>

			{pagination.totalPages > 1 && (
				<Pagination className="mt-4 mb-4 md:mb-0">
					<PaginationContent className="flex flex-wrap justify-center">
						{pagination.page > 1 && (
							<PaginationItem>
								<PaginationPrevious
									onClick={() =>
										handlePageChange(pagination.page - 1)
									}
								/>
							</PaginationItem>
						)}

						{Array.from(
							{ length: Math.min(5, pagination.totalPages) },
							(_, i) => {
								let pageNumber;
								if (pagination.totalPages <= 5) {
									pageNumber = i + 1;
								} else if (pagination.page <= 3) {
									pageNumber = i + 1;
								} else if (
									pagination.page >=
									pagination.totalPages - 2
								) {
									pageNumber = pagination.totalPages - 4 + i;
								} else {
									pageNumber = pagination.page - 2 + i;
								}

								return (
									<PaginationItem key={pageNumber}>
										<PaginationLink
											isActive={pageNumber === pagination.page}
											onClick={() => handlePageChange(pageNumber)}
										>
											{pageNumber}
										</PaginationLink>
									</PaginationItem>
								);
							}
						)}

						{pagination.page < pagination.totalPages && (
							<PaginationItem>
								<PaginationNext
									onClick={() =>
										handlePageChange(pagination.page + 1)
									}
								/>
							</PaginationItem>
						)}
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
};

// 预约表格组件 (桌面端)
const ReservationTable = ({
	reservations,
}: {
	reservations: Reservation[];
}) => {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].reservation
			.history.page;
	const statusMap = {
		upcoming: {
			label: data.function.Upcoming,
			className: "bg-blue-100 text-blue-800",
		},
		completed: {
			label: data.function.Accomplished,
			className: "bg-green-100 text-green-800",
		},
		cancelled: {
			label: data.function.Canceled,
			className: "bg-red-100 text-red-800",
		},
	};
	const router = useRouter();

	// 点击预约行时导航到详情页
	const handleRowClick = (id: string) => {
		router.push(
			`/reservation/history/singleReservation?reservationId=${id}`
		);
	};

	return (
		<div className="overflow-x-auto h-full">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{data.tag.ReservationCode}</TableHead>
						<TableHead>{data.tag.ReservationDate}</TableHead>
						<TableHead>{data.tag.ReservationTime}</TableHead>
						<TableHead>{data.tag.NailArtist}</TableHead>
						<TableHead>{data.tag.ReservationStatus}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{reservations.map((reservation) => (
						<TableRow
							key={reservation.id}
							onClick={() => handleRowClick(reservation.id)}
							className="cursor-pointer hover:bg-pink-50"
						>
							<TableCell>
								#{reservation.id.substring(0, 8)}
							</TableCell>
							<TableCell>
								{format(reservation.date, data.tag.DateFormat, {
									locale: zhCN,
								})}
							</TableCell>
							<TableCell>{reservation.timeSlot}</TableCell>
							<TableCell>{reservation.nailArtistName || "-"}</TableCell>
							<TableCell>
								<Badge
									variant="outline"
									className={statusMap[reservation.status].className}
								>
									{statusMap[reservation.status].label}
								</Badge>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

// 预约卡片组件 (移动端) - 修改为更小的尺寸
const ReservationCards = ({
	reservations,
}: {
	reservations: Reservation[];
}) => {
	const { currentLang } = useLanguageStore();
	const data =
		languageData[currentLang as keyof typeof languageData].reservation
			.history.page;
	const statusMap = {
		upcoming: {
			label: data.function.Upcoming,
			className: "bg-blue-100 text-blue-800",
		},
		completed: {
			label: data.function.Accomplished,
			className: "bg-green-100 text-green-800",
		},
		cancelled: {
			label: data.function.Canceled,
			className: "bg-red-100 text-red-800",
		},
	};
	const router = useRouter();

	// 点击卡片时导航到详情页
	const handleCardClick = (id: string) => {
		router.push(
			`/reservation/history/singleReservation?reservationId=${id}`
		);
	};

	if (reservations.length === 0) {
		return (
			<div className="text-center py-8 bg-white rounded-lg shadow-sm h-[400px] flex items-center justify-center">
				<p className="text-gray-500">{data.tag.NoReservation}</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4">
			{reservations.map((reservation) => (
				<Card
					key={reservation.id}
					className="bg-white rounded-lg shadow-sm cursor-pointer hover:bg-pink-50"
					onClick={() => handleCardClick(reservation.id)}
				>
					<CardContent className="p-4">
						<div className="flex justify-between items-center mb-2">
							<span className="font-medium text-pink-600">
								#{reservation.id.substring(0, 8)}
							</span>
							<Badge
								variant="outline"
								className={statusMap[reservation.status].className}
							>
								{statusMap[reservation.status].label}
							</Badge>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-500">{data.tag.ReservationDate}</span>
							<span>
								{format(reservation.date, data.tag.DateFormat, {
									locale: zhCN,
								})}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-500">{data.tag.ReservationTime}</span>
							<span>{reservation.timeSlot}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-500">{data.tag.NailArtist }</span>
							<span>{reservation.nailArtistName || "-"}</span>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

// 删除骨架屏组件，不再需要
// const ReservationTableSkeleton = () => { ... }
// const ReservationCardsSkeleton = () => { ... }

export default HistoryPage;
