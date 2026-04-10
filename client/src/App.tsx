import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import PostGenerator from "./pages/PostGenerator";
import TemplateLibrary from "./pages/TemplateLibrary";
import CalendarPlanner from "./pages/CalendarPlanner";
import EventWizard from "./pages/EventWizard";
import AssetGuide from "./pages/AssetGuide";
import CompetitorWall from "./pages/CompetitorWall";
import PostChecker from "./pages/PostChecker";
import Feedback from "./pages/Feedback";
import ImageCreator from "./pages/ImageCreator";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/post-generator" component={PostGenerator} />
      <Route path="/templates" component={TemplateLibrary} />
      <Route path="/calendar" component={CalendarPlanner} />
      <Route path="/event-wizard" component={EventWizard} />
      <Route path="/asset-guide" component={AssetGuide} />
      <Route path="/competitors" component={CompetitorWall} />
      <Route path="/post-checker" component={PostChecker} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/image-creator" component={ImageCreator} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AppLayout>
            <Router />
          </AppLayout>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
