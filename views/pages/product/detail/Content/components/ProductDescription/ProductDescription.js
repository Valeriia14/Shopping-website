import {
  ErrorMessage,
  FancyButton,
  ProductRow,
  QuantityInput,
  RatingStar,
} from "@ktwebsite/components";
import { useCart, usePageData } from "@ktwebsite/hooks";
import useApi from "@ktwebsite/utils/api/useApi";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { formatMoney, parseNumber } from "@ktwebsite/utils/strings/generators";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import {
  Box,
  ButtonBase,
  Divider,
  lighten,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Link,
  TextField,
} from "@material-ui/core";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import cookie from "cookie";
import LaunchIcon from "@material-ui/icons/Launch";
import {
  EmailShareButton,
  FacebookShareButton,
  InstapaperShareButton,
  TwitterShareButton,
} from "react-share";
const ProductDescription = (props) => {
  const { children, className, ...rest } = props;
  const api = useApi();
  const [cart, setCart] = useCart();
  const { enqueueSnackbar } = useSnackbar();
  const data = usePageData((data) => data);
  const product = usePageData((data) => data.product);
  const similarProducts = usePageData((data) => data.similar_products);
  const product_designs = usePageData((data) => data.product_designs);
  const rating = usePageData((data) => data.rating);
  const classes = useStyles();

  const [quantity, setQuantity] = useState(1);
  const [accessories, setAccessories] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [accessoryDiscount, setAccessoryDiscount] = useState(0);
  const [accessoryDiscountType, setAccessoryDiscountType] = useState();
  const [accessory, setAccessory] = useState({});
  const [accessoryMenus, setAccessoryMenus] = useState([]);
  const [giftMenus, setGiftMenus] = useState([]);
  const [gift, setGift] = useState({});
  const [openAccessory, setOpenAccessory] = useState(false);
  const [openGift, setOpenGift] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [checkIconMark, setCheckIconMark] = useState("bottle-1");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const discount = useMemo(() => {
    if (product?.group?.discount_type == "percent") {
      return `${product?.group?.discount_value}% `;
    } else {
      return `$${product?.group?.discount_value}`;
    }
  }, [product]);
  const totalPrice = useMemo(() => {
    let price = product.price;
    setAccessories(product.accessory.items);
    setAccessoryDiscountType(product.accessory.discount_type);
    setAccessoryDiscount(product.accessory.discount_value);
    setGifts(product.gift.items);
    if (product.group && product.group.type == "discount") {
      price = price * ((100 - product.group.discount_value) / 100);
    }
    if (accessory?.id) {
      if (accessoryDiscountType == "percent") {
        price = price + accessory.price * ((100 - accessoryDiscount) / 100);
      } else {
        price = price + accessory.price - accessoryDiscount;
      }
    }
    return parseNumber(price).times(quantity).decimalPlaces(2);
  }, [quantity, product, accessory, accessoryDiscount]);

  const [runAddCart, loadingAddCart, errorAddCart] = useAsyncTask("addCart");
  const [runCheckout, loadingCheckout, errorCheckout] =
    useAsyncTask("checkout");
  const [runReloadCart] = useAsyncTask("reloadCart");

  const handleSelectAccessory = (e) => {
    if (e.target.value == "none") {
      setAccessory({});
    } else {
      setAccessory(e.target.value);
    }
  };

  const handleSelectGift = (e) => {
    if (e.target.value == "none") {
      setGift({});
    } else {
      setGift(e.target.value);
    }
  };

  const addToCart = async () => {
    const product_id = product.id;
    const session_ids = cookie.parse(document?.cookie)?.session_ids || null;
    // const body = { quantity, accessory_id: accessory?.id, gift_id: gift?.id };
    const session_id = session_ids ? JSON.parse(session_ids).slice(-1) : null;
    const body = { session_id };
    await api.path("public/cart/cart_item/add", { product_id }).post({ body });
    reloadCart();
  };

  const onAddToCart = () => {
    runAddCart(async () => {
      await addToCart();
      enqueueSnackbar("Added to cart", {
        variant: "success",
      });
    });
  };
  const onCheckOut = () => {
    runCheckout(async () => {
      await addToCart();
      doRedirect("/cart");
      enqueueSnackbar("Added to cart, checking out…", {
        variant: "success",
      });
    });
  };

  const reloadCart = () => {
    runReloadCart(async () => {
      const session_ids = cookie.parse(document?.cookie)?.session_ids || null;
      const response = await api
        .path("public/cart/cart_item/list", { session_ids })
        .get();
      const cart = response.data.result;
      setCart(cart);
    });
  };

  const calcDiscountedPrice = (price) => {
    if (accessoryDiscountType == "percent") {
      return formatMoney(
        new BigNumber((price * (100 - accessoryDiscount)) / 100)
      );
    } else {
      return formatMoney(new BigNumber(price - accessoryDiscount));
    }
  };

  useEffect(() => {
    let accGroup = [];
    let noneAccComponent = (
      <MenuItem className={classes.selectItem} value={"none"}>
        {openAccessory ? "None" : "Accessories"}
      </MenuItem>
    );
    accGroup.push(noneAccComponent);
    accessories?.map((acc, id) => {
      accGroup.push(
        <MenuItem key={id} className={classes.selectItem} value={acc}>
          <Box className={classes.imageContainer}>
            <img
              src={
                acc?.preview?.uri
                  ? acc?.preview?.uri
                  : "/images/placeholder.png"
              }
              className={classes.image}
            />
          </Box>
          <Box>
            <Typography>{acc.name}</Typography>
            <Typography className={classes.discountedValue}>
              Price: ${calcDiscountedPrice(acc.price)}
            </Typography>
          </Box>
        </MenuItem>
      );
    });
    setAccessoryMenus(accGroup);

    let giftGroup = [];
    let noneGiftComponent = (
      <MenuItem className={classes.selectItem} value={"none"}>
        {openGift ? "None" : "Free Gifts"}
      </MenuItem>
    );
    giftGroup.push(noneGiftComponent);
    gifts?.map((gift, id) => {
      giftGroup.push(
        <MenuItem key={id} className={classes.selectItem} value={gift}>
          <div className={classes.imageContainer}>
            <img
              src={
                gift?.preview?.uri
                  ? gift?.preview?.uri
                  : "/images/placeholder.png"
              }
              className={classes.image}
            />
          </div>
          <span>{gift.name}</span>
        </MenuItem>
      );
    });
    setGiftMenus(giftGroup);
  }, [accessories, openAccessory, gift, openGift]);

  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      <Box display="flex" flexDirection="column">
        <Box className={classes.tagWrap}>
          {product?.is_new && (
            <Typography className={clsx(classes.tagText, classes.pink)}>
              NEW
            </Typography>
          )}
          {product?.promo_price && (
            <Typography className={clsx(classes.tagText, classes.blue)}>
              SALE
            </Typography>
          )}
          {product?.has_gift && (
            <Typography className={clsx(classes.tagText, classes.red)}>
              FREE GIFT
            </Typography>
          )}
        </Box>
        <Typography className={classes.title}>{product?.name}</Typography>
        <Box className={classes.reviewContainer}>
          <Box className={classes.reviewText}>
            <img src="/images/Age_icon.svg" />
            <Typography className={classes.desc}>
              {product.product_type
                ? `${product.product_type.customer_segment} : ${product.product_type.min_age}+ MONTHS OLD AND ABOVE`
                : "6+ MONTHS OLD AND ABOVE"}
            </Typography>
          </Box>
          <Box className={classes.reviewWrap}>
            <RatingStar className={classes.rating} score={rating.average} />
            <Typography className={classes.reviewCount}>
              {" "}
              {rating.count || 0} REVIEWS{" "}
            </Typography>
          </Box>
        </Box>
        <Typography className={classes.description}>
          {product?.product_type?.description ||
            "Ut enim ad minim veniam, quis nostru irure dolor exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit a commodo consequat irure dolor."}
        </Typography>
        <Box className={classes.priceBox}>
          {product?.promo_price ? (
            <Fragment>
              <Typography className={classes.price}>
                ${formatMoney(product?.promo_price)}
              </Typography>
              <Typography className={classes.salePrice}>
                ${formatMoney(product?.price)}
              </Typography>
              <Box className={classes.discountPercent}>
                <Typography>
                  {Math.round(
                    ((product?.price - product?.promo_price) / product?.price) *
                      100
                  )}
                  %
                </Typography>
              </Box>
            </Fragment>
          ) : (
            <Fragment>
              <Typography className={classes.price}>
                ${formatMoney(product?.price)}
              </Typography>
            </Fragment>
          )}
        </Box>
      </Box>
      <Box>
        <Divider />
      </Box>
      <Accordion
        className={classes.accord}
        expanded={expanded == "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={
            expanded != "panel1" ? (
              <AddIcon className={classes.expand_icon} />
            ) : (
              <RemoveIcon className={classes.expand_icon} />
            )
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Box className={classes.boxItem}>
            <Typography className={classes.contentText}>
              Material / Ingredient/ Care
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {!product?.product_info?.material_ingredient_care.length ? (
            <Typography className={classes.contentText}>Not Set</Typography>
          ) : (
            <Grid container spacing={2}>
              {product?.product_info?.material_ingredient_care.map(
                (item, index) => (
                  <Grid item lg={6} xs={6} md={6} sm={6} key={index}>
                    <Link href={item.sub_component_link} underline="none">
                      <Box display="flex" flexDirection="initial">
                        <img
                          src={item.sub_component_img}
                          width={24}
                          height={24}
                        />
                        <Typography className={classes.contentText}>
                          {item.sub_component_desc}
                        </Typography>
                      </Box>
                    </Link>
                  </Grid>
                )
              )}
            </Grid>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion
        className={classes.accord}
        expanded={expanded == "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={
            expanded != "panel2" ? (
              <AddIcon className={classes.expand_icon} />
            ) : (
              <RemoveIcon className={classes.expand_icon} />
            )
          }
          aria-controls="panel1a-content"
          id="panel2a-header"
        >
          <Box className={classes.boxItem}>
            <Typography className={classes.contentText}>Features</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {!product?.product_info?.features.length ? (
            <Typography className={classes.contentText}>No Features</Typography>
          ) : (
            <ul>
              {product?.product_info?.features.map((item, index) => (
                <li key={index}>
                  {" "}
                  <Typography className={classes.contentText}>
                    {item.sub_component_desc}
                  </Typography>
                </li>
              ))}
            </ul>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion
        className={classes.accord}
        expanded={expanded == "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          expandIcon={
            expanded != "panel3" ? (
              <AddIcon className={classes.expand_icon} />
            ) : (
              <RemoveIcon className={classes.expand_icon} />
            )
          }
          aria-controls="panel4a-content"
          id="panel4a-header"
        >
          <Box className={classes.boxItem}>
            <Typography className={classes.contentText}>
              Testing and certification
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {!product?.product_info?.certificate.length ? (
            <Typography className={classes.contentText}>
              No Certifications
            </Typography>
          ) : (
            <Box display="block">
              {product?.product_info?.certificate.map((item, index) => (
                <Link
                  href={item.sub_component_link}
                  underline="always"
                  key={index}
                >
                  <Box flexDirection="initial" display="flex">
                    <LaunchIcon />{" "}
                    <Typography className={classes.contentText}>
                      {item.sub_component_desc}
                    </Typography>
                  </Box>
                </Link>
              ))}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
      <Box className={classes.boxItem}>
        <Typography
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            lineHeight: "19px",
            textTransform: "uppercase",
          }}
        >
          Design
        </Typography>
        <Typography style={{ textDecoration: "underline", fontSize: "14px" }}>
          VIEW ALL DESIGNS({(product_designs && product_designs.length) || 0})
        </Typography>
      </Box>
      <Box>
        <Grid container style={{ justifyContent: "space-between" }}>
          {
            product_designs?.length ? product_designs.map((item,index)=>{
              return index < 4 ? (
                <Grid onClick = {()=> setCheckIconMark(item)}
                   style={{ position: "relative" }} item xs={2} md={2} key={index}>
                  <img className={classes.designImg} src={item.preview?.uri || "/images/placeholder.png"} />
                  <CheckRoundedIcon style={{display: checkIconMark.id === item.id ? 'block' : 'none' }} className={classes.CheckIcon} />
                </Grid>
              ): ""
            }) : ""
          }
          {
            product_designs?.length > 4 ? (
            <Grid item xs={2} md={2}>
                <Box className={classes.moreContainer}>
                  <Typography>+5</Typography>
                  <Typography style={{ textDecoration: "underline" }}>
                    more
                  </Typography>
                </Box>
              </Grid>
            ) : ""
          }
        </Grid>
      </Box>
      {/* <Accordion className={classes.accord}>
        <AccordionSummary
          expandIcon={<ExpandMore/>}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Box flexDirection="column" display="flex" width="100%">
            <Box className={classes.boxItem}>
              <Typography style={{fontSize: '16px', fontWeight: 'bold', lineHeight: '19px', textTransform: 'uppercase'}}>Design</Typography>
              <Typography style={{textDecoration: "underline"}}>VIEW ALL DESIGNS({similarProducts && similarProducts.length || 0})</Typography>
            </Box>
            <Box className={classes.designWrap}>
              {
                similarProducts?.map((prod, key)=>{
                  if(key<5)
                    return (
                      <Box key={key} className={classes.designItem}>
                        <img
                          src={
                            prod?.preview?.uri
                              ? prod?.preview?.uri
                              : "/images/placeholder.png"
                          }
                          alt="design"
                        />
                      </Box>
                    );
                })
              }
            </Box>
          </Box>

        </AccordionSummary>
        <AccordionDetails   >
          <Box className={classes.designWrap}>
                {
                  similarProducts?.map((prod, key)=>{
                    if(key<10 && key>4)
                      return (
                        <Box key={key} className={classes.designItem}>
                          <img
                            src={
                              prod?.preview?.uri
                                ? prod?.preview?.uri
                                : "/images/placeholder.png"
                            }
                            alt="design"
                          />
                        </Box>
                      );
                  })

                }
          </Box>
        </AccordionDetails>
      </Accordion> */}
      {gifts.length > 0 && (
        <Box
          display="flex"
          justifyContent="space-between"
          paddingRight={2}
          className={classes.selectWrap}
        >
          <Typography
            id="size"
            variant="outlined"
            className={classes.selectLabel}
          >
            GIFT
          </Typography>
          <Select
            className={classes.selectContainer}
            classes={{
              root: classes.select,
              selectMenu: classes.selectMenu,
              nativeInput: classes.nativeInput,
            }}
            labelId="size"
            defaultValue={"none"}
            variant="outlined"
          >
            {giftMenus?.map((group, id) => {
              return group;
            })}
          </Select>
        </Box>
      )}

      {accessories.length > 0 && (
        <Box
          display="flex"
          justifyContent="space-between"
          paddingRight={2}
          className={classes.selectWrap}
        >
          <Typography
            id="size"
            variant="outlined"
            className={classes.selectLabel}
          >
            ADD ON &nbsp; CAPS:
          </Typography>
          <Select
            className={classes.selectContainer}
            classes={{
              root: classes.select,
              selectMenu: classes.selectMenu,
              nativeInput: classes.nativeInput,
            }}
            labelId="size"
            defaultValue={"none"}
            variant="outlined"
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
          >
            {accessoryMenus?.map((group, id) => {
              return group;
            })}
          </Select>
        </Box>
      )}

      <Box marginTop={"30px"}>
        <Divider />
      </Box>
      <Box className={classes.printContainer}>
        <Box className={classes.printItemContainer}>
          <Typography variant="h5">NAME TO PRINT</Typography>
          <TextField />
        </Box>
        <Box className={classes.printItemContainer}>
          <Typography variant="h5">ADD ON CAPS:</Typography>
          <select className={classes.select}>
            {/* <option value='NONE' selected/> */}
            <option value="NONE">NONE</option>
            <option value={12}>12</option>
            <option value={13}>13</option>
          </select>
        </Box>
        <Box className={classes.printItemContainer}>
          <Typography variant="h5">ADD ON STRAWS</Typography>
          <select className={classes.select}>
            <option value="NONE">NONE</option>
            <option value={12}>12</option>
            <option value={13}>13</option>
          </select>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection="row"
        marginTop={"30px"}
      >
        <ButtonBase className={classes.btnBuy} onClick={onCheckOut}>
          BUY NOW
        </ButtonBase>
        <ButtonBase className={classes.btnAddCart} onClick={onAddToCart}>
          ADD TO CART
        </ButtonBase>
      </Box>
      <Box marginTop={"30px"}>
        <Divider />
      </Box>
      <Box className={classes.shareWrap}>
        <Typography className={classes.shareText}>SHARE THIS LINK</Typography>
        <Box className={classes.iconGroup}>
          <EmailShareButton
            subject={"Awesome product on Kidztime"}
            body={`${product.name}\n`}
            url={`https://staging.kidztime.com/products/${product.handle}`}
            separator=""
          >
            <img src="/images/Mail_icon.png"></img>
          </EmailShareButton>
          <FacebookShareButton
            url={`https://staging.kidztime.com/products/${product.handle}`}
          >
            <img src="/images/Fb_icon.png"></img>
          </FacebookShareButton>
          <InstapaperShareButton
            url={`https://staging.kidztime.com/products/${product.handle}`}
          >
            <img src="/images/Ig_icon.png"></img>
          </InstapaperShareButton>
          <TwitterShareButton
            url={`https://staging.kidztime.com/products/${product.handle}`}
          >
            <img src="/images/Twitter_icon.png"></img>
          </TwitterShareButton>
        </Box>
      </Box>
      <Box>
        <Divider />
      </Box>

      <ErrorMessage error={errorAddCart ?? errorCheckout} />
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  accord: {
    borderTop: "solid 1px #000000",
    borderBottom: "none",
    borderLeft: "none",
    borderRight: "none",
    "&.MuiPaper-elevation1": {
      boxShadow: "none!important",
    },
    "& .MuiAccordionSummary-root": {
      padding: 0,
    },
    "&.MuiAccordion-root:before": {
      display: "none",
    },
  },
  expand_icon: {
    color: "#000000",
  },
  contentText: {
    fontFamily: 'Cormorant-SemiBold',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: "26px",
    letterSpacing: "1.2px",
    color: "#000000 !important",
  },
  iconGroup: {
    flex: 1,
    justifyContent: "flex-end",
    display: "flex",
    "& img": {
      width: "24px",
      height: "24px",
      marginLeft: "15px",
    },
  },
  shareText: {
    flex: 1,
    fontSize: "20px",
    lineHeight: "25px",
    color: "#333333",
  },
  shareWrap: {
    flex: 1,
    height: "75px",
    paddingTop: "20px",
    paddingBottom: "20px",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  btnBuy: {
    border: "solid 1px black",
    background: "white",
    fontSize: "18px",
    lineHeight: "23px",
    color: "black",
    height: "48px",
    flex: 1,
  },
  btnAddCart: {
    flex: 1,
    marginLeft: "10px",
    height: "48px",
    background: "black",
    color: "white",
    lineHeight: "23px",
    fontSize: "18px",
  },
  selectWrap: {
    margin: "5px",
    height: "120px",
  },
  designWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: "26px",
  },
  selectLabel: {
    fontSize: "16px",
    lineHeight: "20px",
    width: "100px",
    color: "#333333",
    alignSelf: "center",
  },
  designItem: {
    width: "88px",
    height: "88px",
    display: "flex",
    background: "#D8D8D8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10px",
    [theme.breakpoints.down("xs")]: {
      width: "59px",
      height: "59px",
    },
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
  },
  boxItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px 4px",
    width: "100%",
    "& p": {
      lineHeight: "26px",
      color: "#333333",
      fontSize: "16px",
      // textTransform: "uppercase"
    },
  },
  addIcon: {
    width: "16px",
    height: "16px",
  },
  priceBox: {
    flexDirection: "row",
    display: "flex",
    height: "38px",
    alignItems: "baseline",
    marginTop: 30,
    marginBottom: 30,
  },
  price: {
    fontSize: "24px",
    color: "#000000",
    lineHeight: "38px",
    fontWeight: 600,
  },
  discountPercent: {
    "& p": {
      fontSize: "24px",
      color: "#D20000",
      lineHeight: "17px",
      fontWeight: 600,
    },
    marginLeft: "auto",
  },
  salePrice: {
    marginLeft: "15px",
    fontSize: "16px",
    lineHeight: "20px",
    color: "#7B7B7B",
    textDecoration: "line-through",
    textDecorationColor: "#7B7B7B",
  },
  description: {
    fontWeight: 500,
    lineHeight: "22px",
    fontSize: "16px",
    color: "#333333",
    marginTop: "24px",
  },
  reviewCount: {
    fontSize: "12px",
    color: "#333333",
    lineHeight: "13px",
    marginLeft: "11px",
  },
  reviewContainer: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #000000",
  },
  reviewText: {
    width: "50%",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    borderRight: "1px solid #000000",
    display: "flex",
    alignItems: "center",
    "& img": {
      marginRight: 10,
    },
  },
  reviewWrap: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px",
    },
  },
  desc: {
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "14.4px",
    color: "black",
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px",
    },
  },
  tagWrap: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    borderTop: "2px solid #000000",
    borderBottom: "1px solid #000000",
    paddingTop: 10,
    paddingBottom: 10,
  },
  tagBox: {
    background: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px 12px 5px 12px",
    marginRight: "4px",
  },
  tagText: {
    padding: "6px 10px",
    marginRight: "8px",
    fontSize: "10px",
    fontWeight: 700,
    lineHeight: "12px",
    letterSpacing: "0px",
    textAlign: "left",
    color: "white",
    // marginBottom: 8,
  },
  root: {
    paddingTop: "172px",
    paddingLeft: "110px",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "50px",
      paddingLeft: 0,
    },
    "& .MuiDivider-root": {
      display: "none",
    },
  },
  title: {
    marginTop: "10px",
    fontWeight: "700",
    fontSize: "24px",
    lineHeight: "29px",
    color: "#000000",
    paddingBottom: "10px",
    borderBottom: "1px solid #000000",
    [theme.breakpoints.down("sm")]: {
      fontSize: "18px",
    },
  },
  rating: {
    fontSize: theme.spacing(3),
    justifyContent: "flex-start",
  },
  btnCheckout: {
    backgroundColor: theme.palette.primary.dark,
    "&:hover": {
      backgroundColor: lighten(theme.palette.primary.dark, 0.1),
    },
  },
  btnAddToCart: {
    backgroundColor: "#1cb372",
    "&:hover": {
      backgroundColor: lighten("#1cb372", 0.1),
    },
  },
  selectContainer: {
    flex: 1,
    display: "flex",
  },
  select: {
    alignItems: "center",
  },
  imageContainer: {
    width: 70,
    height: 70,
    padding: 5,
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(3),
    boxShadow: "0 2px 10px rgba(0,0,0,.2)",
  },
  image: {
    width: "100%",
    height: "auto",
  },
  selectItem: {
    height: "80px",
  },
  selectMenu: {
    display: "flex!important",
  },
  nativeInput: {
    display: "none",
  },
  discountedValue: {
    color: "rgba(0,0,0, 0.5)",
    fontSize: "13px",
    lineHeight: "20px",
  },
  pink: {
    backgroundColor: "#F4C0C0",
  },
  blue: {
    backgroundColor: "#618CAC",
  },
  red: {
    backgroundColor: "#ED7777",
  },
  printContainer: {
    paddingTop: 30,
    paddingBottom: 28,
    borderBottom: " 2px solid #000000",
    "& div": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      "& input": {
        border: "1px solid #E3E3E3",
        padding: "10px 20px",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "unset",
      },
      "& .MuiInput-root": {
        width: 320,
        [theme.breakpoints.down("md")]: {
          width: 250,
        },
        "& fieldset": {
          border: "unset",
        },
        "&:hover fieldset": {
          border: "unset",
        },
        "&.Mui-focused fieldset": {
          border: "unset",
        },
      },
    },
    [theme.breakpoints.down("md")]: {
      "& h5": {
        fontSize: 14,
      },
    },
  },
  printItemContainer: {
    paddingTop: 10,
    [theme.breakpoints.down("md")]: {
      "& h5": {
        maxWidth: "calc(max(60px, 5vw))",
      },
    },
  },
  select: {
    width: 320,
    padding: "10px 17px 12px 16px",
    border: "1px solid #E3E3E3",
    fontFamily: "Barlow",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 500,
    letterSpacing: 1.2,
    textAlign: "left",
    [theme.breakpoints.down("md")]: {
      width: 250,
    },
  },
  moreContainer: {
    width: "92px",
    height: "92px",
    objectFit: "cover",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#F9F8F8",
    "& p": {
      fontFamily: "Barlow",
      fontSize: 18,
      fontStyle: "normal",
      fontWeight: 600,
    },
  },
  designImg: {
    backgroundColor: "#F9F8F8",
    width: "-webkit-fill-available",
    height: "100%",
    objectFit: "cover",
  },
  CheckIcon: {
    borderRadius:'50%',
    background: 'white',
    border: '1px solid #1E3A3A',
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
  },
}));

export default ProductDescription;
