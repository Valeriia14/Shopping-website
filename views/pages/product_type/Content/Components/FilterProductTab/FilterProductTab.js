import React, { useMemo } from "react";
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
} from "@material-ui/core";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import { usePageData } from "@ktwebsite/hooks";
import { useStyles } from "./styles";

const FilterProductTab = (props) => {
  const classes = useStyles();
  const { filter, setFilter } = props;
  const [price, setPrice] = React.useState([4, 60]);
  const product_type = usePageData((data) => data.product_type);
  const tabActive = useMemo(() => {
    if (product_type) {
      return `${
        product_type?.min_age < 1
          ? `${product_type?.min_age * 12}m+`
          : `${product_type?.min_age}y+`
      } to ${
        product_type?.max_age < 1
          ? `${product_type?.max_age * 12}m+`
          : `${product_type?.max_age}y+`
      }`;
    } else {
      return "";
    }
  }, [product_type]);

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
                        onClick={() => {
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
                        onClick={() => {
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
                  <FormControlLabel
                    className={classes.formControlLabel}
                    control={
                      <Checkbox
                        disabled={true}
                        checked={true}
                        checkedIcon={
                          <CheckBoxOutlinedIcon
                            className={classes.iconDisable}
                          />
                        }
                      />
                    }
                    label={tabActive}
                  />
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
