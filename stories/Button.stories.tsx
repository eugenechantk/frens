import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "../components/Button/Button";
import { ArrowDownIcon, UserIcon } from "@heroicons/react/20/solid";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Primary: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>
    <h6>User</h6>
    <ArrowDownIcon className="w-5" />
  </Button>
);