import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ImageIcon, Download, RefreshCw, Wand2, Type,
  AlignLeft, AlignCenter, AlignRight, Palette,
  Layers, Sparkles, ChevronDown, ChevronUp,
} from "lucide-react";
// ── 型別定義 ──────────────────────────────────────────────────────────────

interface TextLayer {
  id: string;
  text: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  color: string;
  align: "left" | "center" | "right";
  x: number; // 0-100 百分比
  y: number; // 0-100 百分比
  shadow: boolean;
  shadowColor: string;
}

// ── 常數 ──────────────────────────────────────────────────────────────────

const IMAGE_TYPES = [
  { value: "social_post", label: "社群貼文背景", desc: "1:1 方形，適合 FB/IG 貼文", icon: "📱" },
  { value: "story", label: "限動背景", desc: "9:16 直式，適合 IG/FB 限時動態", icon: "📸" },
  { value: "poster", label: "活動海報底圖", desc: "海報版型，適合活動宣傳", icon: "🎪" },
  { value: "product", label: "產品情境圖", desc: "食物攝影風格，突顯菜色", icon: "🍜" },
];

const STYLES = [
  { value: "fresh_natural", label: "清新自然", desc: "柔和日光、清爽色調", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "street_cool", label: "街頭潮流", desc: "霓虹感、都市活力", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { value: "literary", label: "文青質感", desc: "暖色調、復古紋理", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { value: "vibrant", label: "繽紛活力", desc: "飽和色彩、歡樂氛圍", color: "bg-red-100 text-red-800 border-red-200" },
];

const PRESET_COLORS = [
  "#FFFFFF", "#000000", "#FF3B30", "#FF9500", "#FFCC00",
  "#34C759", "#007AFF", "#5856D6", "#FF2D55", "#8B4513",
];

const CANVAS_SIZES: Record<string, { w: number; h: number }> = {
  social_post: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
  poster: { w: 1080, h: 1350 },
  product: { w: 1080, h: 1080 },
};

// ── 主組件 ────────────────────────────────────────────────────────────────

export default function ImageCreator() {
  const [imageType, setImageType] = useState<"social_post" | "story" | "poster" | "product">("social_post");
  const [style, setStyle] = useState<"fresh_natural" | "street_cool" | "literary" | "vibrant">("vibrant");
  const [subject, setSubject] = useState("酸菜魚湯鍋，熱騰騰的蒸氣，新鮮食材");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [usedModel, setUsedModel] = useState<string>("");
  const [showTextPanel, setShowTextPanel] = useState(true);

  // 文字圖層
  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: "title",
      text: "酸小七｜酸湯魚",
      fontSize: 72,
      fontWeight: "bold",
      color: "#FFFFFF",
      align: "center",
      x: 50,
      y: 20,
      shadow: true,
      shadowColor: "rgba(0,0,0,0.8)",
    },
    {
      id: "subtitle",
      text: "正宗道地・職人好味",
      fontSize: 42,
      fontWeight: "normal",
      color: "#FFE066",
      align: "center",
      x: 50,
      y: 32,
      shadow: true,
      shadowColor: "rgba(0,0,0,0.6)",
    },
    {
      id: "cta",
      text: "",
      fontSize: 36,
      fontWeight: "bold",
      color: "#FFFFFF",
      align: "center",
      x: 50,
      y: 85,
      shadow: true,
      shadowColor: "rgba(0,0,0,0.7)",
    },
  ]);

  const [selectedLayer, setSelectedLayer] = useState<string>("title");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // tRPC mutation
  const generateMutation = trpc.imageGen.generateBackground.useMutation({
    onSuccess: (data) => {
      setGeneratedImage(data.imageBase64);
      setUsedModel(data.usedModel);
      toast.success(
        data.usedModel === "imagen3"
          ? "✨ 已用 Imagen 3 生成背景圖！"
          : "✨ 已用 Gemini 生成背景圖！"
      );
    },
    onError: (err) => {
      toast.error(`生成失敗：${err.message}`);
    },
  });

  // ── Canvas 渲染 ──────────────────────────────────────────────────────────

  const renderCanvas = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const size = CANVAS_SIZES[imageType];
    const scale = 0.4; // 預覽縮放比例
    canvas.width = size.w * scale;
    canvas.height = size.h * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清空
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 繪製背景圖
    if (generatedImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        renderTextLayers(ctx, canvas.width, canvas.height, scale);
      };
      img.src = generatedImage;
    } else {
      // 無背景時顯示佔位符
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#1a1a2e");
      gradient.addColorStop(1, "#16213e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.font = `${16 * scale}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("點擊「生成 AI 背景」開始", canvas.width / 2, canvas.height / 2);

      renderTextLayers(ctx, canvas.width, canvas.height, scale);
    }
  }, [generatedImage, textLayers, imageType]);

  function renderTextLayers(
    ctx: CanvasRenderingContext2D,
    canvasW: number,
    canvasH: number,
    scale: number
  ) {
    textLayers.forEach((layer) => {
      if (!layer.text.trim()) return;

      const x = (layer.x / 100) * canvasW;
      const y = (layer.y / 100) * canvasH;
      const fontSize = layer.fontSize * scale;

      ctx.font = `${layer.fontWeight} ${fontSize}px "Noto Sans TC", "PingFang TC", sans-serif`;
      ctx.textAlign = layer.align;
      ctx.textBaseline = "middle";

      // 陰影
      if (layer.shadow) {
        ctx.shadowColor = layer.shadowColor;
        ctx.shadowBlur = 8 * scale;
        ctx.shadowOffsetX = 2 * scale;
        ctx.shadowOffsetY = 2 * scale;
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      ctx.fillStyle = layer.color;
      ctx.fillText(layer.text, x, y);
    });

    // 重置陰影
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // ── 下載合成圖 ──────────────────────────────────────────────────────────

  const downloadComposite = () => {
    if (!generatedImage) {
      toast.error("請先生成 AI 背景圖");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = CANVAS_SIZES[imageType];
    canvas.width = size.w;
    canvas.height = size.h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size.w, size.h);
      renderTextLayers(ctx, size.w, size.h, 1);

      const link = document.createElement("a");
      link.download = `酸小七_素材_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
      toast.success("已下載合成圖！");
    };
    img.src = generatedImage;
  };

  // ── 文字圖層操作 ─────────────────────────────────────────────────────────

  const updateLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const activeLayer = textLayers.find((l) => l.id === selectedLayer) ?? textLayers[0];

  // ── 渲染 ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
        {/* 頁面標題 */}
        <div className="border-b border-border bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-6 py-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white shadow-md">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">圖片素材生成</h1>
            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full border border-violet-200">
              AI 生成
            </span>
          </div>
          <p className="text-sm text-muted-foreground ml-12">
            AI 生成純視覺背景，前端疊加文字，輸出完美合成圖
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-0 h-[calc(100vh-120px)]">
          {/* ── 左側設定面板 ── */}
          <div className="lg:w-[380px] flex-shrink-0 overflow-y-auto border-r border-border bg-card">
            <div className="p-5 space-y-6">

              {/* 圖片類型 */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  📐 圖片類型
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {IMAGE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setImageType(t.value as typeof imageType)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        imageType === t.value
                          ? "border-violet-500 bg-violet-50"
                          : "border-border hover:border-violet-200 hover:bg-violet-50/50"
                      }`}
                    >
                      <div className="text-xl mb-1">{t.icon}</div>
                      <div className="text-xs font-semibold text-foreground">{t.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 視覺風格 */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-3 block">
                  🎨 視覺風格
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value as typeof style)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        style === s.value
                          ? `border-2 ${s.color} border-opacity-80`
                          : "border-border hover:border-violet-200"
                      } ${style === s.value ? s.color : ""}`}
                    >
                      <div className="text-xs font-semibold">{s.label}</div>
                      <div className="text-[10px] opacity-70 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 主題描述 */}
              <div>
                <Label className="text-sm font-semibold text-foreground mb-2 block">
                  🍜 主題描述（可選）
                </Label>
                <Textarea
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="描述你想要的畫面主題，例如：酸菜魚湯鍋、熱騰騰的蒸氣、新鮮食材..."
                  className="text-sm resize-none h-20"
                  maxLength={200}
                />
                <p className="text-[10px] text-muted-foreground mt-1 text-right">
                  {subject.length}/200
                </p>
              </div>

              {/* 生成按鈕 */}
              <Button
                onClick={() => generateMutation.mutate({ imageType, style, subject })}
                disabled={generateMutation.isPending}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-lg"
              >
                {generateMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    AI 生成中...（約 15-30 秒）
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    生成 AI 背景
                  </>
                )}
              </Button>

              {usedModel && (
                <p className="text-xs text-center text-muted-foreground">
                  {usedModel === "imagen3" ? "✨ 使用 Imagen 3 生成" : "✨ 使用 Gemini 生成"}
                </p>
              )}

              {/* 文字圖層設定 */}
              <div className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowTextPanel(!showTextPanel)}
                  className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-violet-600" />
                    <span className="text-sm font-semibold text-foreground">文字設定</span>
                    <span className="text-xs text-muted-foreground">（前端疊加，100% 正確）</span>
                  </div>
                  {showTextPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showTextPanel && (
                  <div className="p-4 space-y-4">
                    {/* 圖層選擇 */}
                    <div className="flex gap-2">
                      {textLayers.map((layer) => (
                        <button
                          key={layer.id}
                          onClick={() => setSelectedLayer(layer.id)}
                          className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-all ${
                            selectedLayer === layer.id
                              ? "border-violet-500 bg-violet-50 text-violet-700"
                              : "border-border text-muted-foreground hover:border-violet-200"
                          }`}
                        >
                          {layer.id === "title" ? "標題" : layer.id === "subtitle" ? "副標題" : "CTA"}
                        </button>
                      ))}
                    </div>

                    {activeLayer && (
                      <div className="space-y-3">
                        {/* 文字內容 */}
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">文字內容</Label>
                          <Input
                            value={activeLayer.text}
                            onChange={(e) => updateLayer(activeLayer.id, { text: e.target.value })}
                            placeholder={
                              activeLayer.id === "title" ? "標題文字" :
                              activeLayer.id === "subtitle" ? "副標題文字" : "行動呼籲文字（可留空）"
                            }
                            className="text-sm"
                          />
                        </div>

                        {/* 字體大小 */}
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">
                            字體大小：{activeLayer.fontSize}px
                          </Label>
                          <input
                            type="range"
                            min={20}
                            max={120}
                            value={activeLayer.fontSize}
                            onChange={(e) => updateLayer(activeLayer.id, { fontSize: Number(e.target.value) })}
                            className="w-full accent-violet-600"
                          />
                        </div>

                        {/* 位置 Y */}
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">
                            垂直位置：{activeLayer.y}%
                          </Label>
                          <input
                            type="range"
                            min={5}
                            max={95}
                            value={activeLayer.y}
                            onChange={(e) => updateLayer(activeLayer.id, { y: Number(e.target.value) })}
                            className="w-full accent-violet-600"
                          />
                        </div>

                        {/* 顏色選擇 */}
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">文字顏色</Label>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {PRESET_COLORS.map((c) => (
                              <button
                                key={c}
                                onClick={() => updateLayer(activeLayer.id, { color: c })}
                                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                                  activeLayer.color === c ? "border-violet-500 scale-110" : "border-gray-300"
                                }`}
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-muted-foreground" />
                            <input
                              type="color"
                              value={activeLayer.color}
                              onChange={(e) => updateLayer(activeLayer.id, { color: e.target.value })}
                              className="w-8 h-8 rounded cursor-pointer border border-border"
                            />
                            <span className="text-xs text-muted-foreground">{activeLayer.color}</span>
                          </div>
                        </div>

                        {/* 對齊方式 */}
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">對齊方式</Label>
                          <div className="flex gap-1">
                            {(["left", "center", "right"] as const).map((align) => {
                              const Icon = align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
                              return (
                                <button
                                  key={align}
                                  onClick={() => updateLayer(activeLayer.id, { align })}
                                  className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center transition-all ${
                                    activeLayer.align === align
                                      ? "border-violet-500 bg-violet-50 text-violet-700"
                                      : "border-border text-muted-foreground hover:border-violet-200"
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 粗體 & 陰影 */}
                        <div className="flex gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={activeLayer.fontWeight === "bold"}
                              onChange={(e) => updateLayer(activeLayer.id, { fontWeight: e.target.checked ? "bold" : "normal" })}
                              className="accent-violet-600"
                            />
                            <span className="text-xs text-foreground">粗體</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={activeLayer.shadow}
                              onChange={(e) => updateLayer(activeLayer.id, { shadow: e.target.checked })}
                              className="accent-violet-600"
                            />
                            <span className="text-xs text-foreground">文字陰影</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── 右側預覽區 ── */}
          <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto bg-muted/30 p-6">
            <div className="w-full max-w-lg">
              {/* 預覽標題 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-violet-600" />
                  <span className="text-sm font-semibold text-foreground">合成預覽</span>
                  <span className="text-xs text-muted-foreground">（AI 背景 + 程式渲染文字）</span>
                </div>
                <Button
                  onClick={downloadComposite}
                  disabled={!generatedImage}
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
                >
                  <Download className="w-4 h-4" />
                  下載合成圖
                </Button>
              </div>

              {/* Canvas 預覽 */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-black">
                <canvas
                  ref={previewCanvasRef}
                  className="w-full h-auto block"
                  style={{
                    aspectRatio: imageType === "story" ? "9/16" : imageType === "poster" ? "4/5" : "1/1",
                  }}
                />

                {generateMutation.isPending && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-violet-400" />
                    </div>
                    <p className="text-white text-sm mt-4 font-medium">AI 正在生成背景圖...</p>
                    <p className="text-white/60 text-xs mt-1">約需 15-30 秒</p>
                  </div>
                )}
              </div>

              {/* 說明 */}
              <div className="mt-4 p-4 bg-violet-50 rounded-xl border border-violet-100">
                <div className="flex items-start gap-2">
                  <div className="text-violet-600 mt-0.5">ℹ️</div>
                  <div className="text-xs text-violet-700 space-y-1">
                    <p className="font-semibold">設計說明</p>
                    <p>AI 只生成純視覺背景（無文字），文字由程式精確渲染，確保品牌名稱、活動名稱、價格等文字 100% 正確。</p>
                    <p>下載的合成圖為完整解析度（{CANVAS_SIZES[imageType].w} × {CANVAS_SIZES[imageType].h} px）。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 隱藏的高解析度 Canvas（用於下載） */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
  );
}
