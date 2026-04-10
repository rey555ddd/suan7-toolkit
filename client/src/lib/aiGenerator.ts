// AI 文案生成器 — 基於品牌資料的智能文案生成
import { BRAND, MENU, HASHTAGS, BEST_POST_TIMES, POST_TEMPLATES, STORES, TW_FESTIVALS, type PostType, type Platform, type MenuItem } from './brandData';

// 隨機選取陣列元素
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// 生成 Hashtag
export function generateHashtags(platform: Platform, postType: PostType): string[] {
  const brandTags = pickN(HASHTAGS.brand, 2);
  const foodTags = pickN(HASHTAGS.food, platform === 'instagram' ? 4 : 2);
  const moodTags = pickN(HASHTAGS.mood, platform === 'instagram' ? 3 : 1);
  const eventTags = postType === 'promotion' || postType === 'event' ? pickN(HASHTAGS.event, 2) : [];
  const locationTags = platform === 'instagram' ? pickN(HASHTAGS.location, 2) : [];
  return [...brandTags, ...foodTags, ...moodTags, ...eventTags, ...locationTags];
}

// 根據類型生成文案
export function generatePost(postType: PostType, platform: Platform, customInput?: string): { content: string; hashtags: string[]; suggestedImage: string; suggestedTime: string } {
  const hashtags = generateHashtags(platform, postType);
  const suggestedTime = pick(BEST_POST_TIMES);
  const popularDish = pick(MENU.filter(m => m.category === '湯鍋系列'));
  const sideDish = pick(MENU.filter(m => m.category === '炸物小菜'));
  const drink = pick(MENU.filter(m => m.category === '飲料甜點'));
  const store = pick(STORES);

  let content = '';
  let suggestedImage = '';

  switch (postType) {
    case 'new_product': {
      const newItem = MENU.find(m => m.isNew) || popularDish;
      const templates = [
        `🆕 新品報到！\n\n${BRAND.name}全新推出【${newItem.name}】\n${newItem.description || '全新口味，等你來嚐鮮！'}\n\n💰 只要 $${newItem.price}\n📍 全台門市同步開賣\n\n${customInput ? customInput + '\n\n' : ''}快揪朋友一起來試試！\n第一口就讓你愛上 ❤️`,
        `【重磅消息】${BRAND.name}又有新花樣！🔥\n\n✨ ${newItem.name} 正式登場 ✨\n${newItem.description || ''}\n\n嚐鮮價 $${newItem.price}，${customInput || '數量有限，吃過的都說讚！'}\n\n📍 ${store.name}｜${store.address}\n⏰ 營業中，快來搶鮮！`,
        `你們敲碗敲很久的新品終於來了！🥁\n\n${BRAND.name}【${newItem.name}】\n${newItem.description || '全新風味，突破你的想像'}\n\n💰 $${newItem.price} 就能擁有\n${customInput ? '\n' + customInput + '\n' : ''}\n來了就知道，不來會後悔 😏\n📍 全台門市等你來`,
      ];
      content = pick(templates);
      suggestedImage = '建議拍攝：新品特寫美食照，俯拍角度，搭配熱氣騰騰的畫面效果';
      break;
    }
    case 'promotion': {
      const templates = [
        `📣 酸小七好康報報！\n\n${customInput || '本月限定優惠來囉～'}\n\n🎯 集點卡活動持續中：\n✅ 消費滿500元 = 1點\n✅ 3點換飲料、6點換炸物\n✅ 12點直接換湯鍋！\n\n還不快衝？💨\n📍 全台門市適用`,
        `🔥 ${BRAND.name}寵粉時間到！\n\n${customInput || '感謝大家的支持，回饋來了！'}\n\n本週推薦組合：\n🐟 ${popularDish.name} $${popularDish.price}\n🍗 ${sideDish.name} $${sideDish.price}\n🥤 ${drink.name} $${drink.price}\n\n一個人吃剛剛好，兩個人吃更開心 🥰\n📍 ${store.name}等你來`,
      ];
      content = pick(templates);
      suggestedImage = '建議製作：促銷主視覺海報，大字體顯示優惠內容，品牌紅金配色';
      break;
    }
    case 'daily': {
      const moods = ['疲憊', '開心', '無聊', '嘴饞', '壓力大'];
      const mood = pick(moods);
      const templates = [
        `今天的你，是什麼心情？\n\n😊 開心 → 來碗${pick(MENU.filter(m => m.category === '湯鍋系列')).name}慶祝\n😤 壓力大 → ${popularDish.name}的酸爽幫你紓壓\n😋 嘴饞 → ${sideDish.name}解解饞\n\n不管什麼心情\n${BRAND.name}都陪你 ❤️\n\n${customInput || '留言告訴小七你今天的心情吧！'}`,
        `🤔 問你們一個問題：\n\n如果只能選一道${BRAND.name}的菜\n你會選什麼？\n\nA. ${MENU[0].name}\nB. ${MENU[1].name}\nC. ${MENU[2].name}\nD. 全部都要（沒有這個選項啦 😂）\n\n${customInput || '留言告訴我你的答案！'}`,
        `${mood === '疲憊' ? '累了一天' : mood === '嘴饞' ? '嘴巴好寂寞' : '又是美好的一天'}？\n\n來一碗${popularDish.name}吧！\n${popularDish.description || '酸爽夠味，一口就上癮'}\n\n${BRAND.slogan}\n📍 ${store.name}\n⏰ ${store.hours}\n\n${customInput || '你今天想吃什麼？留言告訴我們！'}`,
      ];
      content = pick(templates);
      suggestedImage = '建議拍攝：溫馨用餐場景照，或趣味問答圖卡設計';
      break;
    }
    case 'festival': {
      const now = new Date();
      const upcoming = TW_FESTIVALS.filter(f => f.month >= now.getMonth() + 1).slice(0, 3);
      const festival = upcoming.length > 0 ? pick(upcoming) : { name: '佳節', month: 12, day: 25 };
      const templates = [
        `🎊 ${festival.name}快樂！\n\n${BRAND.name}祝大家${festival.name}愉快 🎉\n\n${customInput || `在這個特別的日子\n帶家人朋友來${BRAND.name}\n一起享受酸爽美味的時光！`}\n\n📍 全台門市歡迎你\n🐟 ${BRAND.slogan}`,
        `✨ ${festival.name}到了！\n\n${customInput || `${BRAND.name}陪你一起過${festival.name}！`}\n\n🎁 ${festival.name}限定：\n到店消費即贈${drink.name}一杯\n（限量供應，送完為止）\n\n快帶你的家人朋友來吧！\n📍 ${store.name}｜${store.address}`,
      ];
      content = pick(templates);
      suggestedImage = `建議製作：${festival.name}主題視覺，融入品牌元素和節日裝飾`;
      break;
    }
    case 'review': {
      const reviews = [
        '湯頭超濃郁，魚片新鮮又嫩，一個人吃完一整鍋！',
        '第一次吃就被圈粉了，酸爽的味道太上癮！',
        '帶朋友來吃，大家都讚不絕口，下次還要再來！',
        '開放式廚房看得到師傅現做，吃得很放心。',
        '霸王酸菜魚份量超大，CP值很高！',
      ];
      content = `💬 來自顧客的真心話：\n\n「${customInput || pick(reviews)}」\n\n謝謝每一位支持${BRAND.name}的你們 ❤️\n你們的肯定是我們最大的動力！\n\n你也有想分享的用餐體驗嗎？\n歡迎留言或私訊告訴我們 📝\n\n📍 ${store.name}\n🐟 ${BRAND.slogan}`;
      suggestedImage = '建議使用：顧客授權的用餐照片，或店內歡樂用餐氛圍照';
      break;
    }
    case 'behind_scenes': {
      const scenes = [
        `👨‍🍳 ${BRAND.name}廚房直擊！\n\n每一碗酸湯魚的背後\n都是師傅們用心的堅持 💪\n\n🐟 嚴選新鮮魚片\n🌶️ 獨門酸菜發酵工藝\n🔥 大火快炒鎖住鮮味\n\n${customInput || '明檔操作，新鮮看得見！'}\n下次來店裡記得看看我們的開放式廚房 👀\n\n📍 ${store.name}`,
        `🎬 幕後花絮時間！\n\n你知道一碗${popularDish.name}要經過幾道工序嗎？\n\n1️⃣ 精選魚片，去骨切片\n2️⃣ 傳統工藝醃製酸菜\n3️⃣ 熬煮高湯，調配酸度\n4️⃣ 大火快煮，鎖住鮮味\n5️⃣ 最後淋上秘製辣油 🔥\n\n${customInput || '每一步都不馬虎！'}\n這就是${BRAND.name}的堅持 ✨`,
      ];
      content = pick(scenes);
      suggestedImage = '建議拍攝：廚師備料過程影片、食材特寫、開放式廚房全景';
      break;
    }
    case 'event': {
      content = `🎭 本週六，精彩活動來啦！\n\n${customInput || '川劇變臉表演震撼登場！'}\n\n📅 每週六固定公演\n🏪 南屯旗艦店 20:00\n🏪 西屯河南店 19:00\n\n邊吃${popularDish.name}\n邊看川劇變臉表演 🎭\n這種體驗只有${BRAND.name}有！\n\n免費觀賞，歡迎闔家光臨 🎊\n快 tag 你想一起來的朋友 👇`;
      suggestedImage = '建議拍攝：川劇變臉表演精彩瞬間，或表演者與觀眾互動畫面';
      break;
    }
    case 'limited_offer': {
      content = `⏰ 限時優惠！手刀搶購！\n\n${customInput || `本週限定：${popularDish.name} 現折 $50！`}\n\n原價 $${popularDish.price} → 優惠價 $${popularDish.price - 50}\n\n📅 限時三天\n📍 全台門市適用\n⚠️ 每人限購一份\n\n數量有限，搶完就沒了！🔥\n趕快 tag 你的吃貨朋友 👇`;
      suggestedImage = '建議製作：倒數計時風格視覺，大字體顯示優惠金額，紅色緊迫感';
      break;
    }
  }

  // 根據平台調整
  if (platform === 'instagram') {
    content = content.replace(/📍.*\n/g, '').trim();
    content += '\n\n' + hashtags.join(' ');
  } else {
    content += '\n\n' + hashtags.slice(0, 5).join(' ');
  }

  return {
    content,
    hashtags,
    suggestedImage,
    suggestedTime: `建議發文時間：${suggestedTime.time}（${suggestedTime.label}）— ${suggestedTime.reason}`,
  };
}

