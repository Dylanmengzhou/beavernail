"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, addHours, isBefore, subHours } from "date-fns";
import { Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  currentBalance?: number;
};

export default function ReservationDetailPage() {
  const { currentLang } = useLanguageStore();
  const data =
    languageData[currentLang as keyof typeof languageData].reservation.history
      .singleReservation.page;

  const membershipMap = {
    free: "普通用户",
    vip: "VIP会员",
  };
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");
  console.log("reservationId", reservationId);
  // type of reservationId
  console.log("type of reservationId", typeof reservationId);

  const [copying, setCopying] = useState(false);

  // 获取预约详情
  useEffect(() => {
    const fetchReservationDetail = async () => {
      try {
        const response = await fetch(
          `/api/reservations/history/getSingleReservation?reservationId=${reservationId}`
        );

        if (!response.ok) {
          throw new Error("获取预约详情失败");
        }

        const data = await response.json();
        setReservation({
          ...data,
          date: new Date(data.date),
          nailArtistName: data.nailArtistName,
        });
      } catch (error) {
        console.error("获取预约详情失败:", error);
        toast.error("获取预约详情失败", {
          position: "top-center",
          duration: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetail();
  }, [reservationId]);

  // 获取韩国时间（UTC+9）
  const getKoreanTime = () => {
    const now = new Date();
    return addHours(now, 9 - now.getTimezoneOffset() / 60);
  };

  // 检查是否可以取消预约（至少提前24小时）
  const canCancelInTime = (reservationDate: Date) => {
    const koreanTime = getKoreanTime();
    const reservationTimeMinusDayKST = subHours(reservationDate, 24);
    return isBefore(koreanTime, reservationTimeMinusDayKST);
  };

  // 取消预约
  const handleCancelReservation = async () => {
    setCancelLoading(true);
    try {
      const response = await fetch(
        `/api/reservations/history/getSingleReservation?reservationId=${reservationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("取消预约失败");
      }

      toast.success(data.function.ReservationCancelledSuccess, {
        position: "top-center",
        duration: 2000,
      });

      setDialogOpen(false);

      // 延迟导航回列表页面，让用户看到成功提示
      setTimeout(() => {
        router.push("/reservation/history");
      }, 1500);
    } catch (error) {
      console.error("取消预约失败:", error);
      toast.error(data.function.ReservationCancelledFailed, {
        position: "top-center",
        duration: 2000,
      });
    } finally {
      setCancelLoading(false);
    }
  };

  // 返回按钮处理
  const handleBack = () => {
    router.push("/reservation/history");
  };
  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR");
  };
  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "cash":
        return "现金支付";
      case "memberCard":
        return "会员卡";
      case "card":
        return "银行卡";
      case "wechat":
        return "微信支付";
      case "alipay":
        return "支付宝";
      default:
        return "未设置";
    }
  };

  // 复制账户号码
  const copyAccountNumber = () => {
    const accountNumber = "110599652515";

    // 创建临时输入框元素
    const tempInput = document.createElement("input");
    tempInput.value = accountNumber;
    document.body.appendChild(tempInput);

    // 选择内容
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // 兼容移动端

    // 尝试复制
    try {
      document.execCommand("copy");
      setCopying(true);
      toast.success("账号已复制到剪贴板", {
        position: "top-center",
        duration: 1500,
      });

      setTimeout(() => {
        setCopying(false);
      }, 2000);
    } catch (err) {
      console.error("复制失败:", err);
      toast.error("复制失败，请手动复制", {
        position: "top-center",
        duration: 2000,
      });
    } finally {
      // 删除临时元素
      document.body.removeChild(tempInput);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${zcool.className}`}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-black p-6 text-center">
            <p className="text-gray-500 mb-4">{data.tag.ReservationNotExist}</p>
            <Button
              variant="outline"
              className="border-2 border-black bg-white text-black hover:bg-black hover:text-white font-bold"
              onClick={handleBack}
            >
              {data.tag.ReturnReservationList}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canCancel = reservation.status === "upcoming";
  const isWithin24Hours = !canCancelInTime(reservation.date);

  return (
    <div className={`w-10/12 h-full  ${zcool.className}`}>
      {/* 发票样式容器 */}
      <div className="bg-white shadow-lg border-2 border-black overflow-hidden font-mono max-w-4xl mx-auto">
        {/* 复古发票头部 */}
        <div className="bg-white border-b-4 border-black p-6">
          <div className="text-center mb-4">
            <div className="border-2 border-black p-4 inline-block">
              <h2 className="text-3xl font-bold tracking-widest mb-1">
                BEAVER NAIL
              </h2>
              <div className="border-t-2 border-black pt-2 mt-2">
                <p className="text-sm tracking-wide">
                  비버네일 • NAIL ART STUDIO
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t-2 border-b-2 border-black py-3 mt-4">
            <div className="text-left">
              <div className="text-lg font-bold">INVOICE</div>
              <div className="text-sm">SERVICE RECEIPT</div>
            </div>
            <div className="text-right">
              <div className="text-sm">NO.</div>
              <div className="text-lg font-bold font-mono">
                #{reservation.id.substring(0, 8).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* 客户信息 */}
        <div className="p-6 border-b-2 border-black bg-white">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-sm mb-2 border-b border-black pb-1">
                CUSTOMER INFO
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>TYPE:</span>
                  <span className={`font-bold ${reservation.currentMemberShip === "vip" ? " text-amber-400" : ""}`}>
                    {membershipMap[reservation.currentMemberShip as keyof typeof membershipMap]}
                  </span>
                </div>
                {reservation.currentMemberShip==="vip" && (
                  <>
				  <div className="flex justify-between">
                    <span>余额:</span>
                    <span className="font-bold">
                      {reservation.currentBalance?.toLocaleString("ko-KR")}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>-结余后: </span>
                    <span className={`font-bold text-sm ${reservation.finalPrice?"":"text-red-500"}`}>
						{reservation.finalPrice && reservation.currentBalance?((reservation.currentBalance-reservation.finalPrice)?.toLocaleString("ko-KR")+"원"):("未确认")}
                    </span>
                  </div>
				  </>
                )}
                <div className="flex justify-between">
                  <span>STATUS:</span>
                  <span className="font-bold uppercase">
                    {reservation.status === "upcoming"
                      ? "PENDING"
                      : reservation.status === "completed"
                      ? "COMPLETED"
                      : "CANCELLED"}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-2 border-b border-black pb-1">
                DATE & TIME
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>ISSUED:</span>
                  <span className="font-mono">
                    {format(new Date(), "yyyy/MM/dd")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>SERVICE:</span>
                  <span className="font-mono">
                    {format(reservation.date, "yyyy/MM/dd")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 服务明细 - 复古表格 */}
        <div className="p-3 md:p-6">
          <h3 className="font-bold text-sm mb-4 text-center border-b-2 border-black pb-2">
            SERVICE DETAILS
          </h3>

          {/* 表格 */}
          <div className="border-2 border-black">
            <table className="w-full border-collapse">
              {/* 表头 */}
              <thead>
                <tr className="bg-black text-white text-xs font-bold">
                  <th className="p-2 text-center border-r border-white w-12">
                    QTY
                  </th>
                  <th className="p-2 border-r border-white">DESCRIPTION</th>
                  <th className="p-2 text-center border-r border-white w-20">
                    UNIT
                  </th>
                  <th className="p-2 text-center w-24">AMOUNT</th>
                </tr>
              </thead>

              <tbody>
                {/* 服务项目 */}
                <tr className="border-b border-black text-sm">
                  <td className="p-2 text-center border-r border-black">1</td>
                  <td className="p-2 border-r border-black">
                    <div className="font-bold">NAIL ART SERVICE</div>
                    <div className="text-xs text-gray-600">
                      {format(reservation.date, "yyyy/MM/dd")}{" "}
                      {reservation.timeSlot}
                    </div>
                    {reservation.nailArtistName && (
                      <div className="text-xs text-gray-600">
                        ARTIST: {reservation.nailArtistName}
                      </div>
                    )}
                  </td>
                  <td className="p-2 text-center border-r border-black">
                    SERVICE
                  </td>
                  <td className={`p-2 text-center font-mono ${reservation.finalPrice?"":"text-red-500"}`}>
                    {reservation.finalPrice
                      ? formatPrice(reservation.finalPrice)
                      : "未确认"}
                  </td>
                </tr>

                {/* 押金项目 */}
                <tr className="border-b border-black text-sm">
                  <td className="p-2 text-center border-r border-black">1</td>
                  <td className="p-2 border-r border-black">
                    <div className="font-bold">RESERVATION DEPOSIT</div>
                    <div className="text-xs text-gray-600">ADVANCE PAYMENT</div>
                  </td>
                  <td className="p-2 text-center border-r border-black">
                    定金
                  </td>
                  <td className="p-2 text-center font-mono">20,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 总计区域 */}
          <div className="mt-4 border-2 border-black">
            <div className="bg-black text-white p-2">
              <div className="flex justify-between text-sm font-bold">
                <div>PAYMENT SUMMARY</div>
                <div>AMOUNT (KRW)</div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm border-b border-gray-300 pb-1">
                <span>SERVICE TOTAL:</span>
                <span className="font-mono">
                  {reservation.finalPrice
                    ? formatPrice(reservation.finalPrice)
                    : "0"}
                </span>
              </div>
              <div className="flex justify-between text-sm border-b border-gray-300 pb-1">
                <span>DEPOSIT PAID:</span>
                <span className="font-mono">20,000</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t-2 border-black pt-2">
                <span>到店应付:</span>
                <span className={`font-mono ${reservation.finalPrice?"":"text-red-500"}`}>
                  {reservation.finalPrice?formatPrice(reservation.finalPrice - 20000):"未确认"}
                </span>
              </div>
            </div>
          </div>

          {/* 支付信息 */}
          <div className="mt-6 border-2 border-black">
            <div className="bg-black text-white p-2 text-sm font-bold">
              PAYMENT INFORMATION
            </div>
            <div className="p-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-bold mb-1">PAYMENT METHOD:</div>
                <div className="font-mono">
                  {reservation.paymentMethod
                    ? formatPaymentMethod(reservation.paymentMethod)
                    : "NOT SET"}
                </div>
              </div>
              <div>
                <div className="font-bold mb-1">DEPOSIT ACCOUNT:</div>
                <div className="font-mono text-xs">
                  <div>정영나(비버네일)</div>
                  <div>SHINHAN BANK</div>
                  <div className="flex items-center gap-1">
                    <span>110599652515</span>
                    <button
                      onClick={copyAccountNumber}
                      className="p-1 border border-black hover:bg-gray-100 transition-colors"
                      title="복사"
                    >
                      {copying ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 取消警告 */}
          {isWithin24Hours && canCancel && (
            <div className="mt-4 border-2 border-black bg-gray-100 p-3">
              <div className="text-black text-sm font-bold text-center">
                ⚠ {data.tag.ReservationWarning}
              </div>
            </div>
          )}
        </div>

        {/* 复古发票底部 */}
        <div className="bg-white border-t-4 border-black p-6">
          <div className="text-center text-xs mb-4 border-2 border-black p-3">
            <div className="font-bold mb-2">THANK YOU FOR YOUR BUSINESS</div>
            <div className="space-y-1">
              <p>
                • ALL RESERVATIONS REQUIRE 24 HOURS NOTICE FOR CANCELLATION •
              </p>
              <p>• DEPOSIT IS NON-REFUNDABLE AFTER SERVICE COMPLETION •</p>
              <p>감사합니다 • BEAVER NAIL STUDIO</p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            {canCancel ? (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-black bg-white text-black hover:bg-black hover:text-white font-bold"
                    disabled={isWithin24Hours}
                    title={
                      isWithin24Hours
                        ? "预约无法取消：距离预约时间不足24小时（韩国时间）"
                        : ""
                    }
                  >
                    {data.tag.CancelReservation}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {data.tag.CancelReservationConfirm}
                    </DialogTitle>
                    <DialogDescription>
                      {data.tag.CancelReservationConfirmWarning}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      {data.tag.Return}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleCancelReservation}
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {data.tag.Processing}
                        </>
                      ) : (
                        data.tag.ConfirmCancelled
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : null}
            <Button
              variant="outline"
              className="flex-1 border-2 border-black bg-white text-black hover:bg-black hover:text-white font-bold"
              onClick={handleBack}
            >
              {data.tag.ReturnReservationList}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
