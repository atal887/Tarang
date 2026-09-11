import { cn } from "../../lib/utils";
import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  text: string | React.ReactNode;
  isBot?: boolean;
  className?: string;
}

export function ChatBubble({ text, isBot = false, className }: ChatBubbleProps) {
  return (
    <div className={cn("flex w-full gap-3", isBot ? "justify-start" : "justify-end", className)}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-ocean-100 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-ocean-700" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-2xl p-4 text-[15px] leading-relaxed shadow-sm",
        isBot 
          ? "bg-white border border-slate-100 text-slate-800 rounded-tl-sm" 
          : "bg-ocean-600 text-white rounded-tr-sm"
      )}>
        {text}
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
           <User className="w-4 h-4 text-slate-500" />
        </div>
      )}
    </div>
  );
}
