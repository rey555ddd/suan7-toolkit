import { useState } from 'react';
import { POST_TYPES, MENU, BRAND, type PostType } from '@/lib/brandData';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Image, Camera, Video, Palette, Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface AssetSuggestion {
  type: string;
  title: string;
  description: string;
  specs: string;
  tips: string[];
  colorScheme: string;
  composition: string;
}

function generateAssetSuggestions(postType: PostType, customContext: string): AssetSuggestion[] {
  const suggestions: AssetSuggestion[] = [];
  const dish = MENU[Math.floor(Math.random() * MENU.filter(m => m.category === '湯鍋系列').length)];

  const basePhoto: AssetSuggestion = {
    type: 'photo',
    title: '',
    description: '',
    specs: '',
    tips: [],
    colorScheme: '',
    composition: '',
  };

  switch (postType) {
    case 'new_product':
      suggestions.push({
        ...basePhoto,
        type: 'photo',
        title: '新品美食特寫照',
        description: `拍攝新品的精美特寫，突出食材質感和色澤。建議使用俯拍（90度）或45度角拍攝，讓湯頭的色澤和魚片的鮮嫩感完美呈現。`,
        specs: 'IG 正方形 1080x1080px / FB 橫幅 1200x630px',
        tips: [
          '使用自然光或暖色調燈光，避免冷白光',
          '擺盤時加入辣椒、花椒、香菜等配料增加色彩',
          '拍攝前噴少許水霧增加新鮮感',
          '背景使用深色木桌或品牌綠色桌布',
        ],
        colorScheme: '暖色調為主：紅（辣椒）、金黃（湯頭）、綠（蔬菜）、白（魚片）',
        composition: '中心構圖或三分法，主體佔畫面 60-70%',
      });
      suggestions.push({
        ...basePhoto,
        type: 'video',
        title: '新品開箱短影片',
        description: '15-30秒的短影片，從上菜到第一口的完整過程。加入慢動作特寫和熱氣騰騰的畫面。',
        specs: 'IG Reels 9:16 (1080x1920px) / FB 1:1 或 16:9',
        tips: [
          '開頭3秒要有吸引力（例如湯頭倒入的慢動作）',
          '加入夾起魚片的特寫鏡頭',
          '背景音樂選擇輕快活潑的風格',
          '結尾加上品牌 Logo 和門市資訊',
        ],
        colorScheme: '暖色調濾鏡，提升食物色澤',
        composition: '垂直構圖，食物居中，留出上下文字空間',
      });
      suggestions.push({
        ...basePhoto,
        type: 'graphic',
        title: '新品上市主視覺海報',
        description: `設計一張新品上市的宣傳海報，融入${BRAND.name}品牌元素。大字標題突出新品名稱，搭配價格和門市資訊。`,
        specs: 'IG 貼文 1080x1080px / FB 封面 820x312px',
        tips: [
          '使用品牌紅色作為主色調',
          '新品名稱用大字體，價格用醒目色塊',
          '加入「新品」「限量」等標籤增加緊迫感',
          '底部放上門市地址和營業時間',
        ],
        colorScheme: `品牌紅 + 金色 + 白色，搭配${BRAND.name}Logo`,
        composition: '上方：新品照片 / 中間：品名+價格 / 下方：門市資訊',
      });
      break;

    case 'promotion':
      suggestions.push({
        ...basePhoto,
        type: 'graphic',
        title: '促銷活動主視覺',
        description: '設計醒目的促銷海報，大字體顯示折扣資訊，搭配品牌元素和美食照片。',
        specs: 'IG 1080x1080px / FB 1200x630px',
        tips: [
          '折扣數字要夠大夠醒目',
          '使用紅色/金色營造促銷氛圍',
          '加入倒數或限時標記增加緊迫感',
          '確保活動條件和日期清楚標示',
        ],
        colorScheme: '紅色 + 金色 + 白色，高對比度',
        composition: '中心放大折扣數字，四周環繞美食元素',
      });
      suggestions.push({
        ...basePhoto,
        type: 'photo',
        title: '超值套餐組合照',
        description: '將促銷套餐的所有品項擺在一起拍攝，展示超值感和豐盛度。',
        specs: 'IG 1080x1080px / FB 1200x630px',
        tips: [
          '所有品項都要清楚可見',
          '從上方45度角拍攝展示全貌',
          '加入價格標籤或手寫價格增加親切感',
          '背景乾淨，突出食物本身',
        ],
        colorScheme: '自然色調，食物本色為主',
        composition: '平鋪式構圖，所有品項均勻分布',
      });
      break;

    case 'daily':
      suggestions.push({
        ...basePhoto,
        type: 'graphic',
        title: '趣味問答圖卡',
        description: '設計互動式的問答圖卡，例如「你選哪一道？」搭配菜色照片讓粉絲投票。',
        specs: 'IG 1080x1080px',
        tips: [
          '版面分成2-4格，每格一個選項',
          '每個選項搭配對應的菜色照片',
          '加入投票引導文字',
          '風格活潑有趣，符合品牌調性',
        ],
        colorScheme: '品牌色系，每個選項可用不同色塊區分',
        composition: '網格式排版，選項清楚分隔',
      });
      suggestions.push({
        ...basePhoto,
        type: 'photo',
        title: '溫馨用餐場景',
        description: '拍攝顧客享用美食的自然場景，營造溫馨歡樂的用餐氛圍。',
        specs: 'IG 1080x1350px (4:5) / FB 1200x630px',
        tips: [
          '捕捉自然的用餐表情和互動',
          '注意光線，避免過暗或過曝',
          '可以拍攝朋友聚餐、家庭用餐等場景',
          '需取得顧客同意才能使用',
        ],
        colorScheme: '暖色調，營造溫馨感',
        composition: '人物為主體，食物為輔，環境為背景',
      });
      break;

    case 'festival':
      suggestions.push({
        ...basePhoto,
        type: 'graphic',
        title: '節慶祝福主視覺',
        description: '結合節慶元素和品牌特色的祝福海報，傳遞節日氛圍和品牌溫度。',
        specs: 'IG 1080x1080px / FB 1200x630px',
        tips: [
          '融入對應節慶的傳統元素',
          '品牌 Logo 要清楚可見',
          '祝福語簡潔有力',
          '如有節慶優惠一併呈現',
        ],
        colorScheme: '依節慶調整：春節紅金、中秋暖黃、聖誕紅綠',
        composition: '節慶元素環繞品牌Logo，下方放祝福語和優惠資訊',
      });
      break;

    case 'review':
      suggestions.push({
        ...basePhoto,
        type: 'graphic',
        title: '顧客好評圖卡',
        description: '將顧客好評製作成精美的圖卡分享，增加可信度和口碑效果。',
        specs: 'IG 1080x1080px',
        tips: [
          '評語用大字體突出顯示',
          '搭配顧客的用餐照片（需授權）',
          '加入星星評分視覺元素',
          '底部放上品牌資訊',
        ],
        colorScheme: '溫暖色調，白底搭配品牌紅色重點',
        composition: '上方：顧客照片 / 中間：評語引用 / 下方：品牌資訊',
      });
      break;

    case 'behind_scenes':
      suggestions.push({
        ...basePhoto,
        type: 'video',
        title: '廚房幕後紀錄片',
        description: '30-60秒的幕後紀錄短片，展示從食材準備到上菜的完整過程。',
        specs: 'IG Reels 9:16 / FB 16:9',
        tips: [
          '拍攝師傅的專業動作和細節',
          '加入食材特寫鏡頭',
          '配上輕快的背景音樂',
          '結尾展示成品和品牌Logo',
        ],
        colorScheme: '自然色調，保持真實感',
        composition: '跟拍式構圖，展示流程動線',
      });
      suggestions.push({
        ...basePhoto,
        type: 'photo',
        title: '食材特寫照',
        description: '拍攝新鮮食材的特寫照片，展示品牌對食材品質的堅持。',
        specs: 'IG 1080x1080px',
        tips: [
          '魚片、蔬菜等食材要新鮮飽滿',
          '使用微距鏡頭捕捉質感',
          '背景簡潔，突出食材本身',
          '可以加入手持食材的畫面增加親切感',
        ],
        colorScheme: '自然色調，食材本色',
        composition: '特寫構圖，填滿畫面',
      });
      break;

    case 'event':
      suggestions.push({
        ...basePhoto,
        type: 'photo',
        title: '川劇變臉表演精彩瞬間',
        description: '捕捉川劇變臉表演的精彩瞬間，展示酸小七獨特的用餐體驗。',
        specs: 'IG 1080x1350px (4:5) / FB 1200x630px',
        tips: [
          '使用高速快門捕捉變臉瞬間',
          '注意舞台燈光和色彩',
          '拍攝觀眾驚喜的反應',
          '多角度拍攝，包含全景和特寫',
        ],
        colorScheme: '鮮豔色彩，保留表演服裝的華麗感',
        composition: '表演者居中，觀眾環繞，營造現場感',
      });
      suggestions.push({
        ...basePhoto,
        type: 'video',
        title: '活動精華短影片',
        description: '15-30秒的活動精華剪輯，展示活動氛圍和精彩片段。',
        specs: 'IG Reels 9:16 / FB 16:9',
        tips: [
          '快節奏剪輯，保持觀眾注意力',
          '加入現場音效增加臨場感',
          '結尾加上下次活動預告',
          '加入品牌浮水印',
        ],
        colorScheme: '保留現場色彩，適度提亮',
        composition: '多鏡頭切換，動態感強',
      });
      break;

    case 'limited_offer':
      suggestions.push({
        ...basePhoto,
        type: 'graphic',
        title: '限時優惠倒數海報',
        description: '設計具有緊迫感的限時優惠海報，大字體顯示優惠內容和倒數時間。',
        specs: 'IG 1080x1080px / IG Story 1080x1920px',
        tips: [
          '使用紅色/橙色營造緊迫感',
          '倒數數字要夠大夠醒目',
          '優惠內容一目了然',
          '加入「限量」「售完為止」等字樣',
        ],
        colorScheme: '紅色 + 黑色 + 白色，高對比度',
        composition: '倒數數字居中，優惠內容上下排列',
      });
      break;
  }

  // Add context-specific suggestion if custom input provided
  if (customContext) {
    suggestions.push({
      ...basePhoto,
      type: 'graphic',
      title: '客製化素材建議',
      description: `根據你的需求「${customContext}」，建議製作一張結合品牌元素的客製化圖片。可以使用${BRAND.name}的品牌紅色和Logo，搭配相關的視覺元素。`,
      specs: '依平台需求調整尺寸',
      tips: [
        '確保品牌元素（Logo、色彩）一致',
        '文字簡潔有力，重點突出',
        '預留社群平台的安全區域',
        '測試在手機上的顯示效果',
      ],
      colorScheme: `品牌紅 + 金色 + ${BRAND.name}標準色`,
      composition: '依內容需求靈活調整',
    });
  }

  return suggestions;
}

