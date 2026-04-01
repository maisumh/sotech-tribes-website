import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = true,
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-8 text-center h-full ${
        hover
          ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
