"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLanguageStore } from "@/store/languageStore";

export const LanguageToggle = () => {
    const { currentLang, setLanguage } = useLanguageStore();

    return (
        <ToggleGroup
            type="single"
            value={currentLang}
            className="bg-white rounded-full"
            onValueChange={(value) => value && setLanguage(value as "en" | "zh" | "kr")}
        >
            <ToggleGroupItem value="zh" className="text-[12px] data-[state=on]:bg-pink-300 data-[state=on]:text-white">中文</ToggleGroupItem>
            <ToggleGroupItem value="kr" className="text-[12px] data-[state=on]:bg-pink-300 data-[state=on]:text-white">한국어</ToggleGroupItem>
            <ToggleGroupItem value="en" className="text-[12px] data-[state=on]:bg-pink-300 data-[state=on]:text-white">English</ToggleGroupItem>
        </ToggleGroup>
    );
};