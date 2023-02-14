import { CardMedia, colors, Typography, CardActions, Button, Grid, Box, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { Fragment, useCallback, useState, useEffect} from "react";
import { useDropzone } from "react-dropzone";
import { CropperImage, RenderGuard, LoadingIndicator } from "@ktwebsite/components";
// import { ReactComponent as Shape } from "assets/images/icons/Image_icon.svg";


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 0,
    paddingRight: 0,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column"
    }
  },
  dropZone: {
    outline: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignItems: "center",
    border: 'dashed 1px #A5A9B9',
    borderRadius: '5px',
    width: "100%",
    paddingTop: "20px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    }
  },
  dragActive: {
    backgroundColor: colors.grey[50],
    opacity: 0.5,
  },
  image: {
    width: 130,
  },
  info: {
    marginTop: theme.spacing(1),
  },
  list: {
    maxHeight: 320,
  },
  actions: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  error: {
    flex: 1,
  },
  media: {
    height: 240,
  },
  loaderBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  actionRes: {
    padding: "16px 12px",
  },
  note: {
    color: "#A5A9B9",
    marginTop: 2,
    lineHeight: "24px",
    fontSize: "10px",
    fontStyle: "italic"
  },
  contentBox: {
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  divider: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
  },
  hr:{
    height:1,
    width:76,
    backgroundColor:"#C9D1D9"
  },
  button: {
    backgroundColor: "black",
    height: "22px",
    width: "130px",
    color: "white",
    fontSize: "10px",
    fontStyle: "italic",
    textTransform: "uppercase",
    marginTop: "2px",
    borderRadius: 0,
    border: "none",
    "&:hover": {
      backgroundColor: "grey",
    },
  },
  title:{
    fontSize: '14px',
    color: "#333333"
  },
  img:{
    width: "100%",
    height: "100%",
    objectFit: "contain"
  },
  delBtn:{
    position: "absolute",
    top: 0,
    right: 0,
    width: "16px",
    height: "16px"
  },
  previewImgWrap: {
    width: "84px",
    height: "84px",
    background: "#D8D8D8",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginTop: "18px",
      width: "126px",
      height: "126px"
    },
  },
  previewWrap:{
    paddingLeft: "28px",
    height: "200px",
    display: "flex",
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "0px",
      height: "auto",
    },
  }
}));

const Dropzone = (props) => {
  const { addFile, files, deleteFile } = props
  const classes = useStyles();
  const mimes = ["image/jpeg", "image/png"];
  const [ loading, setLoading ] = useState(false)
 
  const handleDrop = useCallback(acceptedFile => {    
    // eslint-disable-next-line no-undef
    let reader = new FileReader();
    reader.onloadend = () => {
      const newFile = {
        file: acceptedFile[0],
        uri: reader.result
      }
     addFile(newFile)
     setLoading(false)
    };
    if (acceptedFile[0]) {
      setLoading(true)
      reader.readAsDataURL(acceptedFile[0]);
    }
    // setError(null);
  }, []);

  const handleSaveImage = useCallback((e,name,file) => {
    setFile(file)
    // eslint-disable-next-line no-undef
    let reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result)
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  },[]);

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: handleDrop,
  });

  const handleDelete = useCallback((id)=>{
    setLoading(true)
    deleteFile(id)
    // eslint-disable-next-line no-undef
    setTimeout(()=>{
      setLoading(false)
    }, 100)
  }, [])
  
  return (
    <Container className={classes.root}>
        <div
          className={clsx({
            [classes.dropZone]: true,
            [classes.dragActive]: isDragActive,
          })}
          {...getRootProps()}
        >
          <div>
            <img src="/images/image-attachment.png" width={16} height={16}/>
          </div>
          <div className={classes.contentBox}>
            <Typography gutterBottom className={classes.title}>
              Drag & Drop image here
            </Typography>
            <div className={classes.divider}>
              <div className={classes.hr}/>&nbsp;&nbsp;or&nbsp;&nbsp;<div className={classes.hr}/>
            </div>
            <Button className={classes.button}>
              <input {...getInputProps()} accept={mimes} />
              Browse
            </Button>
            <div className={classes.note}>
              Maximum size : 5MB
            </div>
            <div className={classes.note}>
              Able to submit up to <u>&nbsp;4&nbsp;</u> images
            </div>
          </div>
        </div>
    
    
      <Box className={classes.previewWrap}>
      {
          Array(4).fill(0).map((prop, index)=>{
            const file = files[index]
            return (
                  <Box
                      key={index} 
                      className={classes.previewImgWrap} 
                      justifyContent={"center"} alignItems={"center"} position={'relative'}>
                    
                    {
                    file?.uri&&
                      <img 
                      className={classes.img}
                      src={file?.uri} />
                    }
                    
                    
                    {file?.uri&&
                      <img
                        onClick={()=>handleDelete(index)}
                        className={classes.delBtn}
                        src="/images/del-icon.png"
                      />
                    }
                </Box>
            )
          })
        }
      </Box>
      
    </Container>
  );
};

Dropzone.propTypes = {
  className: PropTypes.string
};

Dropzone.defaultProps = {
  loaderClass: "",
  mediaClass: null,
  purpose: "upload",
};

export default Dropzone;
