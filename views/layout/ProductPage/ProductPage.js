import {
  DocumentHead,
  Header,
  PageElements,
} from "@ktwebsite/components";
import { PageContextHolder } from "@ktwebsite/hooks";
import store from "@ktwebsite/store";
import "@ktwebsite/styles/global.scss";
import theme from "@ktwebsite/theme";
import { Box, CssBaseline, Hidden, ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React, { createContext, useEffect, useState } from "react";
import { Provider as StoreProvider } from "react-redux";
import Footer from "./components"
// import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
const ProductPage = (props) => {
  // this `props` contains data passed from the server
  // and also we can inject additional data into pages
  const {
    hiddenHeader,
    hiddenFooter,
    children,
    preloaded_data,
    page_override,
    page_elements,
    self,
    className,
    page_meta,
    ...rest
  } = props;

  const initialContextData = {
    data: preloaded_data,
    elems: page_elements,
    _page: page_override,
    _meta: page_meta,
    _self: self,
  };

  const [contextData, setContextData] = useState(initialContextData);
  contextData.updater = setContextData;

  const isServerSide = typeof window === "undefined";
  initialContextData.data.isServerSide = isServerSide;
  if (!isServerSide) {
    window.KTContextData = contextData;
  }

  let PageContext;
  if (!PageContextHolder.context) {
    PageContext = createContext(contextData);
    PageContextHolder.context = PageContext;
  } else {
    PageContext = PageContextHolder.context;
  }

  return (
    <PageContext.Provider value={contextData}>
      <SnackbarProvider
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        maxSnack={5}
      >
        <DocumentHead />
        <StoreProvider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Hidden xsDown={hiddenHeader}>
              <Header />
            </Hidden>
            <Box {...rest} className={className}>
             
              {children}
              
            </Box>
            <Hidden xsDown={hiddenFooter}>
              <Footer />
            </Hidden>
          </ThemeProvider>
        </StoreProvider>
      </SnackbarProvider>
    </PageContext.Provider>
  );
};

export default ProductPage;
