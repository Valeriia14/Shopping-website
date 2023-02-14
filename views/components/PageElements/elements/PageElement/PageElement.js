import React from "react";
import { ProductListingElement } from "..";
import BannerElement from "../BannerElement";
import CharacterSliderElement from "../CharacterSliderElement";
import ElementDivider from "../ElementDivider";
import FeatureCategoryElement from "../FeatureCategoryElement";
import FeatureProductElement from "../FeatureProductElement";
import ReviewSliderElement from "../ReviewSliderElement";
import QuestionAnswerSliderElement  from "../QuestionAnswerSliderElement";
import ThreeTileCarousel  from "../ThreeTileCarousel";
import FourTileCarousel  from "../FourTileCarousel";
import BannerCarousel  from "../BannerCarousel";
import FeatureCarousel  from "../FeatureCarousel";

const elementsMap = {
  "banner": BannerElement,
  "divider": ElementDivider,
  "product-feature": FeatureProductElement,
  "category-feature": FeatureCategoryElement,
  "character-slider": CharacterSliderElement,
  "product-listing": ProductListingElement,
  "review-slider": ReviewSliderElement,
  "question-answer-slider": QuestionAnswerSliderElement,
  "three-tile-carousel": ThreeTileCarousel,
  "four-tile-carousel": FourTileCarousel,
  "banner-carousel": BannerCarousel,
  "feature-carousel": FeatureCarousel,
};

const PageElement = (props) => {
  const element = props.element;
  const Component = elementsMap[element?.type];
  if (!Component) return null;
  return (
    <>
      <Component {...props} />
      {!props?.hiddenDevider && <ElementDivider />}
    </>
  )
};
export default PageElement;
