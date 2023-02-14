import { controller, Request, Response } from "@kidztime/middlewares";
import { Product } from "@kidztime/models";
import SvMetadata from "@kidztime/services/metadata";

export default controller(async (req: Request, res: Response) => {
  const { product } = req.extras!;
  let { metadata } = req.body;

  metadata = JSON.stringify(metadata);
  const updated_metadata = await SvMetadata.update_metadata({ model: product, owner_type: Product.name, metadata }, { ip_address: req.attr?.ip });

  res.result.meta = updated_metadata[0];
});
