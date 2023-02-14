import { controller, cruder, Request, Response } from "@kidztime/middlewares"
import { ObjectMeta } from "@kidztime/models"

export default controller(async (req: Request, res: Response) => {
  const { objectmeta } = req.extras!
  const { title, extra0, extra1, extra2, extra3, extra4 } = req.body

  await cruder.processor(
    objectmeta,
    { value: title, extra0, extra1, extra2, extra3, extra4 },
    ObjectMeta.crud.update
  )
  await objectmeta.save()

  res.result = objectmeta
})
