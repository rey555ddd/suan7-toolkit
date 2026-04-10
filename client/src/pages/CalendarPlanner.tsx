import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { POST_TYPES, BEST_POST_TIMES } from '@/lib/brandData';

interface CalendarEntry {
  date: string;
  day: number;
  weekday: string;
  time: string;
  platform: string;
  postType: string;
  topic: string;
  brief: string;
  imageDirection: string;
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const MONTHS = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];

export default function CalendarPlanner() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [postsPerWeek, setPostsPerWeek] = useState('4');
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [generated, setGenerated] = useState(false);

  const calendarMutation = trpc.ai.generateCalendar.useMutation({
    onSuccess: (data) => {
      setEntries(data);
      setGenerated(true);
      toast.success(`已生成 ${year}年${month}月 的社群行事曆！共 ${data.length} 篇貼文`);
    },
    onError: (err) => {
      toast.error(`生成失敗：${err.message}`);
    },
  });

  const handleGenerate = () => {
    calendarMutation.mutate({ year, month, postsPerWeek: parseInt(postsPerWeek) });
  };

  const handlePrevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setGenerated(false);
  };

  const handleNextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setGenerated(false);
  };

  const handleExport = () => {
    if (entries.length === 0) return;
    const header = '日期,星期,時間,平台,類型,主題,簡述,素材方向';
    const rows = entries.map(e => {
      const typeLabel = POST_TYPES.find(t => t.value === e.postType)?.label || e.postType;
      return `${e.date},${e.weekday},${e.time},${e.platform === 'facebook' ? 'FB' : 'IG'},${typeLabel},"${e.topic}","${e.brief}","${e.imageDirection}"`;
    });
    const csv = '\uFEFF' + [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `酸小七_社群行事曆_${year}年${month}月.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('行事曆已匯出為 CSV！');
  };

  // Calendar grid data
  const calendarGrid = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const grid: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(d);
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  }, [year, month]);

  const getEntriesForDay = (day: number) => entries.filter(e => e.day === day);

  const typeColor: Record<string, string> = {
    new_product: 'bg-red-100 text-red-700 border-red-200',
    promotion: 'bg-orange-100 text-orange-700 border-orange-200',
    daily: 'bg-blue-100 text-blue-700 border-blue-200',
    festival: 'bg-pink-100 text-pink-700 border-pink-200',
    review: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    behind_scenes: 'bg-purple-100 text-purple-700 border-purple-200',
    event: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    limited_offer: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
            <CalendarDays className="w-6 h-6" />
          </span>
          社群行事曆排程
        </h1>
        <p className="text-muted-foreground mt-2">自動規劃月度貼文，標好幾號幾點發什麼，附上最佳發文時段建議</p>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Month Selector */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-center min-w-[140px]">
                <span className="font-serif font-bold text-lg">{year} 年 {MONTHS[month - 1]}</span>
              </div>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Posts per week */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">每週發文：</span>
              <Select value={postsPerWeek} onValueChange={setPostsPerWeek}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 篇</SelectItem>
                  <SelectItem value="4">4 篇</SelectItem>
                  <SelectItem value="5">5 篇</SelectItem>
                  <SelectItem value="7">每天</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 sm:ml-auto">
              <Button onClick={handleGenerate} disabled={calendarMutation.isPending} className="bg-primary hover:bg-primary/90">
                {calendarMutation.isPending ? (
                  <><Sparkles className="w-4 h-4 mr-2 animate-spin" /> Gemini 規劃中...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> 生成行事曆</>
                )}
              </Button>
              {generated && (
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" /> 匯出 CSV
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Post Times */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" /> 最佳發文時段參考
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {BEST_POST_TIMES.map(t => (
              <div key={t.time} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                <span className="font-mono font-bold text-sm text-primary">{t.time}</span>
                <span className="text-xs text-muted-foreground">{t.label} — {t.reason}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      {generated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {year} 年 {MONTHS[month - 1]} — 共 {entries.length} 篇貼文
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop Calendar */}
              <div className="hidden md:block">
                <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
                  {['日','一','二','三','四','五','六'].map(d => (
                    <div key={d} className="bg-muted px-2 py-2 text-center text-xs font-medium text-muted-foreground">
                      {d}
                    </div>
                  ))}
                  {calendarGrid.map((day, i) => {
                    const dayEntries = day ? getEntriesForDay(day) : [];
                    return (
                      <div
                        key={i}
                        className={`bg-card min-h-[100px] p-2 ${!day ? 'bg-muted/30' : ''}`}
                      >
                        {day && (
                          <>
                            <span className={`text-xs font-medium ${dayEntries.length > 0 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                              {day}
                            </span>
                            <div className="mt-1 space-y-1">
                              {dayEntries.map((entry, j) => (
                                <div
                                  key={j}
                                  className={`text-xs px-1.5 py-1 rounded border ${typeColor[entry.postType] || 'bg-gray-100 text-gray-700'} truncate`}
                                  title={`${entry.time} | ${entry.platform === 'facebook' ? 'FB' : 'IG'} | ${entry.topic}`}
                                >
                                  <span className="font-mono">{entry.time}</span> {entry.topic.slice(0, 8)}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile List */}
              <div className="md:hidden space-y-2">
                {entries.map((entry, i) => {
                  const typeInfo = POST_TYPES.find(t => t.value === entry.postType);
                  return (
                    <div key={i} className={`rounded-lg border p-3 ${typeColor[entry.postType] || ''}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">{entry.date} {entry.weekday}</span>
                        <span className="text-xs font-mono bg-white/60 px-2 py-0.5 rounded">{entry.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-white/60 px-2 py-0.5 rounded">{entry.platform === 'facebook' ? 'FB' : 'IG'}</span>
                        <span className="text-xs">{typeInfo?.icon} {typeInfo?.label}</span>
                      </div>
                      <p className="text-sm font-medium">{entry.topic}</p>
                      <p className="text-xs opacity-80 mt-0.5">{entry.brief}</p>
                      <p className="text-xs opacity-60 mt-1 italic">素材：{entry.imageDirection}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
