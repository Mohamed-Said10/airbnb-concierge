interface LogoProps {
  className?: string;
  textClassName?: string;
}

// Icon mark matches the site favicon (src/app/icon.tsx) for a consistent brand
// mark between the browser tab and the header/footer.
const Logo = ({ className = '', textClassName = 'text-2xl' }: LogoProps) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" className="shrink-0">
      <rect width="28" height="28" rx="7" className="fill-primary-600" />
      <text x="14" y="19.5" textAnchor="middle" fontSize="15" fontWeight="700" fontFamily="Arial, sans-serif" className="fill-white">
        K
      </text>
    </svg>
    <span className={`font-bold text-primary-600 ${textClassName}`}>KoziBnB</span>
  </span>
);

export default Logo;
