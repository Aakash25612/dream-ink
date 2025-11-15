import creteraIcon from "@/assets/cretera-icon.png";

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      {/* Rotating Cretera Icon */}
      <div className="relative w-24 h-24">
        <img 
          src={creteraIcon}
          alt="Cretera Icon"
          className="w-full h-full object-contain animate-spin"
          style={{
            filter: "drop-shadow(0 0 20px hsl(200_100%_70% / 0.6)) drop-shadow(0 0 40px hsl(217_91%_60% / 0.4))",
            animationDuration: "2s"
          }}
        />
      </div>

      {/* Loading Text */}
      <p className="text-xl text-foreground/90 font-light animate-pulse">
        Your Creation is being created...
      </p>
    </div>
  );
};

export default LoadingAnimation;
