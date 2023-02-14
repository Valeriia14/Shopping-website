import { ErrorMessage, FancyButton, ProductRow, QuantityInput, RatingStar, BaseButton, BaseInput } from "@ktwebsite/components";
import { useCart, usePageData } from "@ktwebsite/hooks";
import useApi from "@ktwebsite/utils/api/useApi";
import doRedirect from "@ktwebsite/utils/doRedirect";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import moment from 'moment'
import { 
  Box, 
  ButtonBase, 
  Divider, Grid, 
  InputLabel, 
  lighten, 
  makeStyles, 
  MenuItem, 
  Select, 
  Typography, 
  Tab, 
  Tabs, 
  Button, 
  TextField, 
  InputBase,
  Paper, 
  IconButton,
  Modal,
  Checkbox,
  FormGroup,
  FormControlLabel,
  withStyles
} from "@material-ui/core";

import useFormHandler from "@ktwebsite/utils/useFormHandler";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import { useSnackbar } from "notistack";
import SearchIcon from '@material-ui/icons/Search';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { grey } from "@material-ui/core/colors";
import { formStructure } from "./QAConfig";

const GreyCheckbox = withStyles({
  root: {
    color: grey[400],
    '&$checked': {
      color: grey[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const QATab = (props) => {
  const { children, className, ...rest } = props;
  const api = useApi();
  const [cart, setCart] = useCart();
  const { enqueueSnackbar } = useSnackbar();
  const product = usePageData(data => data.product);
  
  const classes = useStyles();
  const qas = usePageData(data=>data.qas)
  const category = usePageData(data=>data.category)
  const [ show, setShow ] = useState(false)

  const [description, setDescription] = useState("")
  const [isPrivate, setPrivate] = useState(false)
  const [usesEmail, setUsesEmail] = useState(true)
  const [qaCategory, setQACategory] = useState("")
  const [designId, setDesignId] = useState(0)
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [ keyword, setKeyword ] = useState("")

  const handleSubmit = useCallback(async ()=>{
      const body = {
        question: description,
        is_private: isPrivate,
        product_id: product.id,
        // category_id: categoryId,
        uses_email: usesEmail,
        design_id: designId,
        qa_category: qaCategory,
        first_name : firstName,
        email: email 
      }
      await api.path("public/question_answer").post({ body })
      window.location.reload()
    }, [ description, isPrivate, usesEmail, firstName, email, qaCategory, designId]);

  const handleKeyword = useCallback((e)=>{
    setKeyword(e.target.value)
  }, [])

  const filtered_qas = useMemo(()=>{
    if(keyword){
      const result = qas.filter((item)=>{
        return item.first_name.toLowerCase().includes(keyword.toLowerCase()) || item.question.toLowerCase().includes(keyword.toLowerCase()) 
      })
      return result
    }
    return qas
  }, [ keyword, qas ])
  return (
    <Box className={classes.root}>
      <Box className={classes.scrollBox}>
        <Grid container style={{marginBottom: "40px"}}>
          <Grid item sm={12} md={8}>
            <Box flexDirection="row" alignItems="center" justifyContent="flex-start" display="flex">
              <Paper
                component="form"
                style={{background: "#D8D8D8",  width: "413px", display: "flex" }}
              >
                <InputBase
                  onChange={handleKeyword}
                  style={{flex: 1, paddingLeft: "15px"}}
                  placeholder="Search Name or Keywords"
                  inputProps={{ 'aria-label': 'Search Name or Keywords' }}
                />
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Box>
          </Grid>
          <Grid item sm={12} md={4}>
            <Box>
              <Button 
                onClick={()=>setShow(true)}
                className={classes.writeBtn}>
                Ask a question
              </Button>      
            </Box>
          </Grid>  
        </Grid>
        
        <Box flexDirection="column" display="flex">
          {
            filtered_qas?.map((prop,index)=>{
              return (
                <Fragment key={index}>
                <Box flexDirection="row" display="flex" className={classes.reviewItemWrap}>
                  <Box display="flex" flexDirection="column" className={classes.reviewLeftBox}>
                    <Typography className={classes.reviewName}>{prop.first_name || " "}</Typography>
                    <Typography className={classes.reviewDate}>{moment(prop.updated_at).format("DD MMM YYYY")}</Typography>
                  </Box>
                  <Box flexDirection="row" display="flex" alignItems="flex-start" flex={1}>
                    <Box className={classes.questionText}>
                      <Typography className={classes.reviewText}>{prop.question}</Typography>
                    </Box>
                    <Box display="flex" flexDirection="row">
                      <Box className={classes.btnStatus}>
                        <Typography style={{fontSize: "14px"}}>
                          Answering
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Typography className={clsx(classes.reviewText, classes.mobShow)}>{prop.question}</Typography>
                </Fragment>
              )
            })
          }
        </Box>
      </Box>
      <Modal
        open={show}
        onClose={()=>setShow(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.modalBox}>
          <Typography>Q&A</Typography>
          <Grid container spacing={2}>
            <Grid item md={12} sm={12} >
              <FormGroup row={true} className={classes.checkGroup}>
                <FormControlLabel 
                  control={
                  <GreyCheckbox 
                    checked={isPrivate} 
                    onChange={()=>setPrivate(!isPrivate)}
                    />
                  } label="Private your inquiry" />
                <FormControlLabel 
                  control={
                    <GreyCheckbox 
                      checked={usesEmail} 
                      onChange={()=>setUsesEmail(!usesEmail)}
                    />
                  } 
                  label="Send response to email" />
              </FormGroup>
            </Grid>
            <Grid item md={6} sm={12}>
              <Box className={classes.inputBaseWrap}>
                <Typography>Email</Typography>
                <InputBase
                  onChange={(e)=>{
                    setEmail(e.target.value)
                  }}
                  inputProps={{autoComplete: "false"}}
                  name="email"
                  title="Email"
                  type="text"
                  required
                />
              </Box>
            </Grid>
            <Grid item md={6} sm={12}>
              <Box className={classes.inputBaseWrap}>
                <Typography>Name</Typography>
                <InputBase
                  onChange={(e)=>{
                    setFirstName(e.target.value)
                  }}
                  inputProps={{autoComplete: "false"}}
                  name="firstName"
                  type="text"
                  required
                />
              </Box>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Select 
                style={{border: "solid 1px"}}
                onChange={(e)=>setQACategory(e.target.value)}
                defaultValue={"Category"} variant="outlined" fullWidth>
                <MenuItem value={"Category"} disabled >Category</MenuItem>
                <MenuItem value={"Item Inquiry"} >About Item Inquiry</MenuItem>
                <MenuItem value={"orders_inquiry"} >Orders Inquiry</MenuItem>
                <MenuItem value={"shipping_parcel"} >Shipping of Parcel</MenuItem>
                <MenuItem value={"return_parcel"} >Return of Parcel</MenuItem>
                <MenuItem value={"others"} >Others</MenuItem>
              </Select>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <Select
                style={{border: "solid 1px"}}
                onChange={(e)=>{
                  setDesignId(e.target.value)
                }} 
                defaultValue={0} variant="outlined" fullWidth>
                <MenuItem value={0} disabled>Design</MenuItem>
                <MenuItem value={1} >Bottle Design</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <TextField
              style={{marginTop: "20px", border: "solid 1px", borderRadius: "5px"}}
              placeholder="Description"
              multiline
              rows={4}
              maxRows={6}
              fullWidth
              variant="outlined"
              onChange={(e)=>{
                setDescription(e.target.value)
              }}
            />
          </Grid>
          <Box flexDirection="row" display="flex" alignItems="center" justifyContent="center" marginBottom="35px" marginTop="30px">
            <Button className={classes.cancelBtn}
              onClick={()=>setShow(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={()=>{
                setShow(false)
                handleSubmit()
              }}
              className={classes.postBtn}>
              Post
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

const useStyles = makeStyles((theme) => ({
  inputBaseWrap:{
    border: "solid 1px black",
    height: "60px",
    borderRadius: "5px",
    paddingLeft: "21px",
    paddingTop: "9px",
    "& p":{
      fontSize: "10px"
    }
  },
  checkGroup:{
    justifyContent: "space-between"
  },
  cancelBtn:{
    width: "236px",
    margin: "10px",
    background: "#636363",
    color: "white",
    "&:hover":{
      background: "#434343",
    }
  },
  postBtn:{
    width: "236px",
    margin: "10px",
    background: "black",
    "&:hover":{
      background: "#111111",
    },
    color: "white"
  },
  closeX:{
    color: 'black',
    cursor: "pointer",
    textAlign: "right"
  },
  modalBox:{
    position: 'absolute',
    paddingLeft: "112px",
    paddingRight: "112px",
    paddingTop: "53px",
    paddingBottom: "50px",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "840px",
    [theme.breakpoints.down("sm")]: {
      width: "80%" ,
      paddingLeft: "10px",
      paddingRight: "10px",
      paddingTop: "23px",
    paddingBottom: "20px",
    },
    background: "white",
    boxShadow: 24,
  },
  btnStatus:{
    display: "flex",
    width: "111px",
    height: "30px",
    borderRadius: "20px",
    background: "#D8D8D8",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px black",
    "&:hover":{
      background: "#e8e8e8",
    }
  },
  thumbImg: {
    width: "16px",
    height: "16px",
    objectFit: "contain",
    marginLeft: "16px"
  },
  helpfulText:{
    fontSize: "14px",
    color: "#898989"
  },
  num:{
    marginLeft: "4px",
    color: "#898989",
    fontSize: "12px",
    lineHeight: "14px"
  },
  viewAttachment: {
    color: "#000000",
    fontStyle: "italic",
    fontSize: "12px",
    lineHeight: "14px"
  },
  varientText: {
    color: "#666666",
    fontStyle: "italic",
    fontSize: "12px",
    lineHeight: "14px"
  },
  reviewText:{
    fontSize: "16px",
    fontStyle: "italic",
    color: "#333333"
  },
  mobShow:{
    display: "none",
    [theme.breakpoints.down('sm')]: {
      display: "flex"
    }
  },
  questionText:{
    flex: 1,
    display: "flex",
    [theme.breakpoints.down('sm')]: {
      display: "none"
    }
  },
  reviewName: {
    fontSize: "22px",
    lineHeight: "26px",
    color: "#333333",
    width: "124px",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  reviewDate:{
    fontSize: "14px",
    lineHeight: "26px",
    color: "#333333"
  },
  reviewLeftBox:{
    width: "192px",
  },
  reviewItemWrap: {
    width: "100%",
    borderTop: "solid 1px #D8D8D8",
    paddingTop: "28px",
    paddingBottom: "28px",
    // height: "198px",
  },
  popover:{
    paddingTop: "0px",
    paddingBottom: "0px",
    "& .MuiList-padding":{
      paddingTop: "0px",
      paddingBottom: "0px",
    }
  },
  selectContainer:{
    width: "304px",
    height: "40px",
  },
  nativeInput:{
    display: "none"
  },
  menuItem:{
    background: "#D8D8D8"
  },
  writeBtn:{
    background: "black",
    color: "white",
    width: "305px",
    height: "48px",
    [theme.breakpoints.down("sm")]:{
      marginTop: "10px"
    },
    "&:hover":{
      background: "#111111",
    }
  },
  scrollBox: {
    width: "100%",
    height: "100%",
    [theme.breakpoints.down("sm")]:{
      paddingRight: "7px",
    },
  },
  score_text: {
    fontSize: "40px",
    lineHeight: "51px",
    paddingRight: "39px"
  },
  root: {
    display: "flex",
    flex: 1,
    paddingTop: "111px",
    paddingBottom: "30px",
    paddingLeft: "92px",
    paddingRight: "92px",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "7px",
      paddingRight: "7px",
    },
  },
}));

export default QATab