import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AccountButton from "../components/UserAccount/AccountButton";
import UserAccount from "../components/UserAccount/UserAccount";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/User Account",
  component: UserAccount,
} as ComponentMeta<typeof UserAccount>;

export const Primary: ComponentStory<typeof UserAccount> = (args) => (
  <UserAccount/>
);