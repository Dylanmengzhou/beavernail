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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
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
  finalPrice?: number;
  paymentMethod?: string;
  currentMemberShip?: string;
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

const membershipMap = {
  free: "普通用户",
  vip: "VIP会员",
};

const paymentMethodMap = {
  cash: "现金支付",
  memberCard: "会员卡",
  card: "银行卡",
  wechat: "微信支付",
  alipay: "支付宝",
};

const HistoryPage = () => {
  const { currentLang } = useLanguageStore();
  const data =
    languageData[currentLang as keyof typeof languageData].reservation.history
      .page;

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
  });
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "completed">(
    "all"
  );
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
    <>
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
      `}</style>
      <div
        className={` w-11/12 pt-4 md:py-6 px-4 md:px-6 h-full bg-amber-200  rounded-t-3xl ${zcool.className}`}
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
            <TabsTrigger value="upcoming" className="flex-1 md:flex-none">
              {data.tag.UpcomingReservation}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 md:flex-none">
              {data.tag.AccomplishedReservation}
            </TabsTrigger>
          </TabsList>

          {/* 电脑端内容 */}
          <div className="hidden md:block bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-xl border border-pink-100/50 p-6 mb-4 h-[600px] overflow-y-auto">
            <TabsContent value="all" className="mt-0 h-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                </div>
              ) : (
                <ReservationTable reservations={reservations} />
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-0 h-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                </div>
              ) : (
                <ReservationTable reservations={reservations} />
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0 h-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                </div>
              ) : (
                <ReservationTable reservations={reservations} />
              )}
            </TabsContent>
          </div>

          {/* 移动端内容 */}
          <div className="block md:hidden h-[400px]">
            <TabsContent value="all" className="mt-0 h-full">
              {loading ? (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-xl border border-pink-100/50">
                  <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                </div>
              ) : (
                <div className="h-full overflow-y-auto">
                  <ReservationCards reservations={reservations} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-0 h-full">
              {loading ? (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-xl border border-pink-100/50">
                  <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                </div>
              ) : (
                <div className="h-full overflow-y-auto">
                  <ReservationCards reservations={reservations} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0 h-full">
              {loading ? (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-xl border border-pink-100/50">
                  <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                </div>
              ) : (
                <div className="h-full overflow-y-auto">
                  <ReservationCards reservations={reservations} />
                </div>
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
                    onClick={() => handlePageChange(pagination.page - 1)}
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
                  } else if (pagination.page >= pagination.totalPages - 2) {
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
                    onClick={() => handlePageChange(pagination.page + 1)}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
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
    languageData[currentLang as keyof typeof languageData].reservation.history
      .page;
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
    router.push(`/reservation/history/singleReservation?reservationId=${id}`);
  };

  return (
    <div className="overflow-x-auto h-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-pink-100/50 to-pink-200/30 border-b-2 border-pink-200/50">
            <TableHead className="font-bold text-pink-800">
              📝 {data.tag.ReservationCode}
            </TableHead>
            <TableHead className="font-bold text-pink-800">
              📅 {data.tag.ReservationDate}
            </TableHead>
            <TableHead className="font-bold text-pink-800">
              🕒 {data.tag.ReservationTime}
            </TableHead>
            <TableHead className="font-bold text-pink-800">
              💅 {data.tag.NailArtist}
            </TableHead>
            <TableHead className="font-bold text-pink-800">
              📊 {data.tag.ReservationStatus}
            </TableHead>
            <TableHead className="font-bold text-pink-800">
              👤 用户类型
            </TableHead>
            <TableHead className="font-bold text-pink-800">
              💳 支付方式
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow
              key={reservation.id}
              onClick={() => handleRowClick(reservation.id)}
              className="cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100/50 transition-all duration-200 border-b border-pink-100/30"
            >
              <TableCell>#{reservation.id.substring(0, 8)}</TableCell>
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
                  className={`${
                    statusMap[reservation.status].className
                  } px-3 py-1 font-medium rounded-full border-none shadow-sm`}
                >
                  {statusMap[reservation.status].label}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`px-3 py-1 font-medium rounded-full border-none shadow-sm ${
                    reservation.currentMemberShip === "vip"
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 shadow-amber-200"
                      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"
                  }`}
                >
                  {
                    membershipMap[
                      reservation.currentMemberShip as keyof typeof membershipMap
                    ]
                  }
                </Badge>
              </TableCell>
        
              <TableCell>
                {reservation.paymentMethod
                  ? paymentMethodMap[
                      reservation.paymentMethod as keyof typeof paymentMethodMap
                    ]
                  : "-"}
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
    languageData[currentLang as keyof typeof languageData].reservation.history
      .page;
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
    router.push(`/reservation/history/singleReservation?reservationId=${id}`);
  };

  if (reservations.length === 0) {
    return (
      <div className="text-center py-8 bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-xl border border-pink-100/50 h-full flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">💅</div>
        <p className="text-gray-600 font-medium text-lg">
          {data.tag.NoReservation}
        </p>
        <p className="text-gray-400 text-sm mt-2">暂时还没有预约记录哦~</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {reservations.map((reservation) => (
        <Card
          key={reservation.id}
          className="pb-0 bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer border border-pink-100/50 transition-all duration-300 hover:scale-[1.02] hover:border-pink-200"
          onClick={() => handleCardClick(reservation.id)}
        >
          <CardContent className="p-5 pb-2 flex flex-col gap-3">
            {/* 头部 - 预约编号和状态 */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span className="font-bold text-pink-600 text-lg">
                  #{reservation.id.substring(0, 8)}
                </span>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className={`${
                    statusMap[reservation.status].className
                  } px-3 py-1 font-medium rounded-full border-none shadow-sm`}
                >
                  {statusMap[reservation.status].label}
                </Badge>
                <Badge
                  variant="outline"
                  className={`px-3 py-1 font-medium rounded-full border-none shadow-sm ${
                    reservation.currentMemberShip === "vip"
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 shadow-amber-200"
                      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"
                  }`}
                >
                  {
                    membershipMap[
                      reservation.currentMemberShip as keyof typeof membershipMap
                    ]
                  }
                </Badge>
              </div>
            </div>

            {/* 预约信息 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-3 rounded-xl">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  📅 {data.tag.ReservationDate}
                </span>
                <span className="font-semibold text-gray-800">
                  {format(reservation.date, data.tag.DateFormat, {
                    locale: zhCN,
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 px-3  rounded-xl">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  🕒 {data.tag.ReservationTime}
                </span>
                <span className="font-semibold text-gray-800">
                  {reservation.timeSlot}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 px-3  rounded-xl">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  💅 {data.tag.NailArtist}
                </span>
                <span className="text-white bg-amber-500 rounded-full px-4 py-1 shadow-sm animate-wiggle inline-block">
                  ★ {reservation.nailArtistName || "-"} ★
                </span>
              </div>

             {reservation.currentMemberShip==="vip"&&(
               <div className="flex justify-between items-center py-2 px-3  rounded-xl">
               <span className="text-gray-600 font-medium flex items-center gap-2">
                 💰 最终价格
               </span>
               <span className="font-bold text-green-600 text-lg">
                 {reservation.finalPrice
                   ? reservation.finalPrice.toLocaleString("ko-KR") + " 원"
                   : "-"}
               </span>
             </div>
             )}

              <div className="flex justify-between items-center py-2 px-3  rounded-xl">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  💳 支付方式
                </span>
                <span className="font-semibold text-gray-800">
                  {reservation.paymentMethod
                    ? paymentMethodMap[
                        reservation.paymentMethod as keyof typeof paymentMethodMap
                      ]
                    : "-"}
                </span>
              </div>
            </div>

            {/* 底部装饰 */}
            <div className="mt-2 flex flex-col w-full items-center justify-center gap-2">
              <div className="w-8/12 h-1 bg-gradient-to-r from-pink-300 to-pink-400 rounded-full"></div>
              <div className="text-gray-500/40 text-sm">点击查看详情</div>
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
