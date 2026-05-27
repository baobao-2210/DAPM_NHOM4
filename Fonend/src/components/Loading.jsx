const Loading = ({ fullscreen = true, text }) => {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-[#F8FAFC]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#E2E8F0]" />
          <div className="absolute inset-0 rounded-full border-4 border-[#1D4ED8] border-t-transparent animate-spin" />
        </div>
        {text && (
          <p className="text-sm font-medium text-[#64748B]">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-[#E2E8F0]" />
        <div className="absolute inset-0 rounded-full border-4 border-[#1D4ED8] border-t-transparent animate-spin" />
      </div>
      {text && (
        <p className="text-sm font-medium text-[#64748B]">{text}</p>
      )}
    </div>
  );
};

export default Loading;
