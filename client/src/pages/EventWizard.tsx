import { useState } from 'react';
import { EVENT_TYPES, EVENT_GOALS, BUDGET_RANGES } from '@/lib/brandData';
import { trpc } from '@/lib/trpc';

interface EventPlan {
  title: string;
  objective: string;
  duration: string;
  budget: string;
  phases: { phase: string; tasks: string[]; timeline: string }[];
  socialPlan: { platform: string; content: string; frequency: string }[];
  kpis: string[];
  materials: string[];
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, ArrowRight, ArrowLeft, Check, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { id: 1, title: '活動類型', desc: '你想辦什麼類型的活動？' },
  { id: 2, title: '活動目標', desc: '這次活動的主要目標是什麼？' },
  { id: 3, title: '預算規劃', desc: '這次活動的預算大概多少？' },
  { id: 4, title: '活動時間', desc: '活動預計什麼時候舉辦？持續多久？' },
  { id: 5, title: '補充說明', desc: '還有什麼特別需求或注意事項嗎？' },
];

export default function EventWizard() {
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState('');
  const [goal, setGoal] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [plan, setPlan] = useState<EventPlan | null>(null);

  const eventPlanMutation = trpc.ai.generateEventPlan.useMutation({
    onSuccess: (data) => {
      setPlan(data);
      setStep(6);
      toast.success('企劃書已生成！');
    },
    onError: (err) => {
      toast.error(`生成失敗：${err.message}`);
    },
  });

  const canNext = () => {
    switch (step) {
      case 1: return !!eventType;
      case 2: return !!goal;
      case 3: return !!budget;
      case 4: return !!duration;
      case 5: return true;
      default: return false;
    }
  };

  const handleGenerate = () => {
    eventPlanMutation.mutate({
      eventType,
      goal,
      budget,
      duration,
      customNotes: notes || undefined,
    });
  };

  const handleCopyPlan = () => {
    if (!plan) return;
    const text = [
      plan.title,
      '',
      `目標：${plan.objective}`,
      `期間：${plan.duration}`,
      `預算：${plan.budget}`,
      '',
      '=== 執行階段 ===',
      ...plan.phases.map(p => `\n【${p.phase}】${p.timeline}\n${p.tasks.map(t => `- ${t}`).join('\n')}`),
      '',
      '=== 社群配套 ===',
      ...plan.socialPlan.map(s => `${s.platform}：${s.content}\n頻率：${s.frequency}`),
      '',
      '=== KPI 指標 ===',
      ...plan.kpis.map(k => `- ${k}`),
      '',
      '=== 所需素材 ===',
      ...plan.materials.map(m => `- ${m}`),
    ].join('\n');
    navigator.clipboard.writeText(text);
    toast.success('企劃書已複製！');
  };

  const handleReset = () => {
    setStep(1);
    setEventType('');
    setGoal('');
    setBudget('');
    setDuration('');
    setNotes('');
    setPlan(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <span className="p-2 bg-rose-100 text-rose-700 rounded-xl">
            <Wand2 className="w-6 h-6" />
          </span>
          活動企劃精靈
        </h1>
        <p className="text-muted-foreground mt-2">跟著問答一步步完成完整活動企劃，新手也能輕鬆上手</p>
      </div>

      {/* Progress */}
      {step <= 5 && (
        <div className="flex items-center gap-1">
          {STEPS.map((s) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors
                ${step > s.id ? 'bg-primary text-primary-foreground' : step === s.id ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 'bg-muted text-muted-foreground'}`}>
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </div>
              {s.id < 5 && <div className={`h-0.5 flex-1 mx-1 ${step > s.id ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Event Type */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{STEPS[0].desc}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {EVENT_TYPES.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setEventType(type.value)}
                      className={`p-4 rounded-xl border-2 text-center transition-all hover:shadow-md
                        ${eventType === type.value ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/30'}`}
                    >
                      <span className="text-2xl block mb-2">{type.icon}</span>
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{STEPS[1].desc}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {EVENT_GOALS.map(g => (
                    <button
                      key={g.value}
                      onClick={() => setGoal(g.value)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-md
                        ${goal === g.value ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/30'}`}
                    >
                      <p className="font-bold text-sm">{g.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{g.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{STEPS[2].desc}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {BUDGET_RANGES.map(b => (
                    <button
                      key={b.value}
                      onClick={() => setBudget(b.value)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-md
                        ${budget === b.value ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/30'}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm">{b.label}</p>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">{b.range}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{b.suggestion}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Duration */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{STEPS[3].desc}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="例如：2026/5/1 ~ 2026/5/7（一週）"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="text-base"
                />
                <div className="flex flex-wrap gap-2">
                  {['一天', '三天', '一週', '兩週', '一個月'].map(d => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors
                        ${duration === d ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/30'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Notes */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{STEPS[4].desc}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="例如：希望結合川劇變臉表演、需要配合外送平台、有特定合作對象..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">沒有的話可以直接跳過，點擊「生成企劃」</p>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Result */}
          {step === 6 && plan && (
            <div className="space-y-4">
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopyPlan}>
                        <Copy className="w-3.5 h-3.5 mr-1.5" /> 複製
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        重新開始
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">活動目標</p>
                      <p className="text-sm font-medium mt-1">{plan.objective}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">活動期間</p>
                      <p className="text-sm font-medium mt-1">{plan.duration}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">預算方案</p>
                      <p className="text-sm font-medium mt-1">{BUDGET_RANGES.find(b => b.value === plan.budget)?.label} ({BUDGET_RANGES.find(b => b.value === plan.budget)?.range})</p>
                    </div>
                  </div>

                  {/* Phases */}
                  <div>
                    <h3 className="font-serif font-bold text-base mb-3">執行階段</h3>
                    <div className="space-y-3">
                      {plan.phases.map((phase, i) => (
                        <div key={i} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-sm">{phase.phase}</h4>
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">{phase.timeline}</span>
                          </div>
                          <ul className="space-y-1">
                            {phase.tasks.map((task, j) => (
                              <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Plan */}
                  <div>
                    <h3 className="font-serif font-bold text-base mb-3">社群配套方案</h3>
                    <div className="space-y-2">
                      {plan.socialPlan.map((sp, i) => (
                        <div key={i} className="bg-muted/50 rounded-lg p-3">
                          <p className="font-bold text-sm">{sp.platform}</p>
                          <p className="text-sm text-muted-foreground mt-1">{sp.content}</p>
                          <p className="text-xs text-primary mt-1">{sp.frequency}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KPIs */}
                  <div>
                    <h3 className="font-serif font-bold text-base mb-3">KPI 指標</h3>
                    <div className="flex flex-wrap gap-2">
                      {plan.kpis.map((kpi, i) => (
                        <span key={i} className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full">{kpi}</span>
                      ))}
                    </div>
                  </div>

                  {/* Materials */}
                  <div>
                    <h3 className="font-serif font-bold text-base mb-3">所需素材清單</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {plan.materials.map((mat, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          {mat}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {step <= 5 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> 上一步
          </Button>

          {step < 5 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
            >
              下一步 <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={eventPlanMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {eventPlanMutation.isPending ? (
                <><Wand2 className="w-4 h-4 mr-2 animate-spin" /> Gemini 生成中...</>
              ) : (
                <><Wand2 className="w-4 h-4 mr-2" /> 生成企劃</>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
