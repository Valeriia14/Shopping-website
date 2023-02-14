import { Product } from "@kidztime/models"

export const updateIsNewProd = async( prod: Product) =>{
  let now = Date.now()
  console.log(now - prod.updatedAt?.getTime())
  const diff = now - prod.updatedAt?.getTime() / 1000 / 24 / 60  
  if(diff >= 1){
    if(prod.is_new == true){
      await prod.update({
        is_new: false
      })
    }
  } 
  else{
    if(prod.is_new == false)
      await prod.update({
        is_new: true
      })  
  }
}