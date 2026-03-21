import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "default" | "large";
  href?: string;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

const baseClasses =
  "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 min-h-[48px] cursor-pointer";

const variants = {
  primary:
    "bg-casablanca text-firefly hover:-translate-y-0.5 hover:shadow-lg hover:shadow-casablanca/30",
  secondary:
    "bg-transparent text-firefly border-2 border-firefly hover:bg-firefly hover:text-white",
  outline:
    "bg-transparent text-white border-2 border-white hover:bg-white hover:text-firefly",
};

const sizes = {
  default: "px-8 py-3 text-base",
  large: "px-12 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "default",
  href,
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
