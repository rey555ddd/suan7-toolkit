import { useState } from 'react';
import { POST_TEMPLATES, POST_TYPES, type PostType } from '@/lib/brandData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, LayoutTemplate, Image, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function TemplateLibrary() {
  const [filter, setFilter] = useState<PostType | 'all'>('all');
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [filledVars, setFilledVars] = useState<Record<string, string>>({});
  const [previewContent, setPreviewContent] = useState('');

  const filtered = filter === 'all'
    ? POST_TEMPLATES
    : POST_TEMPLATES.filter(t => t.type === filter);

  const handleFillTemplate = (templateId: string) => {
    setActiveTemplate(templateId);
    setFilledVars({});
    setPreviewContent('');
  };

  const handlePreview = (template: typeof POST_TEMPLATES[0]) => {
    let content = template.template;
    template.variables.forEach(v => {
      const val = filledVars[v] || `[${v}]`;
      content = content.replace(new RegExp(`\\{${v}\\}`, 'g'), val);
    });
    setPreviewContent(content);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('已複製到剪貼簿！');
  };

  const varLabels: Record<string, string> = {
    product_name: '產品名稱',
    product_description: '產品描述',
    price: '價格',
    extra_message: '額外訊息',
    product_highlight: '產品亮點',
    gift: '贈品內容',
    date: '日期',
    top_reward: '最高獎勵',
    extra_info: '額外資訊',
    discount_info: '折扣資訊',
    date_range: '活動期間',
    stores: '適用門市',
    conditions: '活動條件',
    option_a: '選項 A',
    option_b: '選項 B',
    option_c: '選項 C',
    fun_fact: '趣味小知識',
    dish_name: '菜色名稱',
    mood_description: '情境描述',
    mood: '心情',
    store_info: '門市資訊',
    festival_name: '節慶名稱',
    greeting_message: '祝福語',
    special_offer: '特別優惠',
    celebration_action: '慶祝方式',
    closing_message: '結語',
    festival_hashtag: '節慶標籤',
    review_quote: '顧客評語',
    reviewer_name: '顧客名稱',
    response_message: '回覆訊息',
    behind_story: '幕後故事',
    effort_description: '用心描述',
    fun_detail: '趣味細節',
    event_description: '活動描述',
    hours: '時數',
    offer_detail: '優惠詳情',
    time_range: '時間範圍',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
            <LayoutTemplate className="w-6 h-6" />
          </span>
          貼文模板庫
        </h1>
        <p className="text-muted-foreground mt-2">選模板、填空、一鍵發文！各種情境都有現成模板</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          全部（{POST_TEMPLATES.length}）
        </button>
        {POST_TYPES.map(type => {
          const count = POST_TEMPLATES.filter(t => t.type === type.value).length;
          if (count === 0) return null;
          return (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === type.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              {type.icon} {type.label}（{count}）
            </button>
          );
        })}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((template, i) => {
          const typeInfo = POST_TYPES.find(t => t.value === template.type);
          const isActive = activeTemplate === template.id;

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Card className={`h-full transition-all duration-200 ${isActive ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span>{typeInfo?.icon}</span>
                      {template.title}
                    </CardTitle>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                      {template.platform === 'both' ? 'FB + IG' : template.platform === 'facebook' ? 'FB' : 'IG'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Template Preview */}
                  <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground whitespace-pre-wrap max-h-32 overflow-hidden relative">
                    {template.template.slice(0, 200)}...
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/50 to-transparent" />
                  </div>

                  {/* Image suggestion */}
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Image className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{template.suggestedImage}</span>
                  </div>

                  {/* Variables needed */}
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map(v => (
                      <span key={v} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {varLabels[v] || v}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleFillTemplate(template.id)}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" /> 使用模板
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {typeInfo?.icon} {template.title}
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
                          {/* Fill Variables */}
                          <div className="space-y-3">
                            <p className="text-sm font-medium">填寫以下欄位：</p>
                            {template.variables.map(v => (
                              <div key={v} className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">
                                  {varLabels[v] || v}
                                </label>
                                <Input
                                  placeholder={`請輸入${varLabels[v] || v}...`}
                                  value={filledVars[v] || ''}
                                  onChange={(e) => setFilledVars(prev => ({ ...prev, [v]: e.target.value }))}
                                />
                              </div>
                            ))}
                          </div>

                          <Button onClick={() => handlePreview(template)} className="w-full">
                            <Eye className="w-4 h-4 mr-2" /> 預覽文案
                          </Button>

                          {/* Preview */}
                          {previewContent && (
                            <div className="space-y-3">
                              <div className="bg-muted/50 rounded-xl p-4 whitespace-pre-wrap text-sm leading-relaxed">
                                {previewContent}
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => handleCopy(previewContent)}
                                className="w-full"
                              >
                                <Copy className="w-4 h-4 mr-2" /> 複製文案
                              </Button>
                            </div>
                          )}

                          {/* Image Direction */}
                          <div className="bg-amber-50 rounded-lg p-3 flex items-start gap-2">
                            <Image className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-amber-800">素材建議</p>
                              <p className="text-xs text-amber-700 mt-0.5">{template.suggestedImage}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(template.template)}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
