export default function CarIcon({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="mred" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff4b3e" />
          <stop offset="0.5" stopColor="#e01f10" />
          <stop offset="1" stopColor="#a80d05" />
        </linearGradient>
      </defs>
      <g>
        <ellipse cx="50" cy="54" rx="26" ry="40" fill="rgba(0,0,0,.35)" />
        <path
          d="M50 8 C38 8 33 20 32 34 C31 46 31 60 33 74 C34 84 40 92 50 92 C60 92 66 84 67 74 C69 60 69 46 68 34 C67 20 62 8 50 8 Z"
          fill="url(#mred)"
          stroke="#7a0a03"
          strokeWidth="1.5"
        />
        <path
          d="M42 16 C41 24 41 30 42 36 M58 16 C59 24 59 30 58 36"
          stroke="#b01309"
          strokeWidth="1.4"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M39 34 C43 31 57 31 61 34 L59 44 C53 42 47 42 41 44 Z"
          fill="#1a2530"
          stroke="#0a1218"
          strokeWidth="0.6"
        />
        <rect x="40" y="45" width="20" height="20" rx="4" fill="#2a0704" />
        <path
          d="M41 66 C47 64 53 64 59 66 L61 76 C57 73 43 73 39 76 Z"
          fill="#1a2530"
          stroke="#0a1218"
          strokeWidth="0.6"
        />
        <rect x="46" y="10" width="3.2" height="82" fill="#fff" opacity="0.9" />
        <rect x="51" y="10" width="3.2" height="82" fill="#fff" opacity="0.9" />
        <rect x="28" y="28" width="7" height="15" rx="3" fill="#111" />
        <rect x="65" y="28" width="7" height="15" rx="3" fill="#111" />
        <rect x="28" y="62" width="7" height="15" rx="3" fill="#111" />
        <rect x="65" y="62" width="7" height="15" rx="3" fill="#111" />
        <circle cx="41" cy="14" r="2.4" fill="#fff5d0" />
        <circle cx="59" cy="14" r="2.4" fill="#fff5d0" />
        <rect x="38" y="87" width="5" height="3" rx="1" fill="#ff2a1a" />
        <rect x="57" y="87" width="5" height="3" rx="1" fill="#ff2a1a" />
      </g>
    </svg>
  );
}
