import { Page } from "@ktwebsite/layout";
import React from "react";
import Content from "./Content";

const PageWrapper = (props: any) => {
  return (
    <Page hiddenHeader hiddenFooter {...props}>
      <Content />
    </Page>
  );
};

export default PageWrapper;
