"use client";

interface LineQuoteMarkProps {
  className?: string;
  color?: string;
  type?: "open" | "close";
}

export function LineQuoteMark({ className = "w-10 h-10", color = "#C1633B", type = "open" }: LineQuoteMarkProps) {
  const isClose = type === "close";

  return (
    <svg
      className={`${className} ${isClose ? "rotate-180 inline-block" : "inline-block"}`}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dual curved comma line marks with 2px stroke matching ticker punctuation */}
      <path
        d="M 6,18 C 6,10 12,6 18,6 C 18,12 12,18 10,26 C 9,30 6,32 4,32"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 20,18 C 20,10 26,6 32,6 C 32,12 26,18 24,26 C 23,30 20,32 18,32"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
