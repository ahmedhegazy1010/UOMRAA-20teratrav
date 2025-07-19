import React from "react";

export default function IslamicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Animated Islamic geometric patterns layer 1 */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23dc2626' stroke-width='1' fill='%23dc2626' fill-opacity='0.1'%3E%3Cpath d='M60 60L20 20v80l40-40zm0 0l40 40V20L60 60z'/%3E%3Cpath d='M20 20l40 40-40 40V20zm80 0v80l-40-40 40-40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
            animationDuration: "8s",
          }}
        />
      </div>

      {/* Animated Islamic geometric patterns layer 2 - rotating */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="absolute inset-0 animate-spin"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23dc2626' stroke-width='0.8'%3E%3Ccircle cx='40' cy='40' r='20' stroke-dasharray='10,5'/%3E%3Cpath d='M40 20l14.14 14.14L40 48.28 25.86 34.14z' stroke='%23ffffff' stroke-width='0.5' fill='%23dc2626' fill-opacity='0.1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "80px 80px",
            animationDuration: "20s",
          }}
        />
      </div>

      {/* Islamic star patterns - animated floating */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              className="text-red-500"
            >
              <path
                d="M20 2l5.5 12.5L38 20l-12.5 5.5L20 38l-5.5-12.5L2 20l12.5-5.5L20 2z"
                fill="currentColor"
                opacity="0.6"
              />
              <path
                d="M20 8l3 7h7l-5.5 4 2 7L20 22l-6.5 4 2-7L10 15h7l3-7z"
                fill="white"
                opacity="0.3"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Animated geometric circles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-red-500/30 rounded-full"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${15 + i * 15}%`,
              top: `${10 + i * 15}%`,
              animation: `spin ${10 + i * 2}s linear infinite`,
              animationDirection: i % 2 === 0 ? "normal" : "reverse",
            }}
          >
            <div
              className="absolute inset-2 border border-red-400/20 rounded-full"
              style={{
                animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Moving particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `moveParticle ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Islamic calligraphy-inspired patterns */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23dc2626' stroke-width='1'%3E%3Cpath d='M100 50c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 75c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z'/%3E%3Cpath d='M100 25c-41.4 0-75 33.6-75 75s33.6 75 75 75 75-33.6 75-75-33.6-75-75-75zm0 125c-27.6 0-50-22.4-50-50s22.4-50 50-50 50 22.4 50 50-22.4 50-50 50z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            animation: "drift 15s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/5 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-red-600/10" />

      {/* Islamic Arabesque patterns */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${25 * i}%`,
              top: `${20 + i * 20}%`,
              animation: `arabesque ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 1}s`,
            }}
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              className="text-red-600"
            >
              <path
                d="M50 10 C70 30, 70 70, 50 90 C30 70, 30 30, 50 10 Z M50 25 C60 35, 60 65, 50 75 C40 65, 40 35, 50 25 Z"
                fill="currentColor"
                opacity="0.3"
              />
              <circle
                cx="50"
                cy="50"
                r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.5"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Mihrab arch patterns */}
      <div className="absolute inset-0 opacity-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              right: `${30 + i * 25}%`,
              bottom: `${10 + i * 30}%`,
              animation: `mihrab ${12 + i * 3}s ease-in-out infinite alternate`,
              animationDelay: `${i * 2}s`,
            }}
          >
            <svg
              width="80"
              height="120"
              viewBox="0 0 80 120"
              className="text-red-500"
            >
              <path
                d="M10 120 L10 40 Q10 10, 40 10 Q70 10, 70 40 L70 120 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.4"
              />
              <path
                d="M20 120 L20 45 Q20 20, 40 20 Q60 20, 60 45 L60 120"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes moveParticle {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100px) translateY(-100px);
            opacity: 0;
          }
        }

        @keyframes drift {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            transform: translate(30px, -30px) rotate(5deg);
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

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes arabesque {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2) rotate(5deg);
            opacity: 0.6;
          }
        }

        @keyframes mihrab {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.2;
          }
          100% {
            transform: translateY(-10px) scale(1.05);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
