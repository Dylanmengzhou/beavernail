"use client";
import Image from "next/image";
import { Coiny } from "next/font/google";
import "animate.css";
import { ZCOOL_KuaiLe } from "next/font/google";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


const coiny = Coiny({ subsets: ["latin"], weight: "400" });
const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });
export default function MenuComponent({
   className,
}: {
   className?: string;
}) {
   const [blink, setBlink] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isLogin, setIsLogin] = useState(false);
   const { status } = useSession();
   const router = useRouter();
   useEffect(() => {
       if (status === "authenticated") {
           setIsLogin(true);
       }
   }, [status]);


   useEffect(() => {
       const interval = setInterval(() => {
           setBlink(true);
           setTimeout(() => {
               setBlink(false);
               setTimeout(() => {
                   setBlink(true);
                   setTimeout(() => setBlink(false), 100); // 第二次眨眼结束
               }, 100); // 第二次眨眼开始
           }, 100); // 第一次眨眼结束
       }, 3000); // 每3秒眨眼两次
       return () => clearInterval(interval);
   }, []);


   const toggleMenu = () => {
       setIsMenuOpen(!isMenuOpen);
   };

   const handleLinkClick = (path: string) => {
       setIsMenuOpen(false); // 先关闭菜单
       // 使用 setTimeout 延迟路由跳转，让菜单有时间关闭
       setTimeout(() => {
           router.push(path);
       }, 10); // 极短的延迟，足够让菜单开始关闭动画
   };


   return (
       <>
           <div
               className={`flex flex-col items-center justify-center p-5 ${
                   className || ""
               } cursor-pointer`}
               onClick={toggleMenu}
           >
               <div className="relative">
                   <Image
                       src="/menu.svg"
                       alt="description"
                       width={100}
                       height={100}
                   />
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <div className="flex space-x-2">
                           <div
                               className={`w-1 ${
                                   blink ? "h-0" : "h-2"
                               } bg-white rounded-full transition-all duration-100`}
                           ></div>
                           <div
                               className={`w-1 ${
                                   blink ? "h-0" : "h-2"
                               } bg-white rounded-full transition-all duration-100`}
                           ></div>
                       </div>
                       <span className={`text-white ${coiny.className}`}>
                           Menu
                       </span>
                   </div>
               </div>
           </div>


           {/* 菜单展开页面 */}
           {isMenuOpen && (
               <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-opacity-30">
                   <div className="relative bg-[url('/nav_texture.svg')] bg-cover bg-center bg-[#f4a3af] bg-blend-soft-light bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-[4rem] w-2/3 max-w-md h-[50vh] md:h-[90vh] mx-4 flex flex-col items-center justify-center shadow-lg">
                       {/* 菜单内容 */}
                       <div
                           className={`h-2/3 text-white text-2xl md:text-4xl flex flex-col items-center justify-between ${zcool.className}`}
                       >
                           <a
                               href="#"
                               className="hover:text-gray-300 transition-colors"
                               onClick={() => handleLinkClick("/")}
                           >
                               首页
                           </a>
                           <a
                               href="#"
                               className="hover:text-gray-300 transition-colors"
                               onClick={() => handleLinkClick("/reservation")}
                           >
                               预约
                           </a>
                           <a
                               href="#"
                               className="hover:text-gray-300 transition-colors"
                               onClick={() => handleLinkClick("/priceList")}
                           >
                               价格表
                           </a>
                           <a
                               href="#"
                               className="hover:text-gray-300 transition-colors"
                               onClick={() => handleLinkClick("/aboutUs")}
                           >
                               关于我们
                           </a>
                           <a
                               href="#"
                               className="hover:text-gray-300 transition-colors"
                               onClick={() => handleLinkClick("/contact")}
                           >
                               联系方式
                           </a>
                           <div className="flex gap-4 md:gap-14">
                               {!isLogin ? (
                                   <div className="flex gap-4 md:gap-14">
                                       <Button
                                           onClick={() => handleLinkClick("/auth/login")}
                                       >
                                           登录
                                       </Button>
                                       <Button
                                           onClick={() =>
                                               handleLinkClick("/auth/register/account")
                                           }
                                       >
                                           注册
                                       </Button>
                                   </div>
                               ) : (
                                       <a className="flex flex-col gap-2 justify-center items-center hover:text-gray-300 transition-colors"
                                           onClick={() => handleLinkClick("/profile")}
                                       >
                                       个人中心
                                   </a>
                               )}
                           </div>
                       </div>


                       {/* 右下角关闭按钮 - 圆心放在长方形角上 */}
                       <Button
                           onClick={toggleMenu}
                           className="absolute bottom-4 right-3 bg-white rounded-full w-16 h-16 flex items-center justify-center transform translate-x-1/2 translate-y-1/2 shadow-lg"
                       >
                           <X className="w-8 h-8 text-pink-300" />
                       </Button>
                   </div>
               </div>
           )}
       </>
   );
}
