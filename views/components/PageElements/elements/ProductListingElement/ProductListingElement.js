import ProductListing from "@ktwebsite/components/ProductListing";
import React from "react";

const BannerElement = (props) => {
  const { element, ...rest } = props;

  return (
    <ProductListing {...rest} products={element.products} character={element.character} />
  );
};

export default BannerElement;
