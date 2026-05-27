import { Check } from 'lucide-react';

const Timeline = ({ steps, currentStep }) => {
  return (
    <div className="relative ml-3">
      {/* Vertical Line */}
      <div className="absolute top-2 left-[15px] bottom-2 w-0.5 bg-[#E2E8F0]" />

      <div className="space-y-8 relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <div key={index} className="flex gap-4">
              {/* Icon / Circle */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#22C55E] border-[#22C55E] text-white shadow-md'
                      : isCurrent
                      ? 'bg-white border-[#1D4ED8] text-[#1D4ED8] ring-4 ring-[#EFF6FF]'
                      : 'bg-white border-[#E2E8F0] text-[#94A3B8]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 font-bold" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-1.5 pb-2">
                <h4
                  className={`text-sm font-bold mb-1 ${
                    isCompleted || isCurrent ? 'text-[#0F172A]' : 'text-[#64748B]'
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {step.description}
                </p>
                {step.timestamp && (
                  <p className="text-[10px] text-[#94A3B8] font-medium mt-1">
                    {step.timestamp}
                  </p>
                )}
                {step.extraContent && (
                  <div className="mt-2">{step.extraContent}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
