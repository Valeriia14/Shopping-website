import { make, Request } from "@kidztime/middlewares";
import { chirp } from "@kidztime/utilities";

export const add_crudscope = (scope: string) => {
  return make(async (req: Request) => {
    chirp("m: add_crudscope", scope);
    req.extras!.crudscope = scope;
  });
};