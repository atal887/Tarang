import { ShieldAlert, MapIcon, Route } from "lucide-react";

export function History() {
  const historyItems = [
    {
      title: "3-Day Trip Analysis",
      subtitle: "Kochi · 3 days",
      status: "Caution",
      icon: ShieldAlert,
      color: "text-status-caution",
      bg: "bg-status-cautionBg"
    },
    {
      title: "Nearest Fishing Zone",
      subtitle: "Kochi",
      status: "Low Risk",
      icon: MapIcon,
      color: "text-ocean-600",
      bg: "bg-ocean-50"
    },
    {
      title: "Safe Route",
      subtitle: "Kochi Harbour → Fishing Zone",
      status: "Low Risk",
      icon: Route,
      color: "text-status-safe",
      bg: "bg-status-safeBg"
    }
  ];

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto pb-24 animate-in fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">History</h1>
        <p className="text-sm text-slate-500 mt-1">Your previous TARANG interactions.</p>
      </header>
      
      <div className="space-y-3">
        {historyItems.map((item, idx) => (
          <div key={idx} className="flex items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
            <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center shrink-0 mr-4`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold uppercase ${item.color}`}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
