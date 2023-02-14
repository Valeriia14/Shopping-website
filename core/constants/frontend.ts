export namespace PageElement {
  export interface DefaultElementOpts {
    hide_bottom_divider?: boolean;
    max_width?: "xs" | "sm" | "md" | "lg" | "xl";
    disable_gutters?: boolean;
  }

  export interface BannerOpts extends DefaultElementOpts {
  }

  export interface CategoryFeatureOpts extends DefaultElementOpts {
    title: string;
    description: string;
    category_list: number[];
  }

  export interface ProductFeatureOpts extends DefaultElementOpts {
    description: string;
    category_id: number;
    count?: number;
  }

  export interface DividerOpts extends DefaultElementOpts {
  }

  export interface CharacterSliderOpts extends DefaultElementOpts {
  }

  export interface ProductListingOpts extends DefaultElementOpts {
    category_id: number;
    count?: number;
  }
  export interface ReviewSliderOpts extends DefaultElementOpts {
    category_id: number;
  }

  export type DefaultOptsKeys = keyof DefaultElementOpts;
  export type BannerOptsKeys = keyof BannerOpts;
  export type CategoryFeatureOptsKeys = keyof CategoryFeatureOpts;
  export type ProductFeatureOptsKeys = keyof ProductFeatureOpts;
  export type DividerOptsKeys = keyof DividerOpts;
  export type CharacterSliderOptsKeys = keyof CharacterSliderOpts;
  export type ProductListingOptsKeys = keyof ProductListingOpts;
  export type ReviewSliderOptsKeys = keyof ReviewSliderOpts;

  export const defaultOpts: DefaultElementOpts = {
    hide_bottom_divider: false,
    max_width: "lg",
    disable_gutters: false,
  };
}
