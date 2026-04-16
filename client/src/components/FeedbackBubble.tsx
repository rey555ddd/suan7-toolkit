import { useState } from "react";
import { useLocation } from "wouter";
import { Bug, Lightbulb, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type Kind = "bug" | "wish";

const SITE_LABEL = "suan7.reyway.com 酸小七工具箱";
const REPO_NAME = "rey555ddd/suan7-toolkit";

export default function FeedbackBubble() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>("bug");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [location] = useLocation();

  const reset = () => {
    setTitle("");
    setDetail("");
  };

  const buildMarkdown = () => {
    const head = kind === "bug" ? "🐛 Bug 回報" : "💡 許願 / 改善建議";
    return [
      `# ${head}：${title}`,
      "",
      `- 類型：${kind === "bug" ? "Bug" : "Wish"}`,
      `- 頁面：${location}`,
      `- 時間：${new Date().toLocaleString("zh-TW")}`,
      "",
      "## 詳細描述",
      detail,
      "",
      "---",
      `**提示給 Claude Code**：這是 ${SITE_LABEL} 的${kind === "bug" ? "Bug 回報" : "許願"}。`,
      kind === "bug"
        ? "請依上述描述定位問題、修復、commit、push。"
        : "請評估可行性，列出 1-2 個具體做法後再動工。",
      `\nRepo：${REPO_NAME}。`,
    ].join("\n");
  };

  const handleCopy = async () => {
    if (!title.trim() || !detail.trim()) {
      toast.warning("請填寫標題和詳細描述");
      return;
    }
    try {
      await navigator.clipboard.writeText(buildMarkdown());
      toast.success("✓ 已複製為可貼給 Claude Code 的提示詞");
      setTimeout(() => {
        reset();
        setOpen(false);
      }, 1200);
    } catch {
      toast.error("複製失敗，請手動選取");
    }
  };

  return (
    <>
      {/* Floating launcher — bottom-left */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium shadow-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:-translate-y-0.5 transition-all"
        aria-label="回報問題或提出建議"
      >
        <span>💬</span>
        <span>有問題按我</span>
      </button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) reset();
        }}
      >
        <DialogContent className="max-w-md p-0 gap-0">
          <DialogTitle className="sr-only">Bug 回報 / 許願池</DialogTitle>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-red-50 border-red-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <div>
                <div className="text-sm font-bold text-red-900">Bug 回報 / 許願池</div>
                <div className="text-[11px] text-red-600">內部測試通道</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-zinc-200">
            {(["bug", "wish"] as Kind[]).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm border-b-2 transition ${
                  kind === k
                    ? "border-red-500 text-red-700 bg-red-50/40"
                    : "border-transparent text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {k === "bug" ? (
                  <Bug className="w-4 h-4" />
                ) : (
                  <Lightbulb className="w-4 h-4" />
                )}
                {k === "bug" ? "Bug 回報" : "許願池"}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="p-4 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">
                {kind === "bug" ? "問題標題（必填）" : "許願標題（必填）"}
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="一句話標題"
                maxLength={100}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white focus:border-red-400 text-zinc-900 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">詳細描述（必填）</label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder={
                  kind === "bug"
                    ? "在哪個頁面、點了什麼、期望什麼、實際發生什麼..."
                    : "告訴我們你希望多什麼功能、或哪裡用起來不順..."
                }
                rows={4}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white focus:border-red-400 text-zinc-900 outline-none resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-100 px-4 pb-4 pt-3">
            <div className="text-[10px] mb-3 text-zinc-400">
              頁面：{location} · {new Date().toLocaleString("zh-TW")}
            </div>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition bg-red-600 hover:bg-red-700 text-white"
            >
              <Copy className="w-4 h-4" />
              複製給 Claude Code
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
