import { Box, Hidden } from "@material-ui/core";
import React from "react";
import { useStyles } from "./styles";
import { usePageData } from "@ktwebsite/hooks";

const Header = () => {
  const classes = useStyles();
  const pageData = usePageData();
  const { header_mobile, header_desktop } = pageData;

  return (
    <Box className={classes.root}>
      <Hidden smDown>
        <img
          className={classes.img}
          src={
            header_desktop?.length
              ? header_desktop[0]?.uri
              : "/images/Top_banner.svg"
          }
        />
      </Hidden>
      <Hidden mdUp>
        <img
          className={classes.img}
          src={
            header_mobile?.length
              ? header_mobile[0]?.uri
              : "/images/Top_banner_mobile.svg"
          }
        />
      </Hidden>
    </Box>
  );
};

export default Header;
