import doRedirect from "@ktwebsite/utils/doRedirect";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
  subheader: {
    borderBottom: "1px solid",
    borderTop: "3px solid",
    padding: "5px 0px",
    marginBottom: "16px",
  },
  textSubheader: {
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "19px",
    textAlign: "left",
    cursor: "pointer",
  },
  textSubbody: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "17px",
    textAlign: "left",
    marginBottom: "10px",
    cursor: "pointer",
  },
}));

const SubMenuBar = (props) => {
  const classes = useStyles();
  const { subMenu } = props;
  return (
    <>
      {subMenu?.map((sub, index) => {
        return (
          <Grid key={index} xs={3} item>
            <Box pr="40px">
              <Box className={classes.subheader}>
                <Typography
                  onClick={() => {
                    doRedirect(`/category/${sub?.sub_header?.handle}`);
                  }}
                  className={classes.textSubheader}
                >
                  {sub?.sub_header?.label}
                </Typography>
              </Box>
              <Box pb="30px">
                {sub?.sub_header?.sub_body?.map((sub, index) => {
                  return (
                    <Fragment key={index}>
                      <Typography
                        onClick={() => {
                          doRedirect(`/product-type/${sub?.handle}`);
                        }}
                        className={classes.textSubbody}
                      >
                        {sub?.name}
                      </Typography>
                    </Fragment>
                  );
                })}
              </Box>
            </Box>
          </Grid>
        );
      })}
    </>
  );
};

export default SubMenuBar;
