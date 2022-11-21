import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AccountButton from "../components/UserAccount/AccountButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Account Button",
  component: AccountButton,
} as ComponentMeta<typeof AccountButton>;

export const Primary: ComponentStory<typeof AccountButton> = (args) => (
  <AccountButton {...args}/>
);