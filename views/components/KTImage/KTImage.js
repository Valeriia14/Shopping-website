import React, { useEffect, useState } from "react";

const KTImage = (props) => {
  const { src, ...rest } = props;

  const [imageSrc, setImageSrc] = useState("/images/placeholder.png");

  useEffect(() => {
    if (src) setImageSrc(src);
  }, [src]);

  return (
    <img {...rest} src={imageSrc} />
  );
};

export default KTImage;
