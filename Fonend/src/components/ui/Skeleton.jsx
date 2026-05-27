const Skeleton = ({ variant = 'text', className = '', count = 1 }) => {
  const base = 'animate-pulse bg-[#E2E8F0] rounded-lg';

  const variants = {
    text: `${base} h-4 w-full`,
    title: `${base} h-6 w-3/4`,
    avatar: `${base} rounded-full`,
    card: `${base} rounded-2xl`,
    button: `${base} h-10 w-32 rounded-xl`,
    'table-row': `${base} h-12 w-full rounded-lg`,
  };

  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4 ${className}`}>
        <div className={`${base} h-4 w-1/3`} />
        <div className={`${base} h-8 w-1/2`} />
        <div className="space-y-2">
          <div className={`${base} h-3 w-full`} />
          <div className={`${base} h-3 w-4/5`} />
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    return <div className={`${variants.avatar} w-10 h-10 ${className}`} />;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={variants[variant]} />
      ))}
    </div>
  );
};

export default Skeleton;
