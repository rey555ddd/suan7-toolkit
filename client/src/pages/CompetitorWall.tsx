import { useState } from 'react';
import { COMPETITORS } from '@/lib/brandData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Lightbulb, ExternalLink, TrendingUp, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface InspirationTip {
  competitor: string;
  idea: string;
  howToAdapt: string;
  postType: string;
}

function generateInspirations(): InspirationTip[] {
  return [
    {
      competitor: '太二酸菜魚',
      idea: '「太二」人設語錄系列 — 用品牌擬人化角色發文',
      howToAdapt: '酸小七可以打造「小七」人設，用第一人稱發文，例如：「小七今天心情不好，因為有人說不辣的酸菜魚也好吃...那你是沒吃過我家的辣味！」',
      postType: '日常互動',
    },
    {
      competitor: '海底撈',
      idea: '隱藏吃法系列 — 教粉絲獨特的搭配方式',
      howToAdapt: '酸小七可以推出「老饕秘技」系列，教大家酸湯魚的隱藏吃法，例如：加入白飯做成酸湯泡飯、用酸湯煮泡麵等，增加互動和分享。',
      postType: '日常互動',
    },
    {
      competitor: '這一鍋',
      idea: '古風美食攝影 — 用中國風視覺提升質感',
      howToAdapt: '酸小七可以結合川味文化，拍攝水墨風格的美食照，搭配古詩詞改編的文案，例如：「魚之鮮，湯之酸，一碗入魂三日香」。',
      postType: '品牌形象',
    },
    {
      competitor: '撈王鍋物',
      idea: '食材科普系列 — 用知識型內容建立專業形象',
      howToAdapt: '酸小七可以做「酸菜的秘密」系列，介紹傳統發酵工藝、不同魚種的口感差異、花椒的產地故事等，展現品牌的專業度。',
      postType: '幕後花絮',
    },
    {
      competitor: '魚你同在',
      idea: '食材溯源系列 — 強調食材來源和品質',
      howToAdapt: '酸小七可以拍攝「從產地到餐桌」的系列內容，展示魚片的挑選過程、酸菜的發酵過程，強化「明檔操作，新鮮看得見」的品牌特色。',
      postType: '幕後花絮',
    },
    {
      competitor: '海底撈',
      idea: '服務驚喜故事 — 用真實故事打動人心',
      howToAdapt: '酸小七可以收集門市的暖心故事，例如：為生日顧客準備驚喜、幫忙慶祝紀念日等，搭配川劇變臉表演的獨特體驗分享。',
      postType: '顧客好評',
    },
    {
      competitor: '太二酸菜魚',
      idea: '聯名周邊商品 — 跨界合作增加話題',
      howToAdapt: '酸小七可以推出品牌周邊（辣椒造型鑰匙圈、酸爽語錄T恤等），或與在地品牌聯名，製造社群話題和討論度。',
      postType: '活動宣傳',
    },
    {
      competitor: '這一鍋',
      idea: '節氣限定系列 — 結合二十四節氣推限定品',
      howToAdapt: '酸小七可以在特定節氣推出限定口味或組合，例如：立冬的「暖心酸湯套餐」、大暑的「冰鎮酸爽特調」，創造定期話題。',
      postType: '新品推薦',
    },
  ];
}

const competitorColors = [
  'border-l-red-400 bg-red-50/50',
  'border-l-orange-400 bg-orange-50/50',
  'border-l-emerald-400 bg-emerald-50/50',
  'border-l-blue-400 bg-blue-50/50',
  'border-l-purple-400 bg-purple-50/50',
];

export default function CompetitorWall() {
  const [inspirations, setInspirations] = useState<InspirationTip[]>([]);
  const [showInspirations, setShowInspirations] = useState(false);

  const handleGenerateInspirations = () => {
    const tips = generateInspirations();
    setInspirations(tips);
    setShowInspirations(true);
    toast.success(`已生成 ${tips.length} 個靈感建議！`);
  };

  const handleCopyIdea = (tip: InspirationTip) => {
    const text = `【靈感來源：${tip.competitor}】\n原始策略：${tip.idea}\n\n酸小七改編建議：\n${tip.howToAdapt}\n\n建議貼文類型：${tip.postType}`;
    navigator.clipboard.writeText(text);
    toast.success('靈感已複製！');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <span className="p-2 bg-slate-100 text-slate-700 rounded-xl">
            <Users className="w-6 h-6" />
          </span>
          競品參考牆
        </h1>
        <p className="text-muted-foreground mt-2">參考同類型餐飲品牌的社群策略，激發你的創作靈感</p>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMPETITORS.map((comp, i) => (
          <motion.div
            key={comp.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className={`h-full border-l-4 ${competitorColors[i % competitorColors.length]}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{comp.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{comp.type}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">品牌風格</p>
                  <p className="text-sm">{comp.style}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">熱門內容策略</p>
                  <div className="space-y-1">
                    {comp.popularPosts.map((post, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-3 h-3 text-primary flex-shrink-0" />
                        {post}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">活躍平台</p>
                  <div className="flex flex-wrap gap-1">
                    {comp.platforms.map(p => (
                      <span key={p} className="text-xs bg-muted px-2 py-0.5 rounded-full">{p}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Generate Inspirations */}
      <Card className="border-dashed border-2">
        <CardContent className="pt-6 text-center space-y-4">
          <Lightbulb className="w-10 h-10 text-amber-500 mx-auto" />
          <div>
            <h3 className="font-serif font-bold text-lg">需要靈感嗎？</h3>
            <p className="text-sm text-muted-foreground mt-1">
              根據競品策略，自動生成適合酸小七的社群靈感建議
            </p>
          </div>
          <Button onClick={handleGenerateInspirations} className="bg-primary hover:bg-primary/90">
            <Lightbulb className="w-4 h-4 mr-2" /> 生成靈感建議
          </Button>
        </CardContent>
      </Card>

      {/* Inspirations */}
      {showInspirations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="font-serif font-bold text-lg">靈感建議（{inspirations.length}個）</h2>
          {inspirations.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">參考：{tip.competitor}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tip.postType}</span>
                      </div>
                      <p className="text-sm font-medium">{tip.idea}</p>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs font-medium text-primary mb-1">酸小七改編建議：</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tip.howToAdapt}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleCopyIdea(tip)} className="flex-shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
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
