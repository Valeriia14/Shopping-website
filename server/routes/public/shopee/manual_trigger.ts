import { SvCronTask } from '@kidztime/services';
import { controller, Request, Response } from "@kidztime/middlewares";
import config from "@kidztime/config";

export default controller(async (req: Request, res: Response) => {
  const { username, password } = req.query!
  if( username === config.apiuser.name && password === config.apiuser.password){
      try {
        SvCronTask.syncShopeeOrder()
      }catch(e){
        console.log(e)
      }
      res.result.status = "Started Sync-job"
  }else{
      res.result.status = "Invalid Credentials"
  }
});
