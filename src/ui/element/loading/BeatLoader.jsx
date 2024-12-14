const BeatLoader = ({ size = 15, color = '#be002c' }) => {
  const ballStyle = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
  };

  return (
    <div className="flex justify-center items-center gap-1">
      <span
        className="inline-block rounded-full animate-beat"
        style={{ ...ballStyle, animationDelay: '0s' }}
      ></span>
      <span
        className="inline-block rounded-full animate-beat"
        style={{ ...ballStyle, animationDelay: '0.15s' }}
      ></span>
      <span
        className="inline-block rounded-full animate-beat"
        style={{ ...ballStyle, animationDelay: '0.3s' }}
      ></span>
    </div>
  );
};

export default BeatLoader;