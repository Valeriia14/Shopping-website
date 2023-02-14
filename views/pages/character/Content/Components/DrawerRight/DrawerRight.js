import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  ListSubheader,
  Radio,
  RadioGroup,
  Slider,
  Typography,
} from "@material-ui/core";
import React from "react";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import CloseIcon from "@material-ui/icons/Close";
import { useStyles } from "./styles";

const DrawerRight = (props) => {
  const classes = useStyles();
  const { filter, setFilter } = props;
  const [price, setPrice] = React.useState([4, 60]);

  const handleClearFilter = () => {
    setFilter({
      ...filter,
      gender: "1,1",
      price: "4,60",
      sortby: "price:asc",
      age: null,
    });
  };

  const handleChange = (event) => {
    setFilter({ ...filter, sortby: event.target.value });
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
    <Drawer
      className={classes.drawer}
      anchor="right"
      open={props.openFilter}
      onClose={() => {
        props.setOpenFilter(false);
      }}
    >
      <Box className={classes.root}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            className={classes.closeButton}
            onClick={() => {
              props.setOpenFilter(false);
            }}
          >
            <CloseIcon />
          </Button>
        </Box>
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
        >
          <ListItem className={classes.childText}>
            <Box width="100%">
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="sort by"
                  name="sort by"
                  value={filter?.sortby}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    className={classes.formControlLabel}
                    value="price:asc"
                    control={<Radio />}
                    label="Price: Low to High"
                  />
                  <FormControlLabel
                    className={classes.formControlLabel}
                    value="price:desc"
                    control={<Radio />}
                    label="Price: High to Low"
                  />
                  <FormControlLabel
                    className={classes.formControlLabel}
                    value="created_at:asc"
                    control={<Radio />}
                    label="Recent"
                  />
                  <FormControlLabel
                    className={classes.formControlLabel}
                    value=""
                    control={<Radio />}
                    label="Best Selling"
                  />
                </RadioGroup>
              </FormControl>
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
              {`FILTER (${Object.keys(filter)?.length - 1})`}
            </ListSubheader>
          }
        >
          <ListItem className={classes.childFilterText}>
            <Box>
              <Typography className={classes.titleFilter}>GENDER</Typography>
              <Box m="12px 0px">
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
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
              <Box margin="16px 0px 0px 0px!important">
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
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
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
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button onClick={handleClearFilter} className={classes.clearButton}>
            Clear All
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DrawerRight;