// 生成月度社群行事曆
export interface CalendarEntry {
  date: string;
  day: number;
  weekday: string;
  time: string;
  platform: Platform;
  postType: PostType;
  topic: string;
  brief: string;
  imageDirection: string;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export function generateMonthlyCalendar(year: number, month: number, postsPerWeek: number = 4): CalendarEntry[] {
  const entries: CalendarEntry[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // 找出該月節慶
  const monthFestivals = TW_FESTIVALS.filter(f => f.month === month);
  
  // 規劃每週發文日（週二、四、六、日為主）
  const preferredDays = [2, 4, 6, 0]; // 週二四六日
  const timeSlots = ['11:30', '17:00', '12:30', '20:00'];
  
  // 貼文類型輪替
  const typeRotation: PostType[] = ['daily', 'new_product', 'behind_scenes', 'promotion', 'review', 'event', 'limited_offer', 'festival'];
  let typeIndex = 0;
  
  const platforms: Platform[] = ['facebook', 'instagram'];
  let platIndex = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const weekday = date.getDay();
    
    // 檢查是否為節慶日
    const festival = monthFestivals.find(f => f.day === day);
    
    // 判斷是否為發文日
    const isPostDay = preferredDays.includes(weekday) || festival;
    
    if (isPostDay && entries.length < postsPerWeek * 5) {
      let postType = typeRotation[typeIndex % typeRotation.length];
      let topic = '';
      let brief = '';
      let imageDir = '';
      const time = timeSlots[entries.length % timeSlots.length];
      const platform = platforms[platIndex % platforms.length];
      
      if (festival) {
        postType = 'festival';
        topic = `${festival.name}祝福貼文`;
        brief = `結合${festival.name}氛圍，推出節慶限定優惠或祝福`;
        imageDir = `${festival.name}主題視覺，融入品牌紅金色調`;
      } else {
        const dish = pick(MENU.filter(m => m.category === '湯鍋系列'));
        switch (postType) {
          case 'daily':
            topic = pick(['美食問答互動', '今日推薦菜色', '你選哪一道？', '吃貨日常分享']);
            brief = `輕鬆互動貼文，提升粉絲參與度`;
            imageDir = '趣味問答圖卡或溫馨用餐場景';
            break;
          case 'new_product':
            topic = `推薦：${dish.name}`;
            brief = `主打${dish.name}，強調${dish.description || '獨特風味'}`;
            imageDir = `${dish.name}美食特寫照，俯拍角度`;
            break;
          case 'behind_scenes':
            topic = pick(['廚房幕後直擊', '食材故事', '師傅的一天', '開放式廚房揭密']);
            brief = '展示品牌透明度和用心，建立信任感';
            imageDir = '廚房實拍照片或短影片';
            break;
          case 'promotion':
            topic = pick(['集點卡活動提醒', '本週優惠組合', '會員專屬福利']);
            brief = '推廣現有活動，刺激消費';
            imageDir = '促銷主視覺海報，醒目的優惠數字';
            break;
          case 'review':
            topic = '顧客好評分享';
            brief = '分享真實顧客評價，建立口碑';
            imageDir = '顧客用餐照或好評截圖（需授權）';
            break;
          case 'event':
            topic = '川劇變臉週六公演';
            brief = '宣傳每週六的川劇變臉表演活動';
            imageDir = '變臉表演精彩瞬間照片';
            break;
          case 'limited_offer':
            topic = pick(['限時快閃優惠', '本週限定折扣', '銅板價嚐鮮']);
            brief = '製造緊迫感，刺激即時消費';
            imageDir = '倒數計時風格視覺，紅色系';
            break;
          default:
            topic = '品牌日常';
            brief = '維持品牌存在感';
            imageDir = '品牌形象照';
        }
      }
      
      entries.push({
        date: `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`,
        day,
        weekday: `週${WEEKDAYS[weekday]}`,
        time,
        platform,
        postType,
        topic,
        brief,
        imageDirection: imageDir,
      });
      
      typeIndex++;
      platIndex++;
    }
  }
  
  return entries;
}

// 發文檢查
export interface CheckResult {
  id: string;
  passed: boolean;
  label: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
}

export function checkPost(content: string, platform: Platform): CheckResult[] {
  const results: CheckResult[] = [];
  
  // CTA 檢查
  const ctaKeywords = ['留言', '分享', '私訊', 'tag', '點擊', '快來', '立即', '趕快', '手刀', '搶購'];
  const hasCTA = ctaKeywords.some(k => content.includes(k));
  results.push({ id: 'cta', passed: hasCTA, label: '包含明確的 CTA', description: hasCTA ? '已包含行動呼籲' : '建議加入「留言」「分享」「tag朋友」等行動呼籲', severity: 'error' });
  
  // Hashtag 檢查
  const hashtagCount = (content.match(/#/g) || []).length;
  if (platform === 'facebook') {
    results.push({ id: 'hashtag_fb', passed: hashtagCount >= 3 && hashtagCount <= 8, label: `Hashtag 數量：${hashtagCount} 個`, description: hashtagCount < 3 ? '建議至少 3 個 Hashtag' : hashtagCount > 8 ? 'FB 不宜超過 8 個 Hashtag' : '數量適中', severity: 'warning' });
  } else {
    results.push({ id: 'hashtag_ig', passed: hashtagCount >= 8 && hashtagCount <= 25, label: `Hashtag 數量：${hashtagCount} 個`, description: hashtagCount < 8 ? '建議至少 8 個 Hashtag 增加曝光' : hashtagCount > 25 ? 'IG 最多 30 個 Hashtag' : '數量適中', severity: 'warning' });
  }
  
  // 品牌 Hashtag
  const hasBrandTag = content.includes('#酸小七');
  results.push({ id: 'brand_tag', passed: hasBrandTag, label: '品牌 Hashtag #酸小七', description: hasBrandTag ? '已包含品牌標籤' : '務必加入 #酸小七', severity: 'error' });
  
  // 文案長度
  const length = content.length;
  if (platform === 'facebook') {
    results.push({ id: 'length', passed: length >= 100 && length <= 600, label: `文案長度：${length} 字`, description: length < 100 ? '文案偏短，建議補充更多內容' : length > 600 ? '文案偏長，建議精簡' : '長度適中', severity: 'warning' });
  } else {
    results.push({ id: 'length', passed: length >= 80 && length <= 400, label: `文案長度：${length} 字`, description: length < 80 ? '文案偏短' : length > 400 ? 'IG 文案建議精簡一些' : '長度適中', severity: 'warning' });
  }
  
  // Emoji 檢查
  const emojiRegex = new RegExp('[\\u{1F300}-\\u{1F9FF}]|[\\u{2600}-\\u{26FF}]|[\\u{2700}-\\u{27BF}]', 'gu');
  // Simple emoji detection fallback
  const emojiSimple = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  const emojiCount = (content.match(emojiRegex) || []).length;
  results.push({ id: 'emoji', passed: emojiCount >= 2, label: `Emoji 使用：${emojiCount} 個`, description: emojiCount < 2 ? '建議加入 Emoji 增加視覺效果' : '視覺效果良好', severity: 'info' });
  
  // 換行檢查
  const lineBreaks = (content.match(/\n\n/g) || []).length;
  results.push({ id: 'linebreak', passed: lineBreaks >= 2, label: `段落分隔：${lineBreaks} 處`, description: lineBreaks < 2 ? '建議增加段落分隔，避免文字牆' : '排版良好', severity: 'warning' });
  
  // 品牌調性
  const brandKeywords = ['酸小七', '酸爽', '酸湯魚', '酸菜魚', '正宗', '道地'];
  const brandMentions = brandKeywords.filter(k => content.includes(k)).length;
  results.push({ id: 'brand_tone', passed: brandMentions >= 1, label: `品牌關鍵字：${brandMentions} 個`, description: brandMentions < 1 ? '建議融入品牌特色詞彙' : '品牌調性良好', severity: 'warning' });
  
  // 圖片提醒
  results.push({ id: 'image', passed: false, label: '已準備搭配圖片/影片', description: '請確認已準備好搭配的視覺素材', severity: 'info' });
  
  return results;
}

// 活動企劃生成
export interface EventPlan {
  title: string;
  objective: string;
  duration: string;
  budget: string;
  phases: { phase: string; tasks: string[]; timeline: string }[];
  socialPlan: { platform: string; content: string; frequency: string }[];
  kpis: string[];
  materials: string[];
}

export function generateEventPlan(
  eventType: string,
  goal: string,
  budget: string,
  duration: string,
  customNotes?: string
): EventPlan {
  const eventNames: Record<string, string> = {
    new_store: '新店開幕慶',
    seasonal: '季節限定活動',
    holiday: '節慶特別企劃',
    collab: '異業合作活動',
    loyalty: '會員回饋活動',
    social_campaign: '社群互動活動',
    tasting: '新品試吃會',
    performance: '川劇變臉特別場',
  };

  const title = `${BRAND.name}【${eventNames[eventType] || '品牌活動'}】企劃案`;

  const goalDescriptions: Record<string, string> = {
    new_customer: '透過活動吸引新客群，提升品牌知名度與來客數',
    retention: '強化既有顧客忠誠度，提升回購率與客單價',
    awareness: '擴大品牌曝光範圍，建立品牌形象與口碑',
    engagement: '提升社群互動率，增加粉絲黏著度',
    sales: '直接帶動營業額成長，衝刺業績目標',
  };

  const phases = [
    {
      phase: '前期準備（活動前2週）',
      tasks: ['確認活動細節與物料需求', '設計主視覺與社群素材', '撰寫社群預告文案', '通知各門市準備', customNotes ? `特別注意：${customNotes}` : ''].filter(Boolean),
      timeline: '活動前14天~7天',
    },
    {
      phase: '預熱宣傳（活動前1週）',
      tasks: ['發布預告貼文（FB+IG）', '限時動態倒數', '發送會員通知', 'KOL/部落客邀約（如有預算）'],
      timeline: '活動前7天~1天',
    },
    {
      phase: '活動執行',
      tasks: ['即時社群更新', '現場拍攝記錄', '顧客互動與回饋收集', '突發狀況應變'],
      timeline: `活動期間（${duration}）`,
    },
    {
      phase: '後續追蹤（活動後1週）',
      tasks: ['發布活動回顧貼文', '整理顧客回饋', '數據分析與成效報告', '感謝貼文發布'],
      timeline: '活動結束後7天內',
    },
  ];

  const socialPlan = [
    { platform: 'Facebook', content: '活動主視覺海報 + 詳細活動說明文案', frequency: '活動前3篇預告 + 活動中每日1篇 + 活動後2篇回顧' },
    { platform: 'Instagram', content: '精美食物照 + 簡潔有力的文案 + 限時動態', frequency: '貼文同FB + 每日2-3則限時動態' },
    { platform: 'LINE', content: '會員專屬通知 + 優惠券發送', frequency: '活動前1次 + 活動中提醒1次' },
  ];

  const kpis = [
    '社群貼文觸及率提升 30%',
    '活動期間來客數成長 20%',
    '社群新增粉絲 100+',
    '顧客好評/UGC 內容 10+ 則',
    `${goal === 'sales' ? '營業額成長 25%' : '品牌提及次數增加 50%'}`,
  ];

  const materials = [
    '活動主視覺海報（直式+橫式）',
    '社群貼文圖片 5-8 張',
    '限時動態素材 10+ 張',
    '門市 POP 海報',
    '菜單插卡/桌卡',
    budget !== 'free' ? 'FB/IG 廣告素材（靜態+動態）' : '',
    '活動紀錄影片素材',
  ].filter(Boolean);

  return {
    title,
    objective: goalDescriptions[goal] || '提升品牌整體表現',
    duration,
    budget,
    phases,
    socialPlan,
    kpis,
    materials,
  };
}
