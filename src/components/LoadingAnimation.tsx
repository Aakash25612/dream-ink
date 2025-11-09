const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      {/* Rotating Cretera Icon */}
      <div className="relative w-24 h-24">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full animate-spin"
          style={{
            filter: "drop-shadow(0 0 20px hsl(200_100%_70% / 0.6)) drop-shadow(0 0 40px hsl(217_91%_60% / 0.4))",
            animationDuration: "2s"
          }}
        >
          {/* 8-point star shape */}
          <path
            d="M50 10 L55 40 L75 25 L65 50 L90 50 L65 55 L75 75 L55 65 L50 90 L45 65 L25 75 L35 55 L10 50 L35 45 L25 25 L45 40 Z"
            fill="url(#blueGradient)"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(200_100%_70%)" />
              <stop offset="100%" stopColor="hsl(217_91%_60%)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Loading Text */}
      <p className="text-xl text-foreground/90 font-light animate-pulse">
        Your Creation is being created...
      </p>
    </div>
  );
};

export default LoadingAnimation;
