export default function WavingFlag() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
      <svg
        width="92"
        height="60"
        viewBox="0 0 92 60"
        style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,.5))" }}
      >
        <defs>
          <linearGradient id="flagShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="0.25" stopColor="#000" stopOpacity="0.12" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.14" />
            <stop offset="0.75" stopColor="#000" stopOpacity="0.12" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.10" />
          </linearGradient>
          <clipPath id="flagClip">
            <path d="M6,4 Q28,-1 46,4 T86,4 L86,50 Q64,55 46,50 T6,50 Z">
              <animate
                attributeName="d"
                dur="3.2s"
                repeatCount="indefinite"
                values="M6,4 Q28,-1 46,4 T86,4 L86,50 Q64,55 46,50 T6,50 Z;
                        M6,4 Q28,9 46,4 T86,4 L86,50 Q64,45 46,50 T6,50 Z;
                        M6,4 Q28,-1 46,4 T86,4 L86,50 Q64,55 46,50 T6,50 Z"
              />
            </path>
          </clipPath>
        </defs>
        <rect x="2" y="0" width="3" height="60" rx="1.5" fill="#8a6d1f" />
        <circle cx="3.5" cy="2" r="2.5" fill="#d4af37" />
        <g clipPath="url(#flagClip)">
          {[...Array(13)].map((_, k) => (
            <rect
              key={k}
              x="0"
              y={4 + k * 3.55}
              width="92"
              height="3.55"
              fill={k % 2 === 0 ? "#b22234" : "#f7f3ea"}
            />
          ))}
          <rect x="0" y="4" width="38" height="24.8" fill="#1e2f6e" />
          {[...Array(4)].map((_, r) =>
            [...Array(6)].map((__, c) => (
              <text
                key={r + "-" + c}
                x={4 + c * 6}
                y={9.5 + r * 6.2}
                fontSize="5"
                fill="#fff"
                opacity="0.95"
              >
                ★
              </text>
            ))
          )}
          <rect x="0" y="0" width="92" height="60" fill="url(#flagShade)">
            <animate attributeName="x" dur="3.2s" repeatCount="indefinite" values="-6;6;-6" />
          </rect>
        </g>
      </svg>
    </div>
  );
}
