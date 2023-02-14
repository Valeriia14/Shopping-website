import React, { useMemo, useCallback, useState } from 'react';
import { PopUpDialog, ProductGrid, RatingStar } from "@ktwebsite/components";
import { Box, Container, Grid, makeStyles, Button, Typography, Fragment, TextField } from "@material-ui/core";
import clsx from "clsx";
import useApi from '@ktwebsite/utils/api/useApi';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    color: 'black'
  },
  reviewText:{
    marginTop: "15px"
  }
}));

const AddReview = (props) =>{
  const classes = useStyles()
  const api = useApi()
  const [ open, setOpen ] = useState(false)
  
  const [ score, setScore ] = useState(0)
  const [ review, setReview ] = useState()
  const { productId, categoryId, orderId, handleAddReview } = props
  const handleClose = useCallback(()=>{
    setOpen(false)
    setReview('')
  }, [ open ])     
  const handleSubmit = useCallback(async ()=>{
    const body = {
      score: score,
      comment: review,
      product_id: productId,
      category_id: categoryId
    }
    await api.path("public/review").post({ body })
    setOpen(false)
    window.location.reload()
  }, [ score, review, productId, categoryId])         
  return(
    <Box>
      <Button className={clsx(classes.root)}
        variant={'outlined'}
        onClick={()=>setOpen(!open)}
      >
        Add Review
      </Button>
      <PopUpDialog
        open={open}
        handleClose={handleClose}
        title={'Review'}
        fullWidth={true}
        titleClass={clsx(classes.title)}
        content={
          <Box>
            <RatingStar 
              setScore={setScore} 
              editable={true} >
            </RatingStar>
            <TextField
              multiline={true}
              variant={'outlined'}
              fullWidth={true}
              value={review}
              onChange={(e)=>{
                setReview(e.target.value)
              }}
              className={clsx(classes.reviewText)}
            ></TextField>
          </Box>  
        }
        actions={
          <Button 
            variant={'outlined'}
            onClick={handleSubmit}
            className={clsx(classes.root)}>
            <Typography variant="h5">Submit</Typography>
          </Button>
        }
      />
    </Box> 
  )
}
export default AddReview
