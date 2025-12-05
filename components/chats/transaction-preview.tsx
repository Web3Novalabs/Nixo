"use client";

import { MessageCircle, TrendingUp, Copy } from "lucide-react";

interface SuggestedActionsProps {
  onAction: (action: string) => void;
  isLoading?: boolean;
}

export default function SuggestedActions({
  onAction,
  isLoading = false,
}: SuggestedActionsProps) {
  const actions = [
    { icon: TrendingUp, label: "Check Balance", prompt: "What's my balance?" },
    { icon: MessageCircle, label: "Get Help", prompt: "Can you help me?" },
    { icon: Copy, label: "Transfer STRK", prompt: "Send 5 STRK to 0x..." },
  ];

  return (
    <div className="space-y-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={() => onAction(action.prompt)}
            disabled={isLoading}
            className="w-full flex items-center gap-3 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 text-slate-300 hover:text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium"
          >
            <Icon size={16} />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
