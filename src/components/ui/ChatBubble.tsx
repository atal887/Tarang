import { cn } from "../../lib/utils";
import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  text: string | React.ReactNode;
  isBot?: boolean;
  className?: string;
}

export function ChatBubble({ text, isBot = false, className }: ChatBubbleProps) {
  return (
    <div className={cn("flex w-full gap-2 sm:gap-3", isBot ? "justify-start" : "justify-end", className)}>
      {isBot && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ocean-100 flex items-center justify-center shrink-0 mt-0.5">
          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ocean-700" />
        </div>
      )}
      
      <div className={cn(
        "w-full max-w-[95%] sm:max-w-[88%] md:max-w-[82%] rounded-2xl p-3.5 sm:p-4 text-[14px] sm:text-[15px] leading-relaxed shadow-sm",
        isBot 
          ? "bg-white border border-slate-100 text-slate-800 rounded-tl-sm" 
          : "bg-ocean-600 text-white rounded-tr-sm ml-auto"
      )}>
        {text}
      </div>

      {!isBot && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
           <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
        </div>
      )}
    </div>
  );
}
