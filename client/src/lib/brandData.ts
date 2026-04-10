// 酸小七品牌資料庫 — 結構化數據
// Design: 川味江湖水墨潮流風

export const BRAND = {
  name: '酸小七',
  fullName: '酸小七｜酸湯魚',
  english: 'Suan Tang Yu',
  slogan: '正宗道地・酸爽夠味',
  founded: 2016,
  origin: '源自雲貴地區傳統美食',
  description: '酸小七創立於2016年，專注酸菜魚快餐領域。品牌採用傳統發酵工藝，精選優質魚片，以獨特的酸辣鮮香口味迅速走紅，已發展成為世界級的特許經營品牌。',
  features: [
    '明檔操作，新鮮看得見',
    '開放式廚房，顧客吃得放心',
    '綠色主題裝修，時尚又舒適',
    '酸爽開胃、麻中帶辣的多層次風味',
    '創新手法詮釋經典川味',
    '全天營業模式',
    '標準化培訓體系',
    '全國冷鏈物流，食材新鮮有保障',
  ],
  social: {
    facebook: 'https://www.facebook.com/suanxiaoqi.TW/',
    instagram: 'https://www.instagram.com/suanxiaoqi_tw/',
    threads: 'https://www.threads.com/@suanxiaoqi_tw',
    website: 'https://suanxiaoqi.tw/',
  },
  activities: [
    '酸聖節',
    '酸爽對決活動',
    '集點卡活動（滿500元=1點）',
    '川劇變臉表演（每週六）',
  ],
  logoUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663032574653/D5ehzuf7EutQ28QkNh4Nrh/suanxiaoqi_hero_logo_3688c8ee.webp',
  logoSmallUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663032574653/D5ehzuf7EutQ28QkNh4Nrh/suanxiaoqi_logo_header_778b4f4e.webp',
};

