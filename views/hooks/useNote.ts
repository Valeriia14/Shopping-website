import { usePageContext } from "./usePageContext";
interface Note {
  note?: string,
};

const state: Note = {};

export const useNote = () => {
  const context = usePageContext();
  const preloadedNote = context.note || "";

  const setter = (note: string) => {
    context.updater({
      ...context,
      note: note,
    });
  };

  return [state.note ?? preloadedNote, setter];
};
