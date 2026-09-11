import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-slate-50 font-sans">
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto space-y-16">
        
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">TARANG</h1>
          <p className="text-xl font-medium text-ocean-600">Ocean data. Clear answers.</p>
        </div>
        
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <Button size="lg" className="w-full text-lg h-14 shadow-lg shadow-ocean-600/20 rounded-xl font-bold" onClick={() => navigate("/onboarding")}>
            Get Started
          </Button>
        </div>

      </div>
    </div>
  );
}
