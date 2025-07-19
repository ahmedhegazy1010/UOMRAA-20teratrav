import React from "react";

export default function EnhancedIslamicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Layer 1: Large Islamic geometric mandala */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg
            width="800"
            height="800"
            viewBox="0 0 400 400"
            className="text-red-600 animate-spin"
            style={{ animationDuration: "60s" }}
          >
            {/* Outer ring */}
            <circle
              cx="200"
              cy="200"
              r="180"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
            />

            {/* Islamic geometric star */}
            <g fill="currentColor" opacity="0.2">
              {[...Array(8)].map((_, i) => (
                <g key={i} transform={`rotate(${i * 45} 200 200)`}>
                  <path d="M200 50 L220 120 L290 120 L235 165 L255 235 L200 190 L145 235 L165 165 L110 120 L180 120 Z" />
                </g>
              ))}
            </g>

            {/* Inner circles */}
            <circle
              cx="200"
              cy="200"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.4"
            />
            <circle
              cx="200"
              cy="200"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.5"
            />
            <circle
              cx="200"
              cy="200"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      {/* Layer 2: Floating Arabic calligraphy inspired shapes */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + i * 12}%`,
              animation: `islamicFloat ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`,
            }}
          >
            <svg
              width="120"
              height="80"
              viewBox="0 0 120 80"
              className="text-red-500"
            >
              <path
                d="M10 40 Q30 10, 60 40 Q90 70, 110 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shimmer-path"
              />
              <path
                d="M20 50 Q40 20, 70 50 Q100 80, 110 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.7"
                className="shimmer-path"
                style={{ animationDelay: "1s" }}
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Layer 3: Islamic star patterns with glow effect */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute islamic-glow"
            style={{
              left: `${5 + ((i * 8.5) % 90)}%`,
              top: `${5 + Math.floor(i / 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              className="text-red-600"
            >
              <path
                d="M25 5 L30 18 L43 18 L33 27 L38 40 L25 31 L12 40 L17 27 L7 18 L20 18 Z"
                fill="currentColor"
                opacity="0.6"
              />
              <path
                d="M25 10 L28 20 L38 20 L30 25 L33 35 L25 30 L17 35 L20 25 L12 20 L22 20 Z"
                fill="white"
                opacity="0.3"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Layer 4: Rotating geometric rings */}
      <div className="absolute inset-0 opacity-12">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 20}%`,
              top: `${20 + i * 15}%`,
              animation: `spin ${15 + i * 5}s linear infinite`,
              animationDirection: i % 2 === 0 ? "normal" : "reverse",
            }}
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              className="text-red-500"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="10 5"
                opacity="0.5"
              />
              <circle
                cx="50"
                cy="50"
                r="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="5 3"
                opacity="0.7"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Layer 5: Mihrab arch patterns */}
      <div className="absolute inset-0 opacity-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              right: `${10 + i * 30}%`,
              bottom: `${5 + i * 25}%`,
              animation: `float ${10 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 3}s`,
            }}
          >
            <svg
              width="100"
              height="150"
              viewBox="0 0 100 150"
              className="text-red-600"
            >
              <path
                d="M15 150 L15 50 Q15 15, 50 15 Q85 15, 85 50 L85 150"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.4"
                className="shimmer-path"
              />
              <path
                d="M25 150 L25 55 Q25 25, 50 25 Q75 25, 75 55 L75 150"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
                className="shimmer-path"
                style={{ animationDelay: "2s" }}
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Layer 6: Moving light particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `moveParticle ${8 + Math.random() * 12}s linear infinite`,
              animationDelay: `${Math.random() * 8}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Layer 7: Arabic geometric tessellation */}
      <div className="absolute inset-0 opacity-6">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23dc2626' stroke-width='1'%3E%3Cpath d='M80 20 L120 50 L120 110 L80 140 L40 110 L40 50 Z' opacity='0.3'/%3E%3Cpath d='M80 40 L100 60 L100 100 L80 120 L60 100 L60 60 Z' opacity='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "160px 160px",
            animation: "drift 20s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Gradient overlays for depth and atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/8 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-red-600/10" />
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-black/20 to-red-800/5" />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes islamicFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
            opacity: 0.3;
          }
          33% {
            transform: translateY(-20px) rotate(120deg) scale(1.15);
            opacity: 0.8;
          }
          66% {
            transform: translateY(-8px) rotate(240deg) scale(0.95);
            opacity: 0.6;
          }
        }

        @keyframes moveParticle {
          0% {
            transform: translateX(0) translateY(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: scale(1);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(150px) translateY(-150px) scale(0);
            opacity: 0;
          }
        }

        @keyframes drift {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            transform: translate(40px, -40px) rotate(8deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-25px) scale(1.08);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shimmerPath {
          0% {
            stroke-dasharray: 0 100;
            opacity: 0.2;
          }
          50% {
            stroke-dasharray: 50 100;
            opacity: 0.9;
          }
          100% {
            stroke-dasharray: 100 100;
            opacity: 0.3;
          }
        }

        .islamic-glow {
          filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.4));
          animation: pulse 4s ease-in-out infinite;
        }

        .shimmer-path {
          animation: shimmerPath 6s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            filter: drop-shadow(0 0 5px rgba(220, 38, 38, 0.3));
            opacity: 0.4;
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(220, 38, 38, 0.7));
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
