import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import StarIcon from '@material-ui/icons/Star';
import { yellow, grey } from '@material-ui/core/colors';

import clsx from "clsx";
import React, { useState, useMemo } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // color: "#F8D03F",
    color: "rgba(0,0,0,.2)",
    fontSize: theme.spacing(2),
    justifyContent: "center",
    alignItems: "center",
  },
  starIconStyle: {
    color: "inherit",
    fontSize: "inherit",
  },
  noRatingsLabel: {
    opacity: .5,
    fontSize: theme.spacing(1.5),
    fontStyle: "italic",
  },
}));

const StarRatings = (props) => {
  const { className, score, editable, setScore, size='17px' } = props;
  const [mscore, setMscore] = useState(0)
  const classes = useStyles();
  const nScore = useMemo(()=>{
    if(!editable)
      return Math.floor(score)
    return mscore  
  }, [ editable, score, mscore ])
  return (
    <Box className={clsx(classes.root, className)}>
      {
        [0,1,2,3,4].map((prop,index)=>{
          return  <StarIcon 
          key={index}
          onClick={()=>{
            if(editable){
              setMscore(prop+1)
              setScore(prop+1)
            }
          }}
            style={{
            color: prop<nScore? "black" : grey[500],
            fontSize: size
          }} />
        })
      }
    </Box>
  )
}

export default StarRatings;
