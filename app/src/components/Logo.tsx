type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const sizeMap: Record<LogoSize, string> = {
  sm: "h-8",
  md: "h-12",
  lg: "h-16",
  xl: "h-24",
};

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const heightClass = sizeMap[size];

  return (
    <img
      src="/images/chs-logo.png"
      alt="Logo CHS - Cosmetic Hair Shop"
      className={`${heightClass} w-auto object-contain ${className}`}
      loading="lazy"
    />
  );
}
