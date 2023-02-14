import { usePageContext } from ".";

export const useFilter = () => {
  const context = usePageContext();
  const preloadedFilter = {
    gender : "1,1",
    price : "4,60",
    sortby : "price:asc",
    limit : 9
  };

  const setter = (filter: Object) => {
    context.updater({
      ...context,
      filter: filter,
    });
  };

  return [preloadedFilter, setter];
};
