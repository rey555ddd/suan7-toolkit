import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ThumbsUp, ThumbsDown, Award, Check } from "lucide-react";
import { toast } from "sonner";

interface Props {
  tool: string;
  toolContext?: string;
  outputText: string;
  className?: string;
}

type Rating = "up" | "down" | "gold";

export default function FeedbackBar({ tool, toolContext, outputText, className = "" }: Props) {
  const [submitted, setSubmitted] = useState<Rating | null>(null);
  const statusQuery = trpc.feedback.status.useQuery();

  const submitMutation = trpc.feedback.submit.useMutation({
    onSuccess: (_, vars) => {
      setSubmitted(vars.rating as Rating);
      const msg =
        vars.rating === "up" ? "謝謝！已標為「採用」✅"
        : vars.rating === "down" ? "已記錄「重做」，AI 會學習"
        : "已存入金庫 🏆";
      toast.success(msg);
    },
    onError: () => toast.error("送出失敗，請稍後再試"),
  });

  const handleClick = (rating: Rating) => {
    if (submitted || submitMutation.isPending) return;
    submitMutation.mutate({ tool, toolContext, outputText, rating });
  };

  if (!statusQuery.data?.configured) {
    return (
      <div className={`text-[11px] text-muted-foreground ${className}`}>
        💡 D1 資料庫綁定後可給 AI 回饋
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-emerald-600 ${className}`}>
        <Check className="w-3.5 h-3.5" />
        已回饋：{submitted === "up" ? "採用" : submitted === "down" ? "重做" : "金庫 🏆"}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-muted-foreground mr-1">這版好用嗎？</span>
      <button
        onClick={() => handleClick("up")}
        disabled={submitMutation.isPending}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-zinc-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition text-xs"
      >
        <ThumbsUp className="w-3.5 h-3.5" /> 採用
      </button>
      <button
        onClick={() => handleClick("down")}
        disabled={submitMutation.isPending}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-zinc-200 bg-white hover:border-red-400 hover:bg-red-50 hover:text-red-700 transition text-xs"
      >
        <ThumbsDown className="w-3.5 h-3.5" /> 重做
      </button>
      <button
        onClick={() => handleClick("gold")}
        disabled={submitMutation.isPending}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-400 hover:bg-amber-100 transition text-xs"
      >
        <Award className="w-3.5 h-3.5" /> 存金庫
      </button>
    </div>
  );
}
