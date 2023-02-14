import { Page } from "@ktwebsite/layout";
import React from "react";
import Content from "./content";

const PageWrapper = (props: any) => {
  return (
    <Page {...props}>
      <Content />
    </Page>
  );
};

export default PageWrapper;
