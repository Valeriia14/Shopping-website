import { usePageContext } from ".";

export const useModel = () => {
  const context = usePageContext();
  const preloadedModel = context.model || "";

  const setter = (model: Object) => {
    context.updater({
      ...context,
      model: model,
    });
  };

  return [preloadedModel, setter];
};
