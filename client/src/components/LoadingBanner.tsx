import { Sparkles } from "lucide-react";

interface Props {
  message?: string;
}

export default function LoadingBanner({ message = "Gemini AI 生成中..." }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-red-200 border-t-red-500 animate-spin" />
        <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-red-500 opacity-70" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}
