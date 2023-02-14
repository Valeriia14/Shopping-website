import { ErrorMessage, FancyButton, ProductRow, QuantityInput, RatingStar, BaseButton } from "@ktwebsite/components";
import { useCart, usePageData, useSelfAccount } from "@ktwebsite/hooks";
import useApi from "@ktwebsite/utils/api/useApi";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { formatMoney, parseNumber } from "@ktwebsite/utils/strings/generators";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import moment from 'moment'
import { Box, InputBase, TextField, Grid, InputLabel, lighten, makeStyles, MenuItem, Select, Typography, Tab, Tabs, Button, Modal } from "@material-ui/core";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import { useSnackbar } from "notistack";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { setTokenSourceMapRange } from "typescript";
import { Dropzone, Preview } from "./components";
import Slider from "react-slick";
import ArrowLeftSharpIcon from "@material-ui/icons/ArrowLeftSharp";
import ArrowRightSharpIcon from "@material-ui/icons/ArrowRight";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

function NextArrow(props) {
  const { slideCount, currentSlide, ...rest } = props;
  return (
    <div {...rest}>
      <ArrowRightSharpIcon fontSize="large" />
    </div>
  );
}

function PrevArrow(props) {
  const { slideCount, currentSlide, ...rest } = props;
  return (
    <div {...rest}>
      <ArrowLeftSharpIcon fontSize="large" />
    </div>
  );
}
const settings = {
  dots: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
  centerMode: true,
  centerPadding: "100px",
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  
  // responsive: [{
  //   breakpoint: 960,
  //   settings: {
  //     arrows: false,
  //     slidesToShow: 1,
  //   }
  // }, {
  //   breakpoint: 600,
  //   settings: {
  //     arrows: false,
  //     slidesToShow: 1,
  //   }
  // }],
};


