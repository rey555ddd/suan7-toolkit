# 酸小七小編工具箱 — 待辦事項

## 已完成
- [x] 品牌資料結構化 (brandData.ts)
- [x] AI 文案生成器 (aiGenerator.ts)
- [x] 首頁 Home
- [x] 小編助手 PostGenerator
- [x] 貼文模板庫 TemplateLibrary
- [x] 行事曆排程 CalendarPlanner
- [x] 活動企劃精靈 EventWizard
- [x] 素材方向生成 AssetGuide
- [x] 競品參考牆 CompetitorWall
- [x] 發文檢查清單 PostChecker
- [x] AppLayout 側邊欄
- [x] TypeScript 零錯誤

## 新增功能（2025-04-10）
- [x] 新增 suggestions 資料表到 drizzle schema
- [x] 建立 suggestions tRPC router（新增/讀取建議）
- [x] 建立修改建議區頁面（/feedback）
- [x] 整合到首頁工具卡片和側邊欄導航
- [x] 視覺強調設計（紫色/藍紫色系，與其他功能區分）
- [x] 修復 Home.tsx 升級後的衝突（保留原有設計）
- [x] 修復 NotFound.tsx 升級後的衝突（保留中文版本）
- [x] 執行 pnpm db:push 同步資料庫
- [x] 部署為 public

## 待修復
- [x] 首頁 Hero 區域 Logo 顯示正常，但需確認白色背景下的品牌色調性
- [x] 確認所有內頁側邊欄導航正常運作
- [x] 手機版響應式測試
- [x] 儲存 checkpoint 並部署

## 圖片素材生成功能（2025-04-10）
- [x] 後端：建立 imageGenRouter.ts（Imagen 3 + Gemini fallback）
- [x] 後端：整合到 routers.ts
- [x] 前端：建立 ImageCreator.tsx 頁面（選項 + Canvas 文字疊加 + 合成輸出）
- [x] 前端：整合到 App.tsx 路由
- [x] 側邊欄：新增圖片素材生成入口
- [x] TypeScript 零錯誤確認
- [x] 儲存 checkpoint 並部署 public
