"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ZCOOL_KuaiLe } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegisterStore } from "../registerStore";
import { toast } from "react-hot-toast";

const zcool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: "400" });

const SecurityQuestionPage = () => {
  const router = useRouter();
  const { securityQuestion, securityAnswer, setSecurityQuestion, setSecurityAnswer } = useRegisterStore();
  const [errors, setErrors] = useState<{ securityQuestion?: string; securityAnswer?: string }>({});

  const handleLinkClick = (url?: string) => {
    router.push(url || "/");
  };

  const validateForm = () => {
    const newErrors: { securityQuestion?: string; securityAnswer?: string } = {};

    if (!securityQuestion) {
      newErrors.securityQuestion = "请输入安全问题";
    }

    if (!securityAnswer) {
      newErrors.securityAnswer = "请输入安全问题答案";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      router.push("/auth/register/userInfo");
    } else {
      toast.error("请填写安全问题和答案");
    }
  };

  return (
    <div
      className={`bg-[url('/background_img.png')] bg-cover bg-center w-full h-full flex items-end justify-center ${zcool.className}`}
    >
      <div className="border-none bg-gradient-to-r from-pink-300 to-pink-400 w-full md:w-2/3 h-fit md:h-full rounded-b-none rounded-t-full flex flex-col items-center justify-center">
        <div className="w-2/3 flex flex-col justify-between h-full py-12 gap-5">
          <div className="flex items-center justify-center text-3xl md:text-5xl">
            安全问题
          </div>
          <div className="">
            <div className="text-lg">输入一个安全问题</div>
            <div className="flex gap-3 items-center">
              <Input
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className="border-b-2 border-transparent shadow-sm focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
              />
            </div>
            {errors.securityQuestion && <p className="text-red-500 text-sm mt-1">{errors.securityQuestion}</p>}
          </div>
          <div className="">
            <div className="text-lg">答案</div>
            <div className="flex gap-3 items-center">
              <Input
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="border-b-2 border-transparent shadow-sm focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
              />
            </div>
            {errors.securityAnswer && <p className="text-red-500 text-sm mt-1">{errors.securityAnswer}</p>}
          </div>
          <div className="flex">
            <div
              className="flex justify-center items-center w-full"
              onClick={() => handleLinkClick("/auth/register/account")}
            >
              <Button variant="outline">返回</Button>
            </div>
            <div
              className="flex justify-center items-center w-full"
            >
              <Button onClick={handleNextStep}>继续</Button>
            </div>
          </div>
          <div className="flex justify-center items-center w-full text-sm md:text-base">
            <div className="flex">
              <div className="">已经有账号？</div>
              <div
                className="ml-1 cursor-pointer hover:underline"
                onClick={() => handleLinkClick("/auth/login")}
              >
                登录
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityQuestionPage;
