import React from 'react'
import { Box, Grid, makeStyles } from '@material-ui/core';

const Preview = ({files, handleDelete}) =>{
  const classes=useStyles()
  return (
    <Grid container>
      {
        files?.map((file, index)=>{
          return (
            <Grid item md={6}>
              {
                file.uri &&
                <Box justifyContent={"center"} alignItems={"center"} position={'relative'}>
                  <img 
                  className={classes.img}
                  src={file.uri} />
                  <img
                    onClick={()=>{handleDelete(index)}}
                    className={classes.delBtn}
                    src="/images/del-icon.png"
                  />
                </Box>
              }
            </Grid>
          )
        })
      }
    </Grid>
  )
}
const useStyles = makeStyles((theme) => ({
  img:{
    width: "78px",
    height: "78px",
    [theme.breakpoints.down("sm")]: {
      width: "78px",
      height: "78px"
    },
  },
  delBtn:{
    position: "absolute",
    top: 0,
    right: 0,
    width: "16px",
    height: "16px"
  }
}));

export default Preview