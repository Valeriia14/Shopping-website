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
    marginTop: "15px",
    fontSize: "15px"
  }
}));

const AddQuestion = (props) =>{
  const classes = useStyles()
  const api = useApi()
  const [ open, setOpen ] = useState(false)

  const [ question, setQuestion ] = useState()
  const { productId, categoryId, orderId } = props
  const handleClose = useCallback(()=>{
    setOpen(false)
    setQuestion('')
  }, [ open ])     
  const handleSubmit = useCallback(async ()=>{
    const body = {
      question: question,
      product_id: productId,
      category_id: categoryId
    }
    await api.path("public/question_answer").post({ body })
    setOpen(false)
    window.location.reload()
  }, [ question, productId, categoryId])         
  return(
    <Box>
      <Button className={clsx(classes.root)}
        variant={'outlined'}
        onClick={()=>setOpen(!open)}
      >
        Add Question
      </Button>
      <PopUpDialog
        open={open}
        handleClose={handleClose}
        title={'Question'}
        fullWidth={true}
        titleClass={clsx(classes.title)}
        content={
          <Box>
            <TextField
              multiline={true}
              variant={'outlined'}
              fullWidth={true}
              value={question}
              placeholder="Write question"
              onChange={(e)=>{
                setQuestion(e.target.value)
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
export default AddQuestion
