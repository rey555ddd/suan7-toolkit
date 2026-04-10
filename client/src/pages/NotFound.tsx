import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-rice">
      <Card className="w-full max-w-lg mx-4 shadow-xl border border-border bg-card">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="text-6xl mb-4">🐟</div>
          <h1 className="font-serif text-5xl font-black text-chili mb-2">404</h1>
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            哎呀，這條魚游走了！
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            你要找的頁面不存在，可能已經被移除或搬家了。
            <br />
            不如回首頁看看其他好用的工具吧！
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            回到首頁
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
