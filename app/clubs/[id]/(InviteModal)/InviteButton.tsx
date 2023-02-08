"use client";

import React from "react";
import { Button } from "../../../../components/Button/Button";
import InviteModalStore from "./InviteModalStore";

export default function InviteButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => InviteModalStore.open()}>
      <h4>Invite</h4>
    </Button>
  );
}
