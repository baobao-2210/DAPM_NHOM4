import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ value = 0, onChange, readOnly = false, size = 'md' }) => {
  const [hover, setHover] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center gap-1 ${readOnly ? '' : 'cursor-pointer'}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            className="focus:outline-none transition-transform hover:scale-110 active:scale-95 disabled:hover:scale-100"
          >
            <Star
              className={`${currentSize} transition-colors duration-200 ${
                isFilled
                  ? 'text-[#FBBF24] fill-[#FBBF24]'
                  : 'text-[#E2E8F0] fill-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
