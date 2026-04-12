import { Link } from 'wouter';
import { BRAND, STORES } from '@/lib/brandData';
import { motion } from 'framer-motion';
import {
  PenLine, LayoutTemplate, CalendarDays, Wand2,
  Image, Users, ClipboardCheck, ArrowRight, ExternalLink,
  MapPin, Phone, Clock, Sparkles, MessageSquarePlus
} from 'lucide-react';

const HERO_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663032574653/D5ehzuf7EutQ28QkNh4Nrh/hero-banner-NKBoTWiYCSmFwfnAeDP5Lt.webp';
const EDITOR_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663032574653/D5ehzuf7EutQ28QkNh4Nrh/feature-editor-Krxkn34b27Y5jnHbcrHK6V.webp';
const CALENDAR_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663032574653/D5ehzuf7EutQ28QkNh4Nrh/feature-calendar-KiZfXhVb5yTLXHapFXLtPr.webp';
const WIZARD_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663032574653/D5ehzuf7EutQ28QkNh4Nrh/feature-wizard-UHv6x9oxgb3cGw8zm96VLa.webp';
const PATTERN_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663032574653/D5ehzuf7EutQ28QkNh4Nrh/pattern-ink-6kDhwoXaTvx9uoAVABjd6Z.webp';

const tools = [
  { path: '/post-generator', label: '小編助手', desc: 'FB/IG 社群貼文一鍵生成，融入品牌特色', icon: PenLine, gradient: 'from-red-500 to-rose-600', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700' },
  { path: '/templates', label: '貼文模板庫', desc: '各種情境模板，選模板、填空即發文', icon: LayoutTemplate, gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
  { path: '/calendar', label: '行事曆排程', desc: '月度社群行事曆自動規劃排程', icon: CalendarDays, gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
  { path: '/event-wizard', label: '活動企劃精靈', desc: '問答引導完成完整活動企劃書', icon: Wand2, gradient: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700' },
  { path: '/asset-guide', label: '素材方向生成', desc: '圖片影片素材具體拍攝指引', icon: Image, gradient: 'from-yellow-500 to-amber-600', bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-700' },
  { path: '/competitors', label: '競品參考牆', desc: '同類品牌熱門貼文策略參考', icon: Users, gradient: 'from-slate-500 to-gray-600', bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-700' },
  { path: '/post-checker', label: '發文檢查清單', desc: '發文前自動品質檢查評分', icon: ClipboardCheck, gradient: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-700' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0, 0, 0.2, 1] as const }
  }),
};

const featureHighlights = [
  {
    img: EDITOR_IMG,
    tag: '核心功能',
    tagIcon: PenLine,
    tagColor: 'bg-red-100 text-red-700',
    title: '小編助手 — 貼文生成器',
    desc: '選擇貼文類型和平台，一鍵生成融入酸小七品牌特色的社群文案。支援新品推薦、活動宣傳、日常互動、節慶祝福等 8 種類型，自動產生 Hashtag 和最佳發文時段建議。',
    link: '/post-generator',
    reverse: false,
  },
  {
    img: CALENDAR_IMG,
    tag: '排程規劃',
    tagIcon: CalendarDays,
    tagColor: 'bg-emerald-100 text-emerald-700',
    title: '行事曆排程 — 月度規劃',
    desc: '自動規劃整個月的發文內容，標好幾號幾點發什麼，附上最佳發文時段建議。結合台灣節慶行事曆，不再錯過任何行銷時機。支援匯出 CSV 方便團隊協作。',
    link: '/calendar',
    reverse: true,
  },
  {
    img: WIZARD_IMG,
    tag: '智能企劃',
    tagIcon: Wand2,
    tagColor: 'bg-amber-100 text-amber-700',
    title: '活動企劃精靈 — 問答引導',
    desc: '透過問答引導的方式，一步步帶領新手完成完整活動企劃。從活動類型、預算、目標到執行細節，自動產出專業的企劃書和社群配套方案。',
    link: '/event-wizard',
    reverse: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden min-h-[480px] sm:min-h-[560px]">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-20 pb-24 sm:pt-24 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center mb-5"
          >
            <img
              src={BRAND.logoUrl}
              alt={BRAND.name}
              className="h-24 sm:h-32 object-contain drop-shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-wide drop-shadow-lg">
              社群小編工具箱
            </h1>
            <p className="text-base sm:text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
              專為{BRAND.name}打造的社群經營神器<br />
              新手小編也能輕鬆駕馭
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            <Link href="/post-generator"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-red-700 font-bold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 text-sm sm:text-base"
            >
              <PenLine className="w-4 h-4" />
              開始寫貼文
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/calendar"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/15 backdrop-blur-sm text-white border border-white/30 font-bold rounded-full hover:bg-white/25 transition-all duration-200 text-sm sm:text-base"
            >
              <CalendarDays className="w-4 h-4" />
              規劃月度行事曆
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full block">
            <path d="M0 60L1440 0V60H0Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* ========== TOOLS GRID ========== */}
      <section className="container mx-auto px-4 py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> 七大武功秘笈
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground mb-3">
            選擇你需要的工具
          </h2>
          <p className="text-muted-foreground text-base">開始闖蕩社群江湖，每一招都是實戰利器</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.path}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link href={tool.path}
                  className={`group block p-6 rounded-2xl border ${tool.border} ${tool.bg} hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full relative overflow-hidden`}
                >
                  <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${tool.gradient} rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500`} />
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tool.gradient} text-white shadow-md mb-4`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className={`font-serif font-bold text-lg mb-1.5 ${tool.text}`}>{tool.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.desc}</p>
                    <div className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${tool.text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      開始使用 <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========== FEEDBACK HIGHLIGHT ========== */}
      <section className="container mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link href="/feedback"
            className="group block relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-1 transition-all duration-300"
          >
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-shrink-0 p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                <MessageSquarePlus className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">
                  ✨ 新功能
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2">修改建議區</h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-lg">
                  有任何功能需求、改善建議或問題回報？歡迎留言！
                  你的每一條建議都會被認真看待，幫助我們把工具做得更好。
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-white text-violet-700 font-bold rounded-xl shadow-lg group-hover:shadow-xl transition-shadow text-sm">
                前往留言 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* ========== FEATURE HIGHLIGHTS ========== */}
      <section
        className="relative py-16 sm:py-24"
        style={{ backgroundImage: `url(${PATTERN_IMG})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }}
      >
        <div className="absolute inset-0 bg-background/88" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground mb-3">
              核心功能一覽
            </h2>
            <p className="text-muted-foreground">三大核心模組，涵蓋社群經營的方方面面</p>
          </motion.div>

          <div className="space-y-20">
            {featureHighlights.map((feat, i) => {
              const TagIcon = feat.tagIcon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: feat.reverse ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col ${feat.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10`}
                >
                  <div className="lg:w-1/2">
                    <div className="relative group">
                      <div className={`absolute -inset-4 bg-gradient-to-br ${i === 0 ? 'from-red-200/40 to-amber-200/40' : i === 1 ? 'from-emerald-200/40 to-teal-200/40' : 'from-amber-200/40 to-rose-200/40'} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500`} />
                      <img src={feat.img} alt={feat.title} className="relative rounded-2xl shadow-2xl w-full max-w-lg mx-auto" />
                    </div>
                  </div>
                  <div className="lg:w-1/2 space-y-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${feat.tagColor} rounded-full text-sm font-medium`}>
                      <TagIcon className="w-4 h-4" /> {feat.tag}
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">{feat.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base">{feat.desc}</p>
                    <Link href={feat.link} className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all duration-200 text-sm">
                      立即使用 <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== STORE INFO ========== */}
      <section className="container mx-auto px-4 py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">門市資訊</h2>
          <p className="text-muted-foreground">酸小七全台門市一覽</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {STORES.map((store, i) => (
            <motion.div
              key={store.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="font-serif font-bold text-lg text-foreground mb-3">{store.name}</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{store.address}</span>
                </div>
                {store.phone && (
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{store.hours}</span>
                </div>
                {store.special && (
                  <div className="mt-3 px-3 py-2 bg-red-50 rounded-lg text-red-700 text-xs font-medium">
                    🎭 {store.special}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-ink text-white/80">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <img src={BRAND.logoUrl} alt={BRAND.name} className="h-14 object-contain" />
              <div>
                <p className="font-serif font-bold text-white text-xl">{BRAND.fullName}</p>
                <p className="text-sm text-white/50 mt-0.5">{BRAND.slogan}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a href={BRAND.social.facebook} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium">
                <ExternalLink className="w-3.5 h-3.5" /> Facebook
              </a>
              <a href={BRAND.social.instagram} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium">
                <ExternalLink className="w-3.5 h-3.5" /> Instagram
              </a>
              <a href={BRAND.social.website} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium">
                <ExternalLink className="w-3.5 h-3.5" /> 官網
              </a>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/30">
            <p>酸小七社群小編工具箱 — 品牌專屬內部工具</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
