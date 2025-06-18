import React from 'react';
import Link from 'next/link';

interface ButtonRedirectProps {
  url: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function ButtonRedirect({ url, children, className = '', variant = 'primary' }: ButtonRedirectProps) {
  // Variant styles
  const variantStyles = {
    primary: 'bg-[#E29578] hover:bg-[#E29578]/90 text-white',
    secondary: 'bg-[#83C5BE] hover:bg-[#83C5BE]/80 text-white',
    outline: 'border border-[#E29578] text-[#E29578] hover:bg-[#E29578]/10',
  };

  return (
    <Link href={url} passHref>
      <button
        className={`
          px-6 py-2 rounded-lg font-medium transition-all duration-200
          shadow-md hover:shadow-lg active:scale-95
          flex items-center justify-center gap-2
          ${variantStyles[variant]} ${className}
        `}
      >
        {children}
      </button>
    </Link>
  );
}

// Example usage:
// <ButtonRedirect url="/dashboard" variant="primary">
//   Go to Dashboard
// </ButtonRedirect>




interface CardUserProps {
  url: string;
  name: string;
  img: string;
}

export function CardUser({ url, name, img }: CardUserProps) {
  return (
    <div className="max-w-sm bg-white rounded-2xl shadow-md p-4 text-center">
      <img
        src={img}
        alt={`${name} Avatar`}
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <a href={url}>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Book Now
        </button>
      </a>
    </div>
  );
}

export default CardUser;
