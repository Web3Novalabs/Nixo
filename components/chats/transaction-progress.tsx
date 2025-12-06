import type React from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

export type TransferStatus =
  | "generating"
  | "signing"
  | "downloading"
  | "confirming"
  | "withdrawing"
  | "success"
  | "error";

interface TransactionProgressProps {
  currentStatus: TransferStatus;
}

const steps = [
  { id: "generating", label: "Generating", emoji: "⏳" },
  { id: "signing", label: "Signing", emoji: "✍️" },
  { id: "downloading", label: "Downloading", emoji: "📥" },
  { id: "confirming", label: "Confirming", emoji: "⏱️" },
  { id: "withdrawing", label: "Withdrawing", emoji: "🔒" },
] as const;

export default function TransactionProgress({
  currentStatus,
}: TransactionProgressProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStatus);
  const isError = currentStatus === "error";
  const isSuccess = currentStatus === "success";

  return (
    <div className="w-full max-w-md bg-slate-800/50 rounded-xl p-4 border border-purple-500/20">
      <div className="space-y-3">
        {/* Progress Bar */}
        <div className="relative">
          <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${
                isError
                  ? "bg-red-500"
                  : isSuccess
                  ? "bg-green-500"
                  : "bg-gradient-to-r from-purple-600 to-purple-400"
              }`}
              style={{
                width: isSuccess
                  ? "100%"
                  : isError
                  ? "0%"
                  : `${((currentStepIndex + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="flex justify-between items-start">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-1 flex-1"
              >
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : isCurrent
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/40 animate-pulse"
                      : "bg-slate-700/50 text-slate-500 border border-slate-600/50"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={14} />
                  ) : isCurrent ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Circle size={14} />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-medium transition-colors ${
                    isCompleted
                      ? "text-green-400"
                      : isCurrent
                      ? "text-purple-400"
                      : "text-slate-500"
                  }`}
                >
                  {step.emoji}
                </span>
                <span
                  className={`text-[10px] text-center transition-colors hidden sm:block ${
                    isCompleted
                      ? "text-green-400/70"
                      : isCurrent
                      ? "text-purple-400/70"
                      : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Status Message */}
        {isSuccess && (
          <div className="text-center text-sm text-green-400 font-medium animate-in fade-in duration-300">
            ✅ Transfer completed successfully!
          </div>
        )}
        {isError && (
          <div className="text-center text-sm text-red-400 font-medium animate-in fade-in duration-300">
            ❌ Transfer failed
          </div>
        )}
      </div>
    </div>
  );
}