const ReviewTab = (props) => {
  const { children, className, ...rest } = props;
  const api = useApi();
  const [cart, setCart] = useCart();
  const { enqueueSnackbar } = useSnackbar();
  const product = usePageData(data => data.product);
  const [sort, setSort] = useState('recent')
  const [showModal, setShowModal] = useState(false)
  const [ token, setToken ] = useState('')
  const classes = useStyles();
  const data = usePageData(data=>data)
  const [ email, setEmail ] = useState('')
  const self = useSelfAccount();
  const [ loading, setLoading ] = useState(false)
  const [ rvCategory, setRVCategory ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ designId, setDesignId ] = useState(0)
  const [files, setFiles] = useState([])
  const [ attachment, setAttachment ] = useState(null)
  const category = usePageData(data=>data.category)
  const { rating, reviews } = data
  const sortEngine = useCallback((sort)=>{
    switch(sort){
      case 'recent':
        return function(a, b){
          return moment(b.updated_at).diff(a.updated_at)
        }
      case 'oldest':
        return function(a, b){
          return moment(a.updated_at).diff(b.updated_at)
        }
      case 'high-row-ratings':
        return function(a, b){return b.score - a.score}
      case 'row-high-ratings':
        return function(a, b){return a.score - b.score}
      case 'most-helpful':
        return function(a, b){return b.helpful - a.helpful}
      default:
       return function(a, b){
          return moment(a.updated_at).diff(b.updated_at)
        }          
    }
  }, [])
  
  const [ score, setScore ] = useState(0)
  const sorted_reviews = useMemo(()=>{
    return reviews.sort(sortEngine(sort))
  }, [sort, sortEngine])
  const review_name = useCallback((prop)=>{
    if(!prop.account) return "Jane Doe"
    return prop.account?.firstname|| " " + " " + prop.account?.lastname||" "
  }, [])
  const review_time = useCallback((prop)=>{
    return moment(prop.updated_at).format("DD MMM YYYY")
  }, [])

  const handleLike = useCallback(async (review, like)=>{
    if(like){
      await api.path(`public/review/helpful`, { review_id : review.id }).get()
    }else{
      await api.path(`public/review/dislike`, { review_id : review.id }).get()
    }
    // eslint-disable-next-line no-undef
    window.location.reload()
  }, [])

  useEffect(()=>{
    // eslint-disable-next-line no-undef
    setToken(localStorage.getItem("sessionToken"))
  }, [])

  const handleAddFile = useCallback((file)=>{
    if(files.length > 3) return 
    let newFiles = files
    newFiles.push(file)
    setFiles(newFiles)
  }, [ files ])

  const handleDeleteFile = useCallback((id)=>{
    let tmp = files
    tmp.splice(id, 1)
    setFiles(tmp)
  }, [files])

  const handleSubmit = useCallback(async()=>{
    if(!email || !firstName){
      enqueueSnackbar("You need to fill in email and name required fields!", {
        variant: "error",
      });
      return;
    }
    setLoading(true);
    const body = {
      comment: description,
      product_id: product.id,
      // category_id: categoryId,
      design_id: designId,
      first_name : firstName,
      email: email,
      account_id: self.id ,
      score: score,
      product_type_id: product.product_type_id
    }
    const result = await api.path("public/review").post({ body })
    const model = result.data.result.model
    for(let i=0; i < files.length; i++){
      // eslint-disable-next-line no-undef
      let formData = new FormData()
      formData.append("image", files[i]["file"]);
      api.path("public/review/image", { review_id : model.id }).multipost({ body: formData })
    }
    enqueueSnackbar("Your review has been sent!", {
      variant: "success",
    });
    // eslint-disable-next-line no-undef
    window.location.reload()
  }, [description, files, designId, firstName, email, score])
  return (
    <Box  className={classes.root}>
      <Modal
        open={showModal && !token ? true :false}
        onClose={()=>setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.modalBox}>
          <Typography 
            onClick={()=>{
              setShowModal(false)
            }}
            className={classes.closeX}>X</Typography>
          <Typography className={classes.modalDescription} id="modal-modal-description" sx={{ mt: 2 }}>
            Only registered users can write reviews. Please Sign in or create an account. You will be redirected to the login page when you click the button.
          </Typography>
          <Box flexDirection="row" display="flex" alignItems="center" justifyContent="center" marginBottom="35px" marginTop="30px">
            <Button 
              onClick={()=>{
                setShowModal(false)
              }}
              className={classes.cancelBtn}>
              Cancel
            </Button>
            <Button className={classes.loginBtn}
              onClick={()=>{
                doRedirect("/auth/signin");
              }}
            >
              Go To Login
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={showModal && token ? true : false}
        onClose={()=>setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.modalBox}>  
          <Typography className={classes.review_title} id="modal-modal-description" sx={{ mt: 2 }}>
            Review
          </Typography>
          <Box alignItems={"flex-start"} className={classes.modalHeader}>
            <Typography>{`Your rating stars ${score} out of 5`}</Typography>
            <Box flexDirection={'row'} display={'flex'}>
              <RatingStar editable={true} size="31px" setScore={setScore}/>
              <Box flex={1}></Box>
            </Box>
            
          </Box>
          <Grid container spacing={2} >
            <Grid item md={6} sm={12}>
              <Box className={classes.inputBaseWrap}>
                <Typography>Email</Typography>
                <InputBase
                  onChange={(e)=>{
                    setEmail(e.target.value)
                  }}
                  inputProps={{autoComplete: "off"}}
                  name="email"
                  title="Email"
                  type="email"
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
                  inputProps={{autoComplete: "off"}}
                  name="firstName"
                  type="text"
                  required
                />
              </Box>
            </Grid>
            
            <Grid item md={6} sm={12} xs={12}>
              <Select
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
              style={{marginTop: "20px", borderRadius: "5px"}}
              placeholder="Description"
              multiline
              minRows={4}
              maxRows={6}
              fullWidth
              variant="outlined"
              onChange={(e)=>{
                
                setDescription(e.target.value)
              }}
            />
          </Grid>
          <Grid item md={12} sm={12}>
            <Typography className={classes.uploadText}>Upload Files</Typography>
            <Dropzone
              addFile={handleAddFile}
              files={files}
              deleteFile={handleDeleteFile}
            />
          </Grid>
          
          <Box flexDirection="row" display="flex" alignItems="center" justifyContent="center" marginBottom="35px" marginTop="30px">
            <Button className={classes.cancelBtn}
              onClick={()=>setShowModal(false)}
            >
              Cancel
            </Button>
            <BaseButton 
             loading={loading}
              onClick={()=>{
                // setShowModal(false)
                handleSubmit()
              }}
              buttonClassName={classes.loginBtn}
              text="Post">
            </BaseButton>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={attachment || false}
        onClose={()=>setAttachment(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.modalTransBox}> 
          {/* <Slider
            className="slick_attachment_slider"
            {...settings}
          >
          {
            attachment?.map((p, key) => (
              <Box key={`attachment-carousel-slick-item-${key}`}>
                <Box className={classes.cardContainer}>
                  <img className={classes.cardImage} src={p.uri}/>
                </Box>
              </Box>
            ))
          }
          </Slider> */}
          <div className="carousel-container">
                <Carousel infiniteLoop autoPlay useKeyboardArrows centerMode dynamicHeight>
                {
                  attachment?.map((p, key) => (
                    <div key={key}>
                      <img style={{objectFit: 'scale-down'}} src={p.uri}/>
                     </div>
                  ))
                }                  
                </Carousel>
            </div>
        </Box>
      </Modal>
      <Box className={classes.scrollBox}>
        <Grid container spacing={2}>
          <Grid item sm={12} md={8}>
            <Box flexDirection="row" alignItems="center" justifyContent="flex-start" display="flex">
              <Typography className={classes.score_text}>{rating?.average?.toFixed(2) || "0.00"} / 5.00</Typography>
              <RatingStar score={rating?.average} editable={false}/>
            </Box>
          </Grid>
          <Grid item sm={12} md={4}>
            <Box>
              <Button onClick={()=>setShowModal(true)} className={classes.writeBtn}>Write a review</Button>
            </Box>
          </Grid>  
        </Grid>
        <Box marginTop="40px" marginBottom="51px">
          <Select className={classes.selectContainer}
            classes={{root: classes.select, selectMenu: classes.menuItem, nativeInput: classes.nativeInput}}
            labelId="size"
            defaultValue={"none"}
            variant="outlined"
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left"
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left"
              },
              getContentAnchorEl: null,
              // PopoverClasses={...{root: classes.popover, papaer: classes.popover}}
            }}
            onChange={(e)=>{
              setSort(e.target.value)
            }}
          >
            <MenuItem value="recent" className={classes.menuItem}> Recent </MenuItem>
            <MenuItem value="oldest" className={classes.menuItem}> Oldest </MenuItem>
            <MenuItem value="high-row-ratings" className={classes.menuItem}> High to low ratings </MenuItem>
            <MenuItem value="row-high-ratings" className={classes.menuItem}> Low to high ratings </MenuItem>
            <MenuItem value="most-helpful" className={classes.menuItem}> Most Helpful </MenuItem>
          </Select>
        </Box>

        <Box flexDirection="column" display="flex">
          {
            sorted_reviews?.map((prop, key)=>{
              console.log(prop)
              return (
                <Box key={key} flexDirection="row" display="flex" className={classes.reviewItemWrap}>
                  <Grid container spacing={2}>
                    <Grid item sm={12} md={2}>
                      <Box display="flex" flexDirection="column" className={classes.reviewLeftBox}>
                        <Typography className={classes.reviewName}>{review_name(prop)}</Typography>
                        <Typography className={classes.reviewDate}>{review_time(prop)}</Typography>
                      </Box>
                    </Grid>
                    <Grid item sm={12} md={10}>
                      <Box flexDirection="column" display="flex" alignItems="flex-start">
                        <RatingStar score={prop.score} editable={false} setScore={setScore}></RatingStar>
                        <Typography className={classes.reviewText}>{prop.comment}</Typography>
                        {prop.assets && prop.assets.length ? (
                          <Box display="flex" flexDirection="row" alignItems="center" 
                          onClick={()=>{
                            setAttachment(prop.assets)
                          }}
                        >
                          <img src="/images/image-attachment.png" width={24} height={24}/>
                          <Typography className={classes.viewAttachment}>View image attachment</Typography>
                        </Box>
                        ) : ""}
                        <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%" alignItems="center" marginTop="20px" flexWrap="wrap">
                            <Typography className={classes.varientText}>Varient: Design, pinkfrong, Size: 550ml</Typography>
                            <Box display="flex" flexDirection="row" alignItems="center" className={classes.helpfulWrap}>
                              <Typography className={classes.helpfulText}>Was this helpful</Typography>
                              
                              <img 
                                onClick={()=>handleLike(prop, true)}
                                src="/images/Thumbs_up_icon.png" className={classes.thumbImg} />
                              <Typography className={classes.num}>{prop.helpful || 0}</Typography>

                              <img 
                                onClick={()=>handleLike(prop, false)}
                                src="/images/Thumbs_down_icon.png" className={classes.thumbImg} />
                              <Typography className={classes.num}>{prop.dislike || 0}</Typography>
                            </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )
            })
          }
        </Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme) => ({
  carouselContainer: {
    maxHeight: "500px"

  },
  cardContainer:{
    width: "100%",
    height: "500px",
    position: 'relative'
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain"
  },
  uploadText:{
    marginTop: "8px",
    fontSize: "14px",
    fontStyle: "italic",
    marginBottom: "14px"
  },
  modalHeader:{
    marginBottom: "26px"
  },
  inputBaseWrap:{
    border: "solid 1px #A6A6A6",
    height: "60px",
    borderRadius: "5px",
    paddingLeft: "21px",
    paddingTop: "9px",
    "& p":{
      fontSize: "10px"
    }
  },
  review_title: {
    fontSize: "24px"
  },
  modalDescription: {
    paddingLeft: "53px",
    paddingRight: "53px",
    [theme.breakpoints.down("sm")]:{
      paddingLeft: "3px",
      paddingRight: "3px",
    },
    fontSize: "20px",
    fontStyle: "italic"
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
  loginBtn:{
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
  modalTransBox:{
    overflowY: 'hidden',
    maxHeight: "100vh",
    position: 'absolute',
    padding: "10px 10px",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "850px",
    [theme.breakpoints.down("sm")]: {
      width: "80%" ,
      padding: "10px 10px 10px 10px",
    },
    background: "transparent",
    boxShadow: 24,
  },
  modalBox:{
    overflowY: 'auto',
    maxHeight: "100vh",
    position: 'absolute',
    padding: "40px 100px 40px 100px",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "850px",
    [theme.breakpoints.down("sm")]: {
      width: "80%" ,
      padding: "10px 10px 10px 10px",
    },
    background: "white",
    boxShadow: 24,
  },
  thumbImg: {
    width: "16px",
    height: "16px",
    objectFit: "contain",
    marginLeft: "16px"
  },
  helpfulWrap:{
    [theme.breakpoints.down("sm")]:{
      width: "100%",
      marginTop: "20px"
    },
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
    lineHeight: "14px",
    marginLeft: "4px",
    textDecoration: "underline",
    textDecorationColor: "black",
    cursor: "pointer"
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
    color: "#333333",
    paddingBottom: "10px"
  },
  reviewName: {
    fontSize: "22px",
    lineHeight: "26px",
    color: "#333333"
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
    // background: "#D8D8D8"
  },
  writeBtn:{
    background: "black",
    color: "white",
    width: "305px",
    height: "48px"
  },
  scrollBox: {
    width: "100%",
    height: "100%",
  },
  score_text: {
    fontSize: "40px",
    lineHeight: "51px",
    paddingRight: "39px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "30px",
    }
  },
  root: {
    display: "flex",
    flex: 1,
    paddingTop: "111px",
    paddingBottom: "90px",
    paddingLeft: "92px",
    paddingRight: "92px",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "10px",
      paddingRight: "10px"
    },
  },
}));

export default ReviewTab