export interface MenuItem {
  name: string;
  price: number;
  category: string;
  spicy?: number;
  sour?: number;
  description?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export const MENU: MenuItem[] = [
  // 湯鍋系列
  { name: '霸王酸菜魚', price: 768, category: '湯鍋系列', spicy: 3, sour: 3, description: '招牌！傳統川味，份量適合1~2人，酸中帶辣', isPopular: true },
  { name: '金湯酸菜魚', price: 435, category: '湯鍋系列', spicy: 1, sour: 2, description: '鮮香濃郁金黃酸爽，內含魚片、黃豆芽、金針菇、腐皮、娃娃菜、寬冬粉、豬肉片' },
  { name: '番茄酸湯魚', price: 435, category: '湯鍋系列', spicy: 0, sour: 0, description: '少女心番茄，甜中帶酸，酸甜可口' },
  { name: '椒香麻辣魚', price: 386, category: '湯鍋系列', spicy: 3, sour: 0, description: '麻辣爽口，激起味蕾的波濤' },
  { name: '檸檬青花椒魚', price: 386, category: '湯鍋系列', description: '檸檬與青花椒的清新組合' },
  { name: '貴妃花膠魚', price: 560, category: '湯鍋系列', spicy: 0, sour: 0, description: '中藥提香，味道濃郁清甜，含紅棗、枸杞、蟲草花' },
  { name: '乾鍋魚', price: 460, category: '湯鍋系列', spicy: 5, sour: 0, description: '含牛油，乾炒類型，獨門數十種辛香料' },
  // 炸物小菜
  { name: '酥肉條', price: 125, category: '炸物小菜', description: '以豬肉為主要原料，風味獨特，微辣口感' },
  { name: '香酥雞', price: 86, category: '炸物小菜', description: '外酥內嫩，金黃酥脆' },
  { name: '蒜味鳳爪', price: 111, category: '炸物小菜', description: '搭配蒜香調料，口感獨特' },
  { name: '十三香小龍蝦', price: 255, category: '炸物小菜' },
  { name: '酥炸魚皮', price: 100, category: '炸物小菜' },
  { name: '白飯', price: 25, category: '炸物小菜' },
  // 飲料甜點
  { name: '金香小七特調', price: 89, category: '飲料甜點', description: '水果風味茶（含楊桃）' },
  { name: '一杯奶茶', price: 85, category: '飲料甜點' },
  { name: '梅子可樂', price: 60, category: '飲料甜點' },
  { name: '雪碧', price: 60, category: '飲料甜點' },
  { name: '氣泡雪梨汁', price: 60, category: '飲料甜點' },
  // 新品
  { name: '酸小七拌麵（老罈酸香）', price: 49, category: '新品', description: '銅板價拌麵', isNew: true },
];

export const STORES = [
  { name: '南屯旗艦店', address: '台中市南屯區五權西路二段518-1號', phone: '04-2389-3909', hours: '全天營業', special: '川劇變臉（週六 20:00）' },
  { name: '西屯河南店', address: '台中市西屯區河南路二段443號', phone: '04-2452-7009', hours: '全天營業', special: '川劇變臉（週六 19:00）' },
  { name: '桃園中正店', address: '桃園市桃園區中正路708-7號', phone: '', hours: '週一至五 17:00-23:59，週六日 12:00-23:59', special: '' },
];

// 貼文模板類型
export type PostType = 'new_product' | 'promotion' | 'daily' | 'festival' | 'review' | 'behind_scenes' | 'event' | 'limited_offer';

export const POST_TYPES: { value: PostType; label: string; icon: string; description: string }[] = [
  { value: 'new_product', label: '新品推薦', icon: '🆕', description: '推廣新菜色或新品項' },
  { value: 'promotion', label: '活動宣傳', icon: '📣', description: '品牌活動、節慶促銷' },
  { value: 'daily', label: '日常互動', icon: '💬', description: '與粉絲互動、問答' },
  { value: 'festival', label: '節慶祝福', icon: '🎊', description: '各大節日祝福貼文' },
  { value: 'review', label: '顧客好評', icon: '⭐', description: '分享顧客評價和推薦' },
  { value: 'behind_scenes', label: '幕後花絮', icon: '🎬', description: '廚房幕後、團隊日常' },
  { value: 'event', label: '門市活動', icon: '🎪', description: '川劇變臉、酸聖節等' },
  { value: 'limited_offer', label: '限時優惠', icon: '⏰', description: '限時折扣、快閃活動' },
];

export type Platform = 'facebook' | 'instagram';

export const PLATFORMS: { value: Platform; label: string; maxLength: number; hashtagCount: number }[] = [
  { value: 'facebook', label: 'Facebook', maxLength: 500, hashtagCount: 5 },
  { value: 'instagram', label: 'Instagram', maxLength: 300, hashtagCount: 15 },
];

// 預設 Hashtag 庫
export const HASHTAGS = {
  brand: ['#酸小七', '#酸湯魚', '#SuanTangYu', '#酸菜魚', '#正宗道地酸爽夠味'],
  food: ['#美食推薦', '#台中美食', '#桃園美食', '#酸菜魚推薦', '#魚料理', '#川菜', '#麻辣', '#酸爽'],
  mood: ['#吃貨日常', '#今天吃什麼', '#美食控', '#foodie', '#yummy', '#好吃到哭'],
  event: ['#酸聖節', '#川劇變臉', '#集點活動', '#限時優惠', '#新品上市'],
  location: ['#台中美食地圖', '#桃園美食地圖', '#南屯美食', '#西屯美食'],
};

// 最佳發文時段
export const BEST_POST_TIMES = [
  { time: '11:30', label: '午餐前', reason: '上班族開始想午餐，觸及率最高' },
  { time: '17:00', label: '晚餐前', reason: '下班前開始規劃晚餐，決策黃金期' },
  { time: '12:30', label: '午休時段', reason: '滑手機高峰，互動率佳' },
  { time: '20:00', label: '晚間休閒', reason: '飯後放鬆時間，適合品牌故事類內容' },
  { time: '09:00', label: '早晨通勤', reason: '通勤滑手機，適合輕鬆互動貼文' },
];

// 貼文模板庫
export interface PostTemplate {
  id: string;
  type: PostType;
  title: string;
  template: string;
  variables: string[];
  suggestedImage: string;
  platform: Platform | 'both';
}

export const POST_TEMPLATES: PostTemplate[] = [
  {
    id: 'np1',
    type: 'new_product',
    title: '新品上市公告',
    template: `【新品登場】{product_name} 強勢來襲！🔥

{product_description}

💰 嚐鮮價只要 ${'{price}'} 元
📍 全台門市同步開賣

還在等什麼？快揪朋友一起來嚐鮮！
{extra_message}

#酸小七 #新品上市 #酸湯魚`,
    variables: ['product_name', 'product_description', 'price', 'extra_message'],
    suggestedImage: '建議拍攝：新品特寫照，搭配熱氣騰騰的畫面，背景用品牌綠色調',
    platform: 'both',
  },
  {
    id: 'np2',
    type: 'new_product',
    title: '新品試吃邀請',
    template: `🐟 酸小七又有新花樣啦！

全新 {product_name} 正式亮相 ✨
{product_highlight}

前100位到店消費的朋友
還有機會獲得{gift}！

📅 {date} 起，各門市同步供應
別說我沒告訴你喔～

#酸小七 #限量嚐鮮 #酸菜魚`,
    variables: ['product_name', 'product_highlight', 'gift', 'date'],
    suggestedImage: '建議拍攝：新品俯拍照，搭配精美擺盤，加入食材特寫鏡頭',
    platform: 'both',
  },
  {
    id: 'promo1',
    type: 'promotion',
    title: '集點活動推廣',
    template: `🎯 酸小七集點卡霸氣登場！

消費滿500元 = 1點
✅ 3點 → 免費飲料一杯
✅ 6點 → 炸物小菜任選
✅ 12點 → {top_reward}

{extra_info}

快來開始你的集點之旅吧！💪
📍 全台門市適用

#酸小七 #集點活動 #吃越多送越多`,
    variables: ['top_reward', 'extra_info'],
    suggestedImage: '建議拍攝：集點卡實物照，搭配獎品排列，營造豐富感',
    platform: 'facebook',
  },
  {
    id: 'promo2',
    type: 'promotion',
    title: '限時折扣活動',
    template: `⚡ 限時快閃！{discount_info}

📅 活動期間：{date_range}
📍 適用門市：{stores}

{conditions}

手刀衝一波！錯過再等一年 😱

#酸小七 #限時優惠 #快閃活動`,
    variables: ['discount_info', 'date_range', 'stores', 'conditions'],
    suggestedImage: '建議製作：醒目的折扣數字視覺，紅底金字，搭配品牌元素',
    platform: 'both',
  },
  {
    id: 'daily1',
    type: 'daily',
    title: '美食問答互動',
    template: `🤔 來投票！你是哪一派？

A. {option_a}
B. {option_b}
C. {option_c}

留言告訴小七你的答案！
答對的人...嗯...小七給你一個讚 😏

{fun_fact}

#酸小七 #你選哪個 #美食投票`,
    variables: ['option_a', 'option_b', 'option_c', 'fun_fact'],
    suggestedImage: '建議製作：三選一的投票圖卡，每個選項搭配對應菜色照片',
    platform: 'facebook',
  },
  {
    id: 'daily2',
    type: 'daily',
    title: '今日推薦',
    template: `今天的你，需要一碗 {dish_name} 🐟

{mood_description}

來酸小七，讓酸爽治癒你的{mood}！

📍 {store_info}
⏰ 營業中，等你來～

#酸小七 #今天吃什麼 #酸湯魚`,
    variables: ['dish_name', 'mood_description', 'mood', 'store_info'],
    suggestedImage: '建議拍攝：該菜色的美食照，搭配溫暖的用餐環境',
    platform: 'instagram',
  },
  {
    id: 'fest1',
    type: 'festival',
    title: '節慶祝福通用',
    template: `🎉 {festival_name}快樂！

{greeting_message}

酸小七在這個特別的日子
準備了{special_offer}
陪你一起{celebration_action}！

📅 活動期間：{date_range}
📍 全台門市歡迎你

{closing_message}

#酸小七 #{festival_hashtag} #酸湯魚`,
    variables: ['festival_name', 'greeting_message', 'special_offer', 'celebration_action', 'date_range', 'closing_message', 'festival_hashtag'],
    suggestedImage: '建議製作：節慶主題視覺，融入品牌元素和節日裝飾',
    platform: 'both',
  },
  {
    id: 'review1',
    type: 'review',
    title: '顧客好評分享',
    template: `💬 來自顧客的真心話：

「{review_quote}」
—— {reviewer_name}

謝謝每一位支持酸小七的你們 ❤️
{response_message}

你也有想分享的用餐體驗嗎？
歡迎留言或私訊告訴我們！

#酸小七 #顧客好評 #真心推薦`,
    variables: ['review_quote', 'reviewer_name', 'response_message'],
    suggestedImage: '建議使用：顧客授權的用餐照片，或店內歡樂用餐氛圍照',
    platform: 'both',
  },
  {
    id: 'bts1',
    type: 'behind_scenes',
    title: '廚房幕後直擊',
    template: `👨‍🍳 酸小七廚房直擊！

{behind_story}

每一碗酸湯魚的背後
都是師傅們{effort_description}

{fun_detail}

明檔操作，新鮮看得見 👀
下次來店裡記得看看我們的廚房喔！

#酸小七 #幕後花絮 #明檔操作`,
    variables: ['behind_story', 'effort_description', 'fun_detail'],
    suggestedImage: '建議拍攝：廚師備料過程、食材特寫、開放式廚房全景',
    platform: 'instagram',
  },
  {
    id: 'event1',
    type: 'event',
    title: '川劇變臉表演',
    template: `🎭 本週六，川劇變臉來啦！

{event_description}

📅 時間：{date}
🏪 南屯旗艦店 20:00
🏪 西屯河南店 19:00

{extra_info}

邊吃酸湯魚邊看變臉表演
這種體驗只有酸小七有！😎

免費觀賞，歡迎闔家光臨 🎊

#酸小七 #川劇變臉 #週六限定`,
    variables: ['event_description', 'date', 'extra_info'],
    suggestedImage: '建議拍攝：川劇變臉表演精彩瞬間，或表演者與觀眾互動畫面',
    platform: 'both',
  },
  {
    id: 'lo1',
    type: 'limited_offer',
    title: '快閃優惠',
    template: `🔥 快閃 {hours} 小時！

{offer_detail}

⏰ 限時：{time_range}
📍 門市：{stores}
⚠️ {conditions}

數量有限，搶完就沒了！
趕快 tag 你的吃貨朋友 👇

#酸小七 #限時快閃 #手刀搶購`,
    variables: ['hours', 'offer_detail', 'time_range', 'stores', 'conditions'],
    suggestedImage: '建議製作：倒數計時風格視覺，大字體顯示優惠內容，紅色緊迫感',
    platform: 'both',
  },
];

// 活動企劃類型
export const EVENT_TYPES = [
  { value: 'new_store', label: '新店開幕', icon: '🏪' },
  { value: 'seasonal', label: '季節限定', icon: '🌸' },
  { value: 'holiday', label: '節慶活動', icon: '🎊' },
  { value: 'collab', label: '異業合作', icon: '🤝' },
  { value: 'loyalty', label: '會員回饋', icon: '💎' },
  { value: 'social_campaign', label: '社群活動', icon: '📱' },
  { value: 'tasting', label: '試吃活動', icon: '🍽️' },
  { value: 'performance', label: '表演活動', icon: '🎭' },
];

// 活動目標
export const EVENT_GOALS = [
  { value: 'new_customer', label: '拉新客', description: '吸引新顧客上門' },
  { value: 'retention', label: '提升回購', description: '讓老客人再次光臨' },
  { value: 'awareness', label: '品牌曝光', description: '提升品牌知名度' },
  { value: 'engagement', label: '粉絲互動', description: '增加社群互動率' },
  { value: 'sales', label: '衝業績', description: '直接提升營業額' },
];

// 預算範圍
export const BUDGET_RANGES = [
  { value: 'free', label: '零預算', range: '0元', suggestion: '善用自然觸及和粉絲互動' },
  { value: 'low', label: '小資方案', range: '1,000~5,000元', suggestion: '適合小型社群廣告投放' },
  { value: 'medium', label: '標準方案', range: '5,000~20,000元', suggestion: '可做FB/IG廣告+KOL合作' },
  { value: 'high', label: '大手筆', range: '20,000元以上', suggestion: '全方位行銷，含廣告+KOL+實體活動' },
];

// 競品資料
export const COMPETITORS = [
  {
    name: '魚你同在',
    type: '酸菜魚',
    style: '文青風格，強調食材產地',
    popularPosts: ['食材溯源系列', '主廚日記', '季節限定菜色發佈'],
    platforms: ['Facebook', 'Instagram'],
  },
  {
    name: '太二酸菜魚',
    type: '酸菜魚',
    style: '潮流個性，「太二」人設鮮明',
    popularPosts: ['二哥語錄', '超過四人不接待話題', '聯名周邊商品'],
    platforms: ['Facebook', 'Instagram', 'TikTok'],
  },
  {
    name: '撈王鍋物',
    type: '火鍋/湯鍋',
    style: '高端養生路線，豬肚雞主打',
    popularPosts: ['養生湯品知識', '食材科普', 'VIP會員活動'],
    platforms: ['Facebook', 'Instagram'],
  },
  {
    name: '海底撈',
    type: '火鍋',
    style: '服務至上，社群互動極強',
    popularPosts: ['隱藏吃法', '服務驚喜故事', 'DIY調料配方'],
    platforms: ['Facebook', 'Instagram', 'YouTube', 'TikTok'],
  },
  {
    name: '這一鍋',
    type: '火鍋',
    style: '古風中國風，視覺質感高',
    popularPosts: ['古風美食攝影', '節氣限定鍋物', '文化故事系列'],
    platforms: ['Facebook', 'Instagram'],
  },
];

// 發文檢查清單項目
export interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  description: string;
  platform: Platform | 'both';
  severity: 'error' | 'warning' | 'info';
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'cta', category: '行動呼籲', label: '包含明確的 CTA（行動呼籲）', description: '例如：留言、分享、到店消費、點擊連結等', platform: 'both', severity: 'error' },
  { id: 'hashtag_count_fb', category: 'Hashtag', label: 'Facebook Hashtag 數量 3~5 個', description: 'FB 不宜過多 hashtag，3-5個最佳', platform: 'facebook', severity: 'warning' },
  { id: 'hashtag_count_ig', category: 'Hashtag', label: 'Instagram Hashtag 數量 10~20 個', description: 'IG 可以多用 hashtag 增加曝光', platform: 'instagram', severity: 'warning' },
  { id: 'brand_hashtag', category: 'Hashtag', label: '包含品牌 Hashtag #酸小七', description: '每篇貼文都應包含品牌標籤', platform: 'both', severity: 'error' },
  { id: 'length_fb', category: '文案長度', label: 'Facebook 文案 150~500 字', description: 'FB 適合中長篇文案，但不宜過長', platform: 'facebook', severity: 'warning' },
  { id: 'length_ig', category: '文案長度', label: 'Instagram 文案 100~300 字', description: 'IG 文案簡潔有力，重點在前兩行', platform: 'instagram', severity: 'warning' },
  { id: 'emoji', category: '視覺元素', label: '適當使用 Emoji 增加視覺效果', description: '每段至少1個 emoji，但不要過度使用', platform: 'both', severity: 'info' },
  { id: 'line_break', category: '排版', label: '段落之間有適當換行', description: '避免一大段文字牆，善用換行增加可讀性', platform: 'both', severity: 'warning' },
  { id: 'link', category: '連結', label: '活動貼文包含相關連結', description: '如有活動頁面、訂位連結等應附上', platform: 'facebook', severity: 'info' },
  { id: 'image_note', category: '素材', label: '已準備搭配圖片/影片', description: '社群貼文必須搭配視覺素材', platform: 'both', severity: 'error' },
  { id: 'store_info', category: '門市資訊', label: '包含門市地址或營業時間', description: '方便顧客找到門市', platform: 'both', severity: 'info' },
  { id: 'tone', category: '語調', label: '符合品牌調性（活潑、年輕、有個性）', description: '酸小七的語調應該是親切但有態度的', platform: 'both', severity: 'warning' },
];

