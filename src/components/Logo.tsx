export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="36" fill="#E51924" />
      <text 
        x="50%" 
        y="110" 
        textAnchor="middle" 
        fill="#FFFFFF" 
        fontSize="65" 
        fontWeight="900" 
        fontFamily="'Outfit', 'Inter', 'Segoe UI', sans-serif" 
        letterSpacing="-2"
      >
        DUDI
      </text>
      <text 
        x="50%" 
        y="158" 
        textAnchor="middle" 
        fill="#FFFFFF" 
        fontSize="28" 
        fontWeight="600" 
        fontFamily="'Outfit', 'Inter', 'Segoe UI', sans-serif"
      >
        software
      </text>
    </svg>
  );
}
