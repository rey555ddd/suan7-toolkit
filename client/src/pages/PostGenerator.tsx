import { useState } from 'react';
import { POST_TYPES, PLATFORMS, type PostType, type Platform } from '@/lib/brandData';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, RefreshCw, Sparkles, Clock, Image, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface PostResult {
  content: string;
  hashtags: string[];
  suggestedImage: string;
  suggestedTime: string;
}

export default function PostGenerator() {
  const [postType, setPostType] = useState<PostType>('new_product');
  const [platform, setPlatform] = useState<Platform>('facebook');
  const [customInput, setCustomInput] = useState('');
  const [result, setResult] = useState<PostResult | null>(null);

  const generateMutation = trpc.ai.generatePost.useMutation({
    onSuccess: (data) => {
      setResult(data);
      toast.success('文案生成成功！');
    },
    onError: (err) => {
      toast.error(`生成失敗：${err.message}`);
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({ postType, platform, customInput: customInput || undefined });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('已複製到剪貼簿！');
  };

  const handleRegenerate = () => {
    toast.info('重新生成中...');
    handleGenerate();
  };

  const selectedType = POST_TYPES.find(t => t.value === postType);
  const selectedPlatform = PLATFORMS.find(p => p.value === platform);
  const isGenerating = generateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <span className="p-2 bg-red-100 text-red-700 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </span>
          小編助手
        </h1>
        <p className="text-muted-foreground mt-2">選擇貼文類型和平台，一鍵生成融入酸小七品牌特色的社群文案</p>
        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          由 Gemini AI 驅動，每次生成都是全新創作
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">設定貼文參數</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Post Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">貼文類型</label>
              <Select value={postType} onValueChange={(v) => setPostType(v as PostType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POST_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      <span className="flex items-center gap-2">
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedType && (
                <p className="text-xs text-muted-foreground">{selectedType.description}</p>
              )}
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">發佈平台</label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPlatform && (
                <p className="text-xs text-muted-foreground">
                  建議文案長度：{selectedPlatform.maxLength} 字以內 ｜ Hashtag：{selectedPlatform.hashtagCount} 個
                </p>
              )}
            </div>
          </div>

          {/* Custom Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">自訂內容（選填）</label>
            <Textarea
              placeholder="輸入你想強調的重點、活動細節、或特別想說的話..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            size="lg"
          >
            {isGenerating ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Gemini 生成中...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> 一鍵生成文案</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* Generated Content */}
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                生成文案
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isGenerating}>
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isGenerating ? 'animate-spin' : ''}`} /> 重新生成
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleCopy(result.content)}>
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> 複製
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-xl p-4 sm:p-6 whitespace-pre-wrap text-sm leading-relaxed font-sans">
                {result.content}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Time Suggestion */}
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">建議發文時間</p>
                    <p className="text-sm text-foreground leading-relaxed">{result.suggestedTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Suggestion */}
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-lg flex-shrink-0">
                    <Image className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">素材建議</p>
                    <p className="text-sm text-foreground leading-relaxed">{result.suggestedImage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hashtags */}
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg flex-shrink-0">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Hashtag（{result.hashtags.length}個）</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.hashtags.map((tag, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
