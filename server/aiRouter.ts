import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeGemini, invokeGeminiJSON } from "./gemini";

// ── 品牌背景資料（供 Prompt 使用）──────────────────────────────────────────
const BRAND_CONTEXT = `
你是酸小七（SUAN TANG YU）的社群小編 AI 助手。

【品牌資訊】
- 品牌名稱：酸小七｜酸湯魚
- 品牌定位：正宗道地、職人好味的酸菜魚品牌，來自四川的道地風味
- 品牌口號：正宗道地・職人好味
- 特色：開放式廚房、現點現做、每週六川劇變臉表演（南屯旗艦店 20:00、西屯河南店 19:00）
- 集點卡活動：消費滿500元=1點，3點換飲料、6點換炸物、12點換湯鍋
- 社群帳號：FB/IG 搜尋「酸小七」

【菜單精選】
湯鍋系列：
- 霸王酸菜魚 $380（招牌，份量超大）
- 酸菜魚 $280（經典款）
- 番茄魚 $280（酸甜口味）
- 麻辣酸菜魚 $320（嗜辣者首選）
- 清湯酸菜魚 $260（清爽版本）

炸物小菜：
- 炸酥魚 $80
- 麻辣毛豆 $60
- 涼拌黃瓜 $60
- 酸辣粉 $80

飲料甜點：
- 酸梅湯 $50
- 手工豆花 $60
- 冰淇淋 $50

【門市資訊】
- 南屯旗艦店：台中市南屯區文心路一段 504 號（週六有川劇變臉）
- 西屯河南店：台中市西屯區河南路二段 262 號（週六有川劇變臉）
- 桃園中正店：桃園市桃園區中正路 1198 號

【品牌調性】
活潑、年輕、有個性、接地氣、帶點川味江湖感。文案要有溫度、有個性，不要太制式。
`;

