// import ProductPage from "@ktwebsite/layout/ProductPage";
import React from "react";
import Page from "@ktwebsite/layout/Page";
import Content from "./Content";

const PageWrapper = (props: any) => {
  return (
    <Page productDetailPage={true} {...props}>
      <Content />
    </Page>
  );
};

export default PageWrapper;
