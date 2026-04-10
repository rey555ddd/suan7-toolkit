import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquarePlus, ThumbsUp, Loader2, CheckCircle2,
  Bug, Lightbulb, Sparkles, HelpCircle, Send, ArrowLeft,
  Clock, ChevronDown
} from 'lucide-react';
import { Link } from 'wouter';
import { toast } from 'sonner';

const TYPE_CONFIG = {
  feature: { label: '功能需求', icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-700' },
  bug: { label: '問題回報', icon: Bug, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700' },
  improvement: { label: '改善建議', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  other: { label: '其他', icon: HelpCircle, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-700' },
} as const;

type SuggestionType = keyof typeof TYPE_CONFIG;

const STATUS_CONFIG = {
  pending: { label: '待審核', color: 'bg-slate-100 text-slate-600' },
  reviewing: { label: '審核中', color: 'bg-blue-100 text-blue-700' },
  done: { label: '已完成', color: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: '暫不處理', color: 'bg-red-100 text-red-600' },
};

export default function Feedback() {
  const [name, setName] = useState('');
  const [type, setType] = useState<SuggestionType>('feature');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const { data: suggestions = [], isLoading, refetch } = trpc.suggestions.list.useQuery();

  const createMutation = trpc.suggestions.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setName('');
      setContent('');
      refetch();
    },
    onError: (err) => {
      toast.error('送出失敗：' + err.message);
    },
  });

  const likeMutation = trpc.suggestions.like.useMutation({
    onSuccess: (_, variables) => {
      setLikedIds(prev => { const next = new Set(Array.from(prev)); next.add(variables.id); return next; });
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast.error('請填寫暱稱和建議內容');
      return;
    }
    createMutation.mutate({ name: name.trim(), type, content: content.trim() });
  };

  const displayedSuggestions = showAll ? suggestions : suggestions.slice(0, 6);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 30%, #e0e7ff 100%)' }}>
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-2xl" />
        </div>
        <div className="relative container mx-auto px-4 py-12 sm:py-16">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> 返回首頁
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <MessageSquarePlus className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-black">修改建議區</h1>
              <p className="text-white/75 text-sm mt-1">你的每一條建議，都讓工具更好用</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl text-sm">
              💡 功能需求
            </div>
            <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl text-sm">
              🐛 問題回報
            </div>
            <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl text-sm">
              ✨ 改善建議
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full block">
            <path d="M0 40L1440 0V40H0Z" style={{ fill: '#f5f3ff' }} />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ===== 左側：投稿表單 ===== */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-3xl shadow-xl border border-violet-100 p-8 text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-emerald-50 rounded-full">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      </div>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">感謝你的建議！</h3>
                    <p className="text-muted-foreground text-sm mb-6">我們會認真閱讀每一條留言，持續改善工具體驗。</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      繼續留言
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="bg-white rounded-3xl shadow-xl border border-violet-100 p-6 space-y-5"
                  >
                    <div>
                      <h2 className="font-serif text-lg font-bold text-foreground mb-1">留下你的建議</h2>
                      <p className="text-xs text-muted-foreground">不需要登入，直接留言即可</p>
                    </div>

                    {/* 暱稱 */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">你的暱稱</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="例如：小七粉絲、桃園店小編..."
                        maxLength={50}
                        className="w-full px-4 py-2.5 rounded-xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm bg-violet-50/30 placeholder:text-muted-foreground/50"
                      />
                    </div>

                    {/* 類型選擇 */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">建議類型</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.entries(TYPE_CONFIG) as [SuggestionType, typeof TYPE_CONFIG[SuggestionType]][]).map(([key, cfg]) => {
                          const Icon = cfg.icon;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setType(key)}
                              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
                                type === key
                                  ? `${cfg.border} ${cfg.bg} ${cfg.color} shadow-sm`
                                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-violet-200'
                              }`}
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              {cfg.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 內容 */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">建議內容</label>
                      <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="請詳細描述你的功能需求、問題或建議，越具體越好！"
                        rows={5}
                        maxLength={2000}
                        className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm bg-violet-50/30 placeholder:text-muted-foreground/50 resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-right">{content.length}/2000</p>
                    </div>

                    <button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-violet-200"
                    >
                      {createMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> 送出中...</>
                      ) : (
                        <><Send className="w-4 h-4" /> 送出建議</>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ===== 右側：建議列表 ===== */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-foreground">
                大家的建議
                {suggestions.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">
                    {suggestions.length} 則
                  </span>
                )}
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
              </div>
            ) : suggestions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl border border-violet-100 p-12 text-center"
              >
                <div className="text-5xl mb-4">💬</div>
                <p className="font-serif text-lg font-bold text-foreground mb-2">還沒有建議</p>
                <p className="text-muted-foreground text-sm">成為第一個留言的人！</p>
              </motion.div>
            ) : (
              <>
                <AnimatePresence>
                  {displayedSuggestions.map((s, i) => {
                    const cfg = TYPE_CONFIG[s.type as SuggestionType] ?? TYPE_CONFIG.other;
                    const statusCfg = STATUS_CONFIG[s.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
                    const Icon = cfg.icon;
                    const isLiked = likedIds.has(s.id);

                    return (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl border border-violet-100 p-5 hover:shadow-md hover:border-violet-200 transition-all duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 p-2 rounded-xl ${cfg.bg}`}>
                            <Icon className={`w-4 h-4 ${cfg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-semibold text-sm text-foreground">{s.name}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                                {cfg.label}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.color}`}>
                                {statusCfg.label}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{s.content}</p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {new Date(s.createdAt).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <button
                                onClick={() => !isLiked && likeMutation.mutate({ id: s.id })}
                                disabled={isLiked || likeMutation.isPending}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                                  isLiked
                                    ? 'bg-violet-100 text-violet-700 cursor-default'
                                    : 'bg-slate-50 text-slate-500 hover:bg-violet-50 hover:text-violet-600 border border-slate-100 hover:border-violet-200'
                                }`}
                              >
                                <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-violet-500' : ''}`} />
                                {s.likes}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {suggestions.length > 6 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm text-violet-600 font-medium hover:bg-violet-50 rounded-2xl transition-colors border border-violet-100 bg-white"
                  >
                    {showAll ? '收起' : `查看全部 ${suggestions.length} 則建議`}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
