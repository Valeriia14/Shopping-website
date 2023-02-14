import { Page } from "@ktwebsite/layout";
import React from "react";
import Landing from "./Landing";

const PageWrapper = (props: any) => {
  return (
    <Page hidePageElements {...props}>
      <Landing />
    </Page>
  );
};

export default PageWrapper;
