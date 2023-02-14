import React, { Fragment, useMemo, useState } from "react";
import {
  Grid,
  ListSubheader,
  Typography,
  List,
  ListItem,
  Button,
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  TextField,
  MenuItem,
  Collapse,
} from "@material-ui/core";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import { useModel, usePageData } from "@ktwebsite/hooks";
import { useStyles } from "./styles";
import pascalize from "@ktwebsite/utils/fomatting/pascalize";
import doRedirect from "@ktwebsite/utils/doRedirect";

const FilterProductTab = (props) => {
  const classes = useStyles();
  const [model, setModel] = useModel();
  const { filter, setFilter } = props;
  const category = usePageData((data) => data.category);
  const [isCollapse, setIsCollapse] = useState({ [category?.handle]: true });
  const [price, setPrice] = React.useState([4, 60]);
  const tabActive = useMemo(() => {
    if(filter?.producttypeid){
      const productType = model?.categorysTab[0]?.productTypeTab?.filter((e) => e.id ===filter?.producttypeid)[0]
      return `${
        productType?.min_age < 1
          ? `${productType?.min_age * 12}m+`
          : `${productType?.min_age}y+`
      } to ${
        productType?.max_age < 1
          ? `${productType?.max_age * 12}m+`
          : `${productType?.max_age}y+`
      }`;
    }
    else {
      return ""
    }
  }, [model])

  const handleClearFilter = () => {
    setFilter({
      ...filter,
      gender: "1,1",
      price: "4,60",
      sortby: "price:asc",
      age: null,
    });
  };

  const CheckboxCustom = (props) => {
    return (
      <Checkbox
        {...props}
        color="default"
        classes={{
          root: classes.inputRoot,
          checked: classes.checked,
        }}
        className={classes.checkBox}
        icon={<CheckBoxOutlineBlankOutlinedIcon className={classes.icon} />}
        checkedIcon={<CheckBoxOutlinedIcon className={classes.icon} />}
      />
    );
  };

  const showContent = () => {
    return model?.categorysTab?.map((item, index) => {
      return (
        <List
          component="nav"
          key={index}
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader
              className={classes.subheaderTextLv2}
              component="div"
              id="nested-list-subheader"
              onClick={() => {
                if (item?.category !== category?.handle) {
                  doRedirect(`/category/${item?.category}`);
                } else {
                  setIsCollapse({
                    ...isCollapse,
                    [category?.handle]: !isCollapse[category?.handle],
                  });
                  if (isCollapse[category?.handle]) {
                    setFilter({ ...filter, producttypeid: null });
                    setModel({ ...model, tabActive: null });
                  }
                }
              }}
            >
              {pascalize(item?.category)}
            </ListSubheader>
          }
          className={classes.root}
        >
          <Collapse in={isCollapse[item?.category]}>
            {item?.productTypeTab?.map((pt, index) => {
              return (
                <ListItem
                  key={index}
                  className={classes.childText}
                  button
                  onClick={() => {
                    setFilter({ ...filter, producttypeid: pt?.id });
                    setModel({ ...model, tabActive: pt?.handle });
                  }}
                >
                  <Typography
                    className={
                      filter?.producttypeid === pt?.id ? classes.active : ""
                    }
                  >
                    {pascalize(pt?.handle)}
                  </Typography>
                </ListItem>
              );
            })}
          </Collapse>
        </List>
      );
    });
  };

  return (
    <Grid xs={3} item>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            className={classes.subheaderTextLv1}
            component="div"
            id="nested-list-subheader"
          >
            CATEGORY
          </ListSubheader>
        }
        className={classes.root}
      >
        {showContent()}
      </List>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            className={classes.subheaderTextLv1}
            component="div"
            id="nested-list-subheader"
          >
            FILTER
            <Button onClick={handleClearFilter} className={classes.clearButton}>
              Clear
            </Button>
          </ListSubheader>
        }
        className={classes.root}
      >
        <ListItem className={classes.childFilterText}>
          <Box>
            <Typography className={classes.titleFilter}>GENDER</Typography>
            <Box m="12px 0px">
              <FormControl component="fieldset" className={classes.formControl}>
                <FormGroup>
                  <FormControlLabel
                    className={classes.formControlLabel}
                    control={
                      <CheckboxCustom
                        checked={filter?.gender?.split(",")[0] === "1"}
                        onClick={(event) => {
                          setFilter({
                            ...filter,
                            gender: `1,0`,
                          });
                        }}
                        name="Boy"
                      />
                    }
                    label="Boy"
                  />
                  <FormControlLabel
                    className={classes.formControlLabel}
                    control={
                      <CheckboxCustom
                        checked={filter?.gender?.split(",")[1] === "1"}
                        onClick={(event) => {
                          setFilter({
                            ...filter,
                            gender: `0,1`,
                          });
                        }}
                        name="Girl"
                      />
                    }
                    label="Girl"
                  />
                </FormGroup>
              </FormControl>
            </Box>
          </Box>
        </ListItem>
        <ListItem className={classes.childFilterText}>
          <Box width="100%">
            <Typography className={classes.titleFilter}>PRICE</Typography>
            <Box margin="28px 0px 12px 0px!important">
              <Box display="flex" justifyContent="space-between">
                <Typography className={classes.priceText}>$4</Typography>
                <Typography className={classes.priceText}>$60</Typography>
              </Box>
              <Box p="0 6px">
                <Slider
                  value={price}
                  onChange={(event, newValue) => {
                    setPrice(newValue);
                  }}
                  onChangeCommitted={(event, newValue) => {
                    setFilter({ ...filter, price: newValue.toString() });
                  }}
                  valueLabelDisplay="auto"
                  className={classes.slider}
                  min={4}
                  max={60}
                  aria-labelledby="vertical-slider"
                  marks={[
                    {
                      value: 4,
                    },
                    {
                      value: 60,
                    },
                  ]}
                />
              </Box>
            </Box>
          </Box>
        </ListItem>
        <ListItem className={classes.childText}>
          <Box>
            <Typography className={classes.titleFilter}>AGE</Typography>
            <Box m="12px 0px">
              <FormControl component="fieldset" className={classes.formControl}>
                <FormGroup>
                  {!filter?.producttypeid && (
                    <Fragment>
                      <FormControlLabel
                        className={classes.formControlLabel}
                        control={
                          <CheckboxCustom
                            checked={filter?.age === "0.5-2.9"}
                            onClick={() => {
                              setFilter({ ...filter, age: "0.5-2.9" });
                            }}
                          />
                        }
                        label="6m+ to 2y+"
                      />
                      <FormControlLabel
                        className={classes.formControlLabel}
                        control={
                          <CheckboxCustom
                            checked={filter?.age === "3-5.9"}
                            onClick={() => {
                              setFilter({ ...filter, age: "3-5.9" });
                            }}
                          />
                        }
                        label="3y+ to 5y+"
                      />
                      <FormControlLabel
                        className={classes.formControlLabel}
                        control={
                          <CheckboxCustom
                            checked={filter?.age === "6-10000"}
                            onClick={() => {
                              setFilter({ ...filter, age: "6-10000" });
                            }}
                          />
                        }
                        label="6y+ & Above"
                      />
                    </Fragment>
                  )}
                  {
                    filter?.producttypeid && 
                    <FormControlLabel
                        className={classes.formControlLabel}
                        control={
                          <Checkbox
                            disabled={true}
                            checked={true}
                            checkedIcon={<CheckBoxOutlinedIcon className={classes.iconDisable} />}
                          />
                        }
                        label={tabActive}
                      />
                  }
                </FormGroup>
              </FormControl>
            </Box>
          </Box>
        </ListItem>
      </List>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            className={classes.subheaderTextLv1}
            component="div"
            id="nested-list-subheader"
          >
            SORT BY
          </ListSubheader>
        }
        className={classes.root}
      >
        <ListItem className={classes.childText}>
          <Box width="100%">
            <TextField
              className={classes.textField}
              id="outlined-select-currency"
              select
              value={filter?.sortby}
              onChange={(event) => {
                setFilter({
                  ...filter,
                  sortby: event.target.value,
                });
              }}
              fullWidth
              variant="outlined"
            >
              {[
                { label: "Price: Low to High ", value: "price:asc" },
                { label: "Price: High to Low", value: "price:desc" },
                { label: "Recent", value: "created_at:asc" },
                { label: "Best Selling", value: "" },
              ].map((option, index) => (
                <MenuItem key={index} value={option?.value}>
                  {option?.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </ListItem>
      </List>
    </Grid>
  );
};

export default FilterProductTab;
