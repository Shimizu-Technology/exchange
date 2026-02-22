export function Logo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { text: "text-xl", icon: 20 },
    md: { text: "text-2xl", icon: 24 },
    lg: { text: "text-4xl", icon: 32 },
  };
  const s = sizes[size];

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: s.icon, height: s.icon }}>
        <rect width="32" height="32" rx="6" fill="#3d405b"/>
        <path d="M9 10L23 22" stroke="#e07a5f" strokeWidth="3" strokeLinecap="round"/>
        <path d="M23 10L9 22" stroke="#81b29a" strokeWidth="3" strokeLinecap="round"/>
        <path d="M20.5 9.5L23.5 10L22.5 13" stroke="#e07a5f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M11.5 9.5L8.5 10L9.5 13" stroke="#81b29a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      <span className={`font-display font-bold tracking-tight ${s.text}`}>
        <span className="text-ocean">ex</span>
        <span className="text-coral">change</span>
      </span>
    </span>
  );
}

export function LogoIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
      <rect width="32" height="32" rx="6" fill="#3d405b"/>
      <path d="M9 10L23 22" stroke="#e07a5f" strokeWidth="3" strokeLinecap="round"/>
      <path d="M23 10L9 22" stroke="#81b29a" strokeWidth="3" strokeLinecap="round"/>
      <path d="M20.5 9.5L23.5 10L22.5 13" stroke="#e07a5f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M11.5 9.5L8.5 10L9.5 13" stroke="#81b29a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}
