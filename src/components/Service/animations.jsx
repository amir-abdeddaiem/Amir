"use client";

export function FadeInContainer({ children, delay = 0, className = "" }) {
  const style = {
    animation: `fadeIn 0.6s ease-out forwards`,
    animationDelay: `${delay}ms`,
    opacity: 0,
  };

  return (
    <div className={className} style={style}>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {children}
    </div>
  );
}

export function AnimatedGrid({ children, className = "" }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ${className}`}
    >
      {children.map((child, index) => (
        <FadeInContainer key={index} delay={index * 100}>
          {child}
        </FadeInContainer>
      ))}
    </div>
  );
}
