"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";
import { Coiny } from "next/font/google";
import { ZCOOL_KuaiLe } from "next/font/google";
import { History } from "lucide-react";
import { UserRoundPen } from "lucide-react";
import { CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import languageData from "@/public/language.json";
import { useLanguageStore } from "@/store/languageStore";
const coiny = Coiny({ subsets: ["latin"], weight: "400" });
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
const ProfilePage = () => {
  const { currentLang } = useLanguageStore();
  const data =
    languageData[currentLang as keyof typeof languageData].profile.page;

  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [reservationCount, setReservationCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);
  const [remainBalance, setRemainBalance] = useState<number | null>(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/auth/login" });
  };

  // 获取用户预约次数
  useEffect(() => {
    const fetchReservationCount = async () => {
      if (session?.user?.username) {
        setIsLoadingCount(true);
        try {
          const response = await fetch(
            `/api/reservations/count?username=${encodeURIComponent(
              session.user.username
            )}`
          );
          if (response.ok) {
            const data = await response.json();
            setReservationCount(data.count);
            setRemainBalance(data.remainBalance);
          } else {
            console.error("获取预约次数失败");
          }
        } catch (error) {
          console.error("获取预约次数时出错:", error);
        } finally {
          setIsLoadingCount(false);
        }
      }
    };

    if (session?.user?.username) {
      fetchReservationCount();
    }
  }, [session?.user?.username]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        {data.tag.Loading}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 ">
      <Card
        className={`${coiny.className} border-none rounded-4xl bg-gradient-to-r from-violet-200 to-pink-200`}
      >
        <CardHeader className="flex gap-4 items-center justify-center flex-col">
          <CardTitle>
            <div className="relative">
              {session?.user.membershipType === "vip" ? (
                <div className="relative p-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 shadow-lg animate-pulse">
                  <div className="p-1 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400">
                    <Avatar className="w-14 h-14 md:w-20 md:h-20 border-2 border-white shadow-lg">
                      <AvatarImage
                        src={session?.user.image || "./avatarHead.png"}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ) : (
                <Avatar className="w-14 h-14 md:w-20 md:h-20">
                  <AvatarImage
                    src={session?.user.image || "./avatarHead.png"}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
            </div>
          </CardTitle>
          <CardDescription className="text-black">
            <div className="flex flex-col">
              <div className="text-xl truncate max-w-[200px] md:max-w-[250px]">
                {session?.user.nickname}
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className={`text-sm ${zcool.className}`}>
                  {data.tag.ReservationNum}
                </div>
                <div className={`text-sm ${zcool.className}`}>
                  {isLoadingCount ? (
                    <Loader2 className="h-4 w-4 animate-spin inline" />
                  ) : reservationCount !== null ? (
                    reservationCount
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>
          </CardDescription>
          {session?.user.membershipType === "vip" && (
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-full shadow-lg border-2 border-yellow-300/50">
                <span className={`text-white text-sm  drop-shadow-sm`}>
                  余额: {remainBalance?.toLocaleString("ko-KR")} 원
                </span>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="w-full">
          <CardContent className="flex flex-col gap-5 items-center justify-center px-0">
            <div className="w-full flex flex-col items-center justify-center">
              <Button
                className="shadow-[4px_4px_0px_0px_rgba(227,71,200,1)] w-5/6 h-12 flex items-center justify-center gap-2 bg-white border-2 border-pink-300 hover:bg-white text-black rounded-4xl
								active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(227,71,200,1)] transition-all"
                onClick={() => router.push("/reservation/history")}
              >
                <History size={18} />
                <span className={`text-base ${zcool.className}`}>
                  {data.tag.ReservationHistory}
                </span>
              </Button>
            </div>
            <div className="w-full flex flex-col items-center justify-center">
              <Button
                className="shadow-[4px_4px_0px_0px_rgba(227,71,200,1)] w-5/6 h-12 flex items-center justify-center gap-2 bg-white border-2 border-pink-300 hover:bg-white text-black rounded-4xl
								active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(227,71,200,1)] transition-all"
                onClick={() => router.push("/profile/updateProfile")}
              >
                <UserRoundPen size={18} />
                <span className={`text-base ${zcool.className}`}>
                  {data.tag.ChangeProfile}
                </span>
              </Button>
            </div>
            <div className="w-full flex flex-col items-center justify-center">
              <Button
                className="shadow-[4px_4px_0px_0px_rgba(227,71,200,1)] w-5/6 h-12 flex items-center justify-center gap-2 bg-white hover:bg-white text-black rounded-4xl border-2 border-pink-300
								active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(227,71,200,1)] transition-all
								"
                onClick={() => router.push("/profile/nameCard")}
              >
                <CreditCard size={18} />
                <span className={`text-base ${zcool.className}`}>
                  {data.tag.PersonalCard}
                </span>
              </Button>
            </div>
            <div className="w-full flex flex-col items-center justify-center">
              <Button
                className="shadow-[4px_4px_0px_0px_rgba(170,0,1,1)] w-5/6 h-12 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-500 text-white rounded-4xl disabled:opacity-70 border-2 border-red-600
											active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(170,0,1,1)] transition-all
								"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogOut size={18} />
                )}
                <span className={`text-base ${zcool.className}`}>
                  {isSigningOut ? data.tag.Logouting : data.tag.Logout}
                </span>
              </Button>
            </div>
          </CardContent>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;
