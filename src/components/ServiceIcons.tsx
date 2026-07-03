/**
 * Hand-drawn style service icons (orange line-art) modelled on the
 * jhammerglobal set. Colour comes from `currentColor` (text-cta).
 */
type IconProps = { className?: string; strokeWidth?: string | number };

/* Executive Search — topographic / fingerprint contour lines */
export const ContourIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor"
    strokeWidth={1.5} strokeLinecap="round" aria-hidden="true">
    <path d="M8 25c0-9 7-16 16-16s16 7 16 16" />
    <path d="M11.5 26c0-7 5.6-12.5 12.5-12.5S36.5 19 36.5 26" />
    <path d="M15 27c0-5 4-9.5 9-9.5s9 4.5 9 9.5" />
    <path d="M18.5 28c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6" />
    <path d="M22 29c0-1.4 0.9-2.6 2-2.6s2 1.2 2 2.6" />
    <path d="M8 25c0 4.6 2 8.8 5.3 11.7" />
    <path d="M40 25c0 4.6-2 8.8-5.3 11.7" />
  </svg>
);

/* HR Consulting — scattered particle spray */
export const DotsIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">
    {[
      [24, 7, 1.4], [20, 11, 1.1], [27, 11, 1.2], [17, 15, 1], [24, 15, 1.3],
      [30, 15, 1], [14, 19, 1.2], [21, 19, 1], [28, 19, 1.3], [34, 19, 1.1],
      [11, 23, 1], [18, 23, 1.3], [25, 23, 1], [32, 23, 1.2], [38, 23, 1],
      [9, 27, 1.2], [16, 28, 1], [23, 27, 1.1], [30, 28, 1.3], [37, 27, 1],
      [13, 32, 1], [26, 32, 1.1], [34, 32, 1.2], [20, 35, 1], [30, 36, 1.1],
    ].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} />
    ))}
  </svg>
);

/* Recruitment & Retention — hand-drawn scribble strokes */
export const ScribbleIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor"
    strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 34c1.5-9 3.5-15.5 5.5-16 2.5-0.6 3 8 5.5 8s3.2-10.5 6-9.5 3 9.5 5 11.5" />
    <path d="M14 35c1.4-7.5 3.2-12.5 5-13 2-0.5 2.8 6 4.8 6s3-8 5-7" />
  </svg>
);

/* Training & Development — concentric rings */
export const RingsIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor"
    strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
    <circle cx="24" cy="24" r="14.5" />
    <circle cx="24.4" cy="23.7" r="9.8" />
    <circle cx="24" cy="24" r="5.2" />
  </svg>
);
