import { Context, useContext } from "react";

export const PageContextHolder: { context?: Context<any> } = {}

export interface PageDataSelector<T = any> {
  (rootData: any): T
}

const DEFAULT_SELECTOR: PageDataSelector = (original: any) => original;

export const usePageContext = () => {
  if (!PageContextHolder.context) return {};
  return useContext(PageContextHolder.context);
};

export const usePageElements = () => {
  if (!PageContextHolder.context) return {};
  return useContext(PageContextHolder.context).elems;
};

export const usePageData = (selector: PageDataSelector = DEFAULT_SELECTOR) => {
  if (!PageContextHolder.context) return {};
  return selector(useContext(PageContextHolder.context).data);
};

export const usePageMeta = (selector: PageDataSelector = DEFAULT_SELECTOR) => {
  if (!PageContextHolder.context) return {};
  return selector(useContext(PageContextHolder.context)._meta);
};

export const useSelfAccount = (selector: PageDataSelector = DEFAULT_SELECTOR) => {
  if (!PageContextHolder.context) return {};
  return selector(useContext(PageContextHolder.context)._self);
};

export const usePageOverride = (selector: PageDataSelector = DEFAULT_SELECTOR) => {
  if (!PageContextHolder.context) return {};
  return selector(useContext(PageContextHolder.context)._page);
};
