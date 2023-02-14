import { controller, Request, Response } from "@kidztime/middlewares";
import { Category, Product } from "@kidztime/models";
import { Op } from "sequelize";


export default controller(async (req: Request, res: Response) => {
  const { search, published } = req.query!;
  let isPublished = false;
  if(published === 'true') 
    isPublished = true
  else
    isPublished = false  
  const options = req.parse_query!();
  if (search) {
    options.search(<string>search, Product.crud.search || []);
  }
  if(isPublished){
      options.where = {
          published: true
      }
  }else{
    options.where = {
        published: {
            [Op.not]: true,
        } 
    }
  }
  
  const categories = await Category.findAll({
      ...options
  })
  res.result.models = categories;
});