// ── 貼文生成 ──────────────────────────────────────────────────────────────
export const aiRouter = router({
  generatePost: publicProcedure
    .input(
      z.object({
        postType: z.enum([
          "new_product", "promotion", "daily", "festival",
          "review", "behind_scenes", "event", "limited_offer",
        ]),
        platform: z.enum(["facebook", "instagram"]),
        customInput: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const platformGuide =
        input.platform === "instagram"
          ? "Instagram 貼文：文案精簡有力（150-300字），段落清晰，結尾加 15-20 個相關 Hashtag（含 #酸小七 #酸湯魚 #台中美食 等）"
          : "Facebook 貼文：文案豐富有溫度（200-500字），可以多一點故事感，結尾加 5-8 個 Hashtag（含 #酸小七）";

      const postTypeGuide: Record<string, string> = {
        new_product: "新品推薦：介紹新菜色，強調特色和口感，製造嚐鮮慾望",
        promotion: "活動宣傳：宣傳優惠或集點活動，製造行動誘因",
        daily: "日常互動：輕鬆問答或生活感內容，提升粉絲參與度",
        festival: "節慶祝福：結合台灣節慶，融入品牌元素",
        review: "顧客好評：分享顧客評價，建立口碑信任",
        behind_scenes: "幕後花絮：展示廚房實況或食材故事，建立品牌透明度",
        event: "活動宣傳：宣傳每週六川劇變臉表演或特別活動",
        limited_offer: "限時優惠：製造緊迫感，刺激即時消費",
      };

      const systemPrompt = `${BRAND_CONTEXT}

你是專業的社群小編，請根據以下要求生成一篇貼文。
回傳 JSON 格式：
{
  "content": "完整貼文內容（含 Emoji、換行、Hashtag）",
  "hashtags": ["#tag1", "#tag2", ...],
  "suggestedImage": "建議搭配的圖片/影片方向（一句話描述）",
  "suggestedTime": "建議發文時間（例如：11:30 午餐前、17:00 下班前）"
}`;

      const userPrompt = `貼文類型：${postTypeGuide[input.postType]}
平台：${platformGuide}
${input.customInput ? `補充需求：${input.customInput}` : ""}

請生成一篇符合酸小七品牌調性的貼文。`;

      const result = await invokeGeminiJSON<{
        content: string;
        hashtags: string[];
        suggestedImage: string;
        suggestedTime: string;
      }>(systemPrompt, userPrompt);

      return result;
    }),

  // ── 月度行事曆生成 ────────────────────────────────────────────────────────
  generateCalendar: publicProcedure
    .input(
      z.object({
        year: z.number().int().min(2024).max(2030),
        month: z.number().int().min(1).max(12),
        postsPerWeek: z.number().int().min(2).max(7).default(4),
      })
    )
    .mutation(async ({ input }) => {
      const systemPrompt = `${BRAND_CONTEXT}

你是專業的社群行銷顧問，請為酸小七規劃一個月的社群發文行事曆。
回傳 JSON 格式（陣列）：
[
  {
    "date": "YYYY/MM/DD",
    "day": 1,
    "weekday": "週一",
    "time": "11:30",
    "platform": "facebook 或 instagram",
    "postType": "new_product/promotion/daily/festival/review/behind_scenes/event/limited_offer",
    "topic": "這篇貼文的主題標題",
    "brief": "文案方向說明（2-3句）",
    "imageDirection": "建議搭配的視覺素材方向"
  },
  ...
]
注意：
- 每週安排 ${input.postsPerWeek} 篇
- 優先選週二、四、六、日發文
- 結合台灣節慶（如有）
- 每週六安排川劇變臉活動宣傳
- 平台輪替（FB/IG 交替）
- 貼文類型多樣化，不要重複`;

      const userPrompt = `請規劃 ${input.year} 年 ${input.month} 月的社群發文行事曆，每週 ${input.postsPerWeek} 篇。`;

      const result = await invokeGeminiJSON<Array<{
        date: string;
        day: number;
        weekday: string;
        time: string;
        platform: string;
        postType: string;
        topic: string;
        brief: string;
        imageDirection: string;
      }>>(systemPrompt, userPrompt);

      return result;
    }),

  // ── 活動企劃生成 ──────────────────────────────────────────────────────────
  generateEventPlan: publicProcedure
    .input(
      z.object({
        eventType: z.string(),
        goal: z.string(),
        budget: z.string(),
        duration: z.string(),
        customNotes: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const systemPrompt = `${BRAND_CONTEXT}

你是專業的品牌行銷顧問，請為酸小七規劃一個完整的活動企劃案。
回傳 JSON 格式：
{
  "title": "企劃案標題",
  "objective": "活動目標說明",
  "duration": "活動期間",
  "budget": "預算規劃建議",
  "phases": [
    {
      "phase": "階段名稱",
      "tasks": ["任務1", "任務2", ...],
      "timeline": "時間說明"
    }
  ],
  "socialPlan": [
    {
      "platform": "平台名稱",
      "content": "內容方向",
      "frequency": "發文頻率"
    }
  ],
  "kpis": ["KPI指標1", "KPI指標2", ...],
  "materials": ["素材需求1", "素材需求2", ...]
}`;

      const eventTypeNames: Record<string, string> = {
        new_store: "新店開幕慶",
        seasonal: "季節限定活動",
        holiday: "節慶特別企劃",
        collab: "異業合作活動",
        loyalty: "會員回饋活動",
        social_campaign: "社群互動活動",
        tasting: "新品試吃會",
        performance: "川劇變臉特別場",
      };

      const goalNames: Record<string, string> = {
        new_customer: "吸引新客",
        retention: "提升回購",
        awareness: "擴大曝光",
        engagement: "提升互動",
        sales: "衝刺業績",
      };

      const userPrompt = `活動類型：${eventTypeNames[input.eventType] || input.eventType}
活動目標：${goalNames[input.goal] || input.goal}
預算規模：${input.budget}
活動期間：${input.duration}
${input.customNotes ? `特別需求：${input.customNotes}` : ""}

請生成一份完整的活動企劃案，要具體可執行，符合酸小七的品牌調性。`;

      const result = await invokeGeminiJSON<{
        title: string;
        objective: string;
        duration: string;
        budget: string;
        phases: Array<{ phase: string; tasks: string[]; timeline: string }>;
        socialPlan: Array<{ platform: string; content: string; frequency: string }>;
        kpis: string[];
        materials: string[];
      }>(systemPrompt, userPrompt);

      return result;
    }),

  // ── 素材方向生成 ──────────────────────────────────────────────────────────
  generateAssets: publicProcedure
    .input(
      z.object({
        postType: z.string(),
        customContext: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const systemPrompt = `${BRAND_CONTEXT}

你是專業的視覺創意總監，請為酸小七的社群貼文提供具體的素材方向建議。
回傳 JSON 格式（陣列，3-5個建議）：
[
  {
    "type": "photo/video/graphic/story",
    "title": "素材標題",
    "description": "詳細描述這個素材要呈現什麼",
    "specs": "規格要求（尺寸、時長等）",
    "tips": ["拍攝/製作技巧1", "技巧2"],
    "colorScheme": "建議色調",
    "composition": "構圖建議"
  }
]`;

      const userPrompt = `貼文類型：${input.postType}
${input.customContext ? `補充說明：${input.customContext}` : ""}

請提供 4 個具體的視覺素材方向建議，要符合酸小七的品牌調性和餐飲業的視覺美感。`;

      const result = await invokeGeminiJSON<Array<{
        type: string;
        title: string;
        description: string;
        specs: string;
        tips: string[];
        colorScheme: string;
        composition: string;
      }>>(systemPrompt, userPrompt);

      return result;
    }),

  // ── 發文品質檢查（AI 增強版）────────────────────────────────────────────
  checkPostAI: publicProcedure
    .input(
      z.object({
        content: z.string().min(10).max(3000),
        platform: z.enum(["facebook", "instagram"]),
      })
    )
    .mutation(async ({ input }) => {
      const systemPrompt = `${BRAND_CONTEXT}

你是社群行銷專家，請分析這篇貼文的品質並給出改善建議。
回傳 JSON 格式：
{
  "score": 85,
  "summary": "整體評語（1-2句）",
  "checks": [
    {
      "id": "cta",
      "passed": true,
      "label": "包含明確的 CTA",
      "description": "說明",
      "severity": "error/warning/info"
    }
  ],
  "improvements": ["改善建議1", "改善建議2", ...],
  "improvedContent": "改善後的完整文案（可選，如果有明顯改善空間）"
}

檢查項目：CTA、Hashtag數量、品牌標籤、文案長度、Emoji使用、段落排版、品牌調性、平台適配性`;

      const userPrompt = `平台：${input.platform === "facebook" ? "Facebook" : "Instagram"}
貼文內容：
${input.content}

請分析這篇貼文的品質，給出評分（0-100）和具體改善建議。`;

      const result = await invokeGeminiJSON<{
        score: number;
        summary: string;
        checks: Array<{
          id: string;
          passed: boolean;
          label: string;
          description: string;
          severity: "error" | "warning" | "info";
        }>;
        improvements: string[];
        improvedContent?: string;
      }>(systemPrompt, userPrompt);

      return result;
    }),
});
