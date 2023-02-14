import {
  DocumentHead,
  Footer,
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
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import useApi from "@ktwebsite/utils/api/useApi";
import cookie from "cookie";

import { Provider as StoreProvider } from "react-redux";

// import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
const Page = (props) => {
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
    hidePageElements,
    productDetailPage,
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
  const types = ["navigate", "reload", "back_forward", "prerender"];
  // const api = useApi();
  const updateCart = async () => {
    const api = useApi();
    const isLoadcart = sessionStorage.getItem("isLoadcart") || null;
    const session_ids = cookie.parse(document?.cookie)?.session_ids || null;
    const body = {
      isLoadcart,
      session_ids,
      productDetailPage
    };
    if (!isLoadcart) {
      sessionStorage.setItem("isLoadcart", "true");
      await api.path("public/cart/session/update").post({
        body,
      });
    } else {
      await api.path("public/cart/session/update").post({
        body,
      });
    }
  };
  useEffect(() => {
    updateCart()
  }, []);

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
              {!hidePageElements && <PageElements position="before" />}
              {children}
              {!hidePageElements && <PageElements position="after" />}
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

export default Page;
