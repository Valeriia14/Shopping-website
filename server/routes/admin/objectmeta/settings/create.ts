import { controller, Request, Response } from "@kidztime/middlewares"
import SvMetadata from "@kidztime/services/metadata"
// import { validator } from '@kidztime/utilities'

export default controller(async (req: Request, res: Response) => {
  const settings = await SvMetadata.customize_page(req.body, {
    ip_address: req.attr?.ip,
  })

  res.result = settings
})
