import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { BRAND } from '@/lib/brandData';
import {
  PenLine, LayoutTemplate, CalendarDays, Wand2,
  Image, Users, ClipboardCheck, Home, Menu, X, ChevronRight,
  MessageSquarePlus, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackBubble from '@/components/FeedbackBubble';

const NAV_ITEMS = [
  { path: '/', label: '首頁', icon: Home, gradient: 'from-slate-500 to-gray-600' },
  { path: '/post-generator', label: '小編助手', icon: PenLine, gradient: 'from-red-500 to-rose-600' },
  { path: '/templates', label: '貼文模板庫', icon: LayoutTemplate, gradient: 'from-amber-500 to-orange-600' },
  { path: '/calendar', label: '行事曆排程', icon: CalendarDays, gradient: 'from-emerald-500 to-green-600' },
  { path: '/event-wizard', label: '活動企劃精靈', icon: Wand2, gradient: 'from-rose-500 to-pink-600' },
  { path: '/asset-guide', label: '素材方向生成', icon: Image, gradient: 'from-yellow-500 to-amber-600' },
  { path: '/competitors', label: '競品參考牆', icon: Users, gradient: 'from-slate-500 to-gray-600' },
  { path: '/post-checker', label: '發文檢查清單', icon: ClipboardCheck, gradient: 'from-teal-500 to-cyan-600' },
  { path: '/image-creator', label: '圖片素材生成', icon: Sparkles, gradient: 'from-violet-500 to-fuchsia-600' },
];

const FEEDBACK_ITEM = { path: '/feedback', label: '修改建議區', icon: MessageSquarePlus, gradient: 'from-violet-600 to-indigo-600' };


/**
 * 首頁浮動導航列（透明背景，覆蓋在 Hero 上方）
 */
function HomeNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const quickLinks = [
    { path: '/post-generator', label: '小編助手' },
    { path: '/templates', label: '模板庫' },
    { path: '/calendar', label: '行事曆' },
    { path: '/event-wizard', label: '活動企劃' },
    { path: '/feedback', label: '修改建議' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src={BRAND.logoSmallUrl}
              alt={BRAND.name}
              className="w-9 h-9 object-contain rounded-lg"
            />
            <div>
              <span className="font-serif text-sm font-bold text-gray-900">
                {BRAND.name}
              </span>
              <span className="hidden sm:inline text-xs text-gray-400 ml-1.5">
                小編工具箱
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {quickLinks.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} className="text-gray-700" /> : <Menu size={20} className="text-gray-700" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/feedback"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-violet-600 hover:bg-violet-50 rounded-lg transition-colors font-medium mt-1 border-t border-gray-100 pt-3"
              onClick={() => setMobileOpen(false)}
            >
              <MessageSquarePlus className="w-4 h-4" />
              修改建議區
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Home page has its own full layout
  if (location === '/') {
    return (
      <>
        <HomeNavbar />
        {children}
        <FeedbackBubble />
      </>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-card border-r border-border
          flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-border">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src={BRAND.logoSmallUrl}
              alt={BRAND.name}
              className="w-11 h-11 object-contain rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
            />
            <div>
              <h1 className="font-serif text-lg font-bold text-foreground leading-tight">
                {BRAND.name}
              </h1>
              <p className="text-xs text-muted-foreground">社群小編工具箱</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-br ${item.gradient} text-white shadow-sm`
                      : 'bg-muted/50 text-muted-foreground group-hover:bg-muted'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-primary" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Feedback special button */}
        <div className="px-3 pb-3">
          <Link
            href={FEEDBACK_ITEM.path}
            onClick={() => setSidebarOpen(false)}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${
                location === FEEDBACK_ITEM.path
                  ? 'bg-violet-100 text-violet-700 shadow-sm'
                  : 'bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-600 hover:from-violet-100 hover:to-indigo-100 border border-violet-200'
              }`}
          >
            <div className={`p-1.5 rounded-lg transition-all duration-200 ${
              location === FEEDBACK_ITEM.path
                ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm'
                : 'bg-violet-100 text-violet-600 group-hover:bg-gradient-to-br group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:text-white'
            }`}>
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <span className="flex-1 font-semibold">{FEEDBACK_ITEM.label}</span>
            {location === FEEDBACK_ITEM.path && <ChevronRight className="w-4 h-4 text-violet-600" />}
          </Link>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-center">
            <p className="font-serif font-bold text-sm text-foreground">{BRAND.slogan}</p>
            <p className="text-xs text-muted-foreground mt-1">酸小七品牌專屬工具</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img src={BRAND.logoSmallUrl} alt="" className="w-8 h-8 object-contain rounded" />
          <span className="font-serif font-bold text-sm text-foreground">{BRAND.name}｜小編工具箱</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <FeedbackBubble />
    </div>
  );
}
