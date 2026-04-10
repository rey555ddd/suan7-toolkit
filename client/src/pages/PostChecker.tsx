import { useState } from 'react';
import { PLATFORMS, type Platform } from '@/lib/brandData';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardCheck, CheckCircle2, XCircle, AlertTriangle, Info, Sparkles, BarChart3, Copy, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface CheckItem {
  id: string;
  passed: boolean;
  label: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
}

interface CheckResponse {
  score: number;
  summary: string;
  checks: CheckItem[];
  improvements: string[];
  improvedContent?: string;
}

export default function PostChecker() {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<Platform>('facebook');
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [showImproved, setShowImproved] = useState(false);

  const checkMutation = trpc.ai.checkPostAI.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setShowImproved(false);
      const passed = data.checks.filter(c => c.passed).length;
      const total = data.checks.length;
      if (data.score >= 80) {
        toast.success(`優秀！品質分數 ${data.score} 分，可以放心發佈！`);
      } else {
        toast.info(`檢查完成：${passed}/${total} 項通過，分數 ${data.score}`);
      }
    },
    onError: (err) => {
      toast.error(`檢查失敗：${err.message}`);
    },
  });

  const handleCheck = () => {
    if (!content.trim()) {
      toast.error('請先貼上你的文案內容');
      return;
    }
    checkMutation.mutate({ content, platform });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('已複製到剪貼簿！');
  };

  const score = result?.score ?? 0;
  const scoreColor = score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600';
  const scoreBg = score >= 80 ? 'bg-emerald-50' : score >= 60 ? 'bg-amber-50' : 'bg-red-50';
  const scoreBorder = score >= 80 ? 'border-emerald-200' : score >= 60 ? 'border-amber-200' : 'border-red-200';

  const severityIcon = (severity: string, passed: boolean) => {
    if (passed) return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
    switch (severity) {
      case 'error': return <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
      default: return <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    }
  };

  const severityBg = (severity: string, passed: boolean) => {
    if (passed) return 'bg-emerald-50 border-emerald-200';
    switch (severity) {
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <span className="p-2 bg-teal-100 text-teal-700 rounded-xl">
            <ClipboardCheck className="w-6 h-6" />
          </span>
          發文檢查清單
        </h1>
        <p className="text-muted-foreground mt-2">發文前讓 Gemini AI 自動檢查文案品質，給出評分與改善建議</p>
        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          由 Gemini AI 驅動，提供深度分析和改善建議
        </p>
      </div>

      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">貼上你的文案</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <Textarea
                placeholder="將你準備發佈的文案貼在這裡..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="resize-none text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">目前字數：{content.length} 字</p>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">發佈平台</label>
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
              </div>
              <Button
                onClick={handleCheck}
                disabled={checkMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {checkMutation.isPending ? (
                  <><Sparkles className="w-4 h-4 mr-2 animate-spin" /> 分析中...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> AI 檢查</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Score Card */}
          <Card className={`${scoreBg} ${scoreBorder}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`text-5xl font-black font-serif ${scoreColor}`}>
                    {score}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">品質分數 / 100</p>
                    <p className="text-sm text-muted-foreground">
                      {result.checks.filter(c => c.passed).length}/{result.checks.length} 項通過
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${scoreColor}`}>
                    {score >= 80 ? '優秀！可以發佈' : score >= 60 ? '還不錯，建議優化' : '需要改善'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">{result.summary}</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 h-3 bg-white/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Check Items */}
          <div className="space-y-2">
            {result.checks.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`flex items-start gap-3 p-4 rounded-xl border ${severityBg(item.severity, item.passed)}`}>
                  {severityIcon(item.severity, item.passed)}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${item.passed ? 'text-emerald-700' : 'text-foreground'}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  改善建議
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.improvements.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary font-bold flex-shrink-0">{i + 1}.</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Improved Content */}
          {result.improvedContent && (
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-primary" />
                    AI 優化版本
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowImproved(!showImproved)}>
                      {showImproved ? '收起' : '查看'}
                    </Button>
                    {showImproved && (
                      <Button variant="outline" size="sm" onClick={() => handleCopy(result.improvedContent!)}>
                        <Copy className="w-3.5 h-3.5 mr-1.5" /> 複製
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {showImproved && (
                <CardContent>
                  <div className="bg-muted/50 rounded-xl p-4 whitespace-pre-wrap text-sm leading-relaxed">
                    {result.improvedContent}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Tips */}
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">發文小提醒</p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>- Facebook 建議 3-5 個 Hashtag，Instagram 建議 10-20 個</li>
                    <li>- 每篇貼文都要包含 #酸小七 品牌標籤</li>
                    <li>- 文案開頭前兩行最重要，要能吸引停留</li>
                    <li>- 最佳發文時間：11:30（午餐前）、17:00（晚餐前）</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
