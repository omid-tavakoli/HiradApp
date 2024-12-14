const Img = ({ src, ...attrs }) => {
  const prefix = import.meta.env.VITE_API_URL;
  src = src.replaceAll("\\", "/");
  if (src.startsWith("/")) src = src.slice(1);
  const path = prefix + src;
  return <img src={path} {...attrs} />;
};

export default Img;