// 台灣節慶行事曆
export const TW_FESTIVALS = [
  { month: 1, day: 1, name: '元旦', type: 'holiday' },
  { month: 1, day: 0, name: '農曆新年', type: 'holiday' },
  { month: 2, day: 14, name: '情人節', type: 'festival' },
  { month: 2, day: 0, name: '元宵節', type: 'festival' },
  { month: 3, day: 8, name: '婦女節', type: 'festival' },
  { month: 3, day: 14, name: '白色情人節', type: 'festival' },
  { month: 4, day: 1, name: '愚人節', type: 'fun' },
  { month: 4, day: 4, name: '兒童節', type: 'holiday' },
  { month: 5, day: 0, name: '母親節', type: 'holiday' },
  { month: 5, day: 0, name: '端午節', type: 'holiday' },
  { month: 6, day: 0, name: '畢業季', type: 'season' },
  { month: 7, day: 0, name: '暑假', type: 'season' },
  { month: 8, day: 8, name: '父親節', type: 'holiday' },
  { month: 8, day: 0, name: '七夕情人節', type: 'festival' },
  { month: 9, day: 0, name: '中秋節', type: 'holiday' },
  { month: 9, day: 28, name: '教師節', type: 'festival' },
  { month: 10, day: 10, name: '國慶日', type: 'holiday' },
  { month: 10, day: 31, name: '萬聖節', type: 'fun' },
  { month: 11, day: 11, name: '雙11購物節', type: 'commercial' },
  { month: 12, day: 22, name: '冬至', type: 'festival' },
  { month: 12, day: 24, name: '平安夜', type: 'festival' },
  { month: 12, day: 25, name: '聖誕節', type: 'holiday' },
  { month: 12, day: 31, name: '跨年', type: 'holiday' },
];
