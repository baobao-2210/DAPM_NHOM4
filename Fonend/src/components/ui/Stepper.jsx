import { Check } from 'lucide-react';

const Stepper = ({ steps, currentStep, className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    {steps.map((step, index) => {
      const isCompleted = index < currentStep;
      const isActive = index === currentStep;
      const isLast = index === steps.length - 1;

      return (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            {/* Circle */}
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                transition-all duration-300
                ${isCompleted
                  ? 'bg-[#1D4ED8] text-white shadow-md shadow-[#1D4ED8]/20'
                  : isActive
                    ? 'bg-[#1D4ED8] text-white shadow-lg shadow-[#1D4ED8]/30 ring-4 ring-[#1D4ED8]/10'
                    : 'bg-[#F1F5F9] text-[#94A3B8] border-2 border-[#E2E8F0]'
                }
              `}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            {/* Label */}
            <span
              className={`
                mt-2 text-xs font-medium max-w-[100px] text-center
                ${isActive ? 'text-[#1D4ED8]' : isCompleted ? 'text-[#0F172A]' : 'text-[#94A3B8]'}
              `}
            >
              {step}
            </span>
          </div>

          {/* Connector line */}
          {!isLast && (
            <div
              className={`
                w-16 sm:w-24 h-0.5 mx-2 mt-[-20px]
                transition-all duration-300
                ${isCompleted ? 'bg-[#1D4ED8]' : 'bg-[#E2E8F0]'}
              `}
            />
          )}
        </div>
      );
    })}
  </div>
);

export default Stepper;
