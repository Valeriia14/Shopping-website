import { LoadingTask } from "@ktwebsite/store/layout/reducers";
import { RootState } from "@ktwebsite/store/reducers";
import { useState } from "react";
import { useSelector } from "react-redux";
import useStatefulTask, { Runnable } from "./useStatefulTask";
import snakeToTitle from "./snakeToTitle";

export type ErrorCatcher = (error: any) => any;
const parseError = (original: any) => {
  let error = original;
  if (original.isAxiosError) {
    if (original.response) {
      if (original.response.data && original.response.data.error)
        error = original.response.data.error;
      error.axios = {
        request: original.request,
        response: original.response,
        config: original.config,
      };
    }
  }
  return error;
};

export default (taskname: string, errorCatcher?: ErrorCatcher) => {
  const [error, setError] = useState(null);
  const loadingTasks = useSelector<RootState, { [index: string]: LoadingTask }>((store) => store.Layout.loadingTasks);

  const cleanup = () => {
    setError(null);
    if (errorCatcher) errorCatcher(null);
  };
  const statefulTask = useStatefulTask(taskname);
  const asyncTaskRunner = async (task: Runnable) => {
    if (typeof cleanup === "function") cleanup();
    try {
      await statefulTask(task);
    } catch (rawError) {
      // const error = snakeToTitle(rawError.message);
      const error = parseError(rawError);
      setError(error);
    }
  };
  const loadingState = !!loadingTasks[taskname];
  return [asyncTaskRunner, loadingState, error];
};