"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EnhancedCard({
  children,
  title,
  icon,
  className = "",
  headerClassName = "",
  contentClassName = "",
  gradient = false,
  ...props
}) {
  const cardStyles = {
    background: gradient
      ? "linear-gradient(135deg, white 0%, white 70%, rgba(255, 221, 210, 0.2) 100%)"
      : "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    border: "none",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: "all 0.5s ease",
  };

  return (
    <Card
      className={`hover:shadow-2xl transition-all duration-500 ${className}`}
      style={cardStyles}
      {...props}
    >
      {title && (
        <CardHeader className={`pb-4 ${headerClassName}`}>
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
            {icon && <span className="text-2xl">{icon}</span>}
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={`space-y-4 ${contentClassName}`}>
        {children}
      </CardContent>
    </Card>
  );
}

export default EnhancedCard;
