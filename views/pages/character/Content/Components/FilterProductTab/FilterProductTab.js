import React from "react";
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
import { useModel, usePageData } from "@ktwebsite/hooks";
import { useStyles } from "./styles";

const FilterProductTab = (props) => {
  const classes = useStyles();
  const { filter, setFilter } = props;
  const [price, setPrice] = React.useState([4, 60]);

  const handleClearFilter = () =>{
    setFilter({
      ...filter,
      price : "4,60",
      sortby : "price:asc",
      age: null,
    })
  }

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
            <Button onClick={handleClearFilter} className={classes.clearButton}>Clear</Button>
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
                      <Checkbox
                        checked={filter?.gender?.split(",")[0] === "1"}
                        disabled={true}
                        icon={<CheckBoxOutlineBlankOutlinedIcon className={classes.iconDisable} />}
                        checkedIcon={<CheckBoxOutlinedIcon className={classes.iconDisable} />}
                      />
                    }
                    label="Boy"
                  />
                  <FormControlLabel
                    className={classes.formControlLabel}
                    control={
                      <Checkbox
                        checked={filter?.gender?.split(",")[1] === "1"}
                        disabled={true}
                        icon={<CheckBoxOutlineBlankOutlinedIcon className={classes.iconDisable} />}
                        checkedIcon={<CheckBoxOutlinedIcon className={classes.iconDisable} />}
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