export default function AssetGuide() {
  const [postType, setPostType] = useState<PostType>('new_product');
  const [customContext, setCustomContext] = useState('');
  const [suggestions, setSuggestions] = useState<AssetSuggestion[]>([]);
  const [generated, setGenerated] = useState(false);

  const assetsMutation = trpc.ai.generateAssets.useMutation({
    onSuccess: (data) => {
      setSuggestions(data);
      setGenerated(true);
      toast.success(`已生成 ${data.length} 個素材建議！`);
    },
    onError: (err) => {
      toast.error(`生成失敗：${err.message}`);
    },
  });

  const handleGenerate = () => {
    assetsMutation.mutate({ postType, customContext: customContext || undefined });
  };

  const handleCopy = (suggestion: AssetSuggestion) => {
    const text = [
      `【${suggestion.title}】`,
      `類型：${suggestion.type === 'photo' ? '攝影' : suggestion.type === 'video' ? '影片' : '平面設計'}`,
      `說明：${suggestion.description}`,
      `規格：${suggestion.specs}`,
      `色彩：${suggestion.colorScheme}`,
      `構圖：${suggestion.composition}`,
      '',
      '拍攝/設計要點：',
      ...suggestion.tips.map(t => `- ${t}`),
    ].join('\n');
    navigator.clipboard.writeText(text);
    toast.success('素材指引已複製！');
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'graphic': return <Palette className="w-5 h-5" />;
      default: return <Image className="w-5 h-5" />;
    }
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case 'photo': return '攝影';
      case 'video': return '影片';
      case 'graphic': return '平面設計';
      default: return '素材';
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case 'photo': return 'bg-blue-100 text-blue-700';
      case 'video': return 'bg-purple-100 text-purple-700';
      case 'graphic': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <span className="p-2 bg-yellow-100 text-yellow-700 rounded-xl">
            <Image className="w-6 h-6" />
          </span>
          素材方向生成
        </h1>
        <p className="text-muted-foreground mt-2">除了文案，還告訴你該搭配什麼圖片/影片，附上具體的拍攝和設計指引</p>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">貼文類型</label>
              <Select value={postType} onValueChange={(v) => setPostType(v as PostType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POST_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.icon} {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">補充說明（選填）</label>
              <Textarea
                placeholder="例如：想強調新品的辣度、需要拍攝外帶包裝..."
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={assetsMutation.isPending} className="bg-primary hover:bg-primary/90">
            {assetsMutation.isPending ? (
              <><Sparkles className="w-4 h-4 mr-2 animate-spin" /> Gemini 生成中...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> 生成素材建議</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {generated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {suggestions.map((suggestion, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-3">
                      <span className={`p-2 rounded-lg ${typeColor(suggestion.type)}`}>
                        {typeIcon(suggestion.type)}
                      </span>
                      <div>
                        <p>{suggestion.title}</p>
                        <span className="text-xs font-normal text-muted-foreground">{typeLabel(suggestion.type)}</span>
                      </div>
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(suggestion)}>
                      <Copy className="w-3.5 h-3.5 mr-1.5" /> 複製指引
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{suggestion.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">建議規格</p>
                      <p className="text-sm">{suggestion.specs}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">色彩方向</p>
                      <p className="text-sm">{suggestion.colorScheme}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">構圖建議</p>
                      <p className="text-sm">{suggestion.composition}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">拍攝/設計要點</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {suggestion.tips.map((tip, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm text-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
