"use client";

export function AnimatedBackground({ children, className = "" }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background avec gradient intégré */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #EDF6F9 0%, #EDF6F9 50%, rgba(255, 221, 210, 0.3) 100%)",
        }}
      >
        {/* Pattern de points */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2383C5BE' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Éléments flottants animés */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-4 h-4 rounded-full animate-pulse"
          style={{ backgroundColor: "rgba(131, 197, 190, 0.2)" }}
        />
        <div
          className="absolute top-40 right-20 w-6 h-6 rounded-full animate-pulse"
          style={{
            backgroundColor: "rgba(226, 149, 120, 0.2)",
            animationDelay: "1000ms",
          }}
        />
        <div
          className="absolute bottom-40 left-20 w-3 h-3 rounded-full animate-pulse"
          style={{
            backgroundColor: "rgba(131, 197, 190, 0.3)",
            animationDelay: "2000ms",
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-5 h-5 rounded-full animate-pulse"
          style={{
            backgroundColor: "rgba(226, 149, 120, 0.2)",
            animationDelay: "500ms",
          }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default AnimatedBackground;
