import { Page } from "@ktwebsite/layout";
import React from "react";
import Content from "./Content";

const PageWrapper = (props: any) => {
  return (
    <Page {...props}>
      <Content {...props}/>
    </Page>
  );
};

export default PageWrapper;
