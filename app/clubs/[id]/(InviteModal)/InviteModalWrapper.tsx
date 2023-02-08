"use client";

import { Square2StackIcon } from "@heroicons/react/24/outline";
import { Modal as NextModal } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSnapshot } from "valtio";
import { Button } from "../../../../components/Button/Button";
import InviteModalStore from "./InviteModalStore";

export default function InviteModalWrapper() {
  const { open } = useSnapshot(InviteModalStore.state);
  const [copyLinkTooltip, setCopyLinkTooltip] = useState(false);
  const pathname = usePathname();
  const copyLink = () => {
    setCopyLinkTooltip(true);
    navigator.clipboard.writeText(`${window.location.origin}${pathname}`);
    setTimeout(() => setCopyLinkTooltip(false), 1000);
  };

  return (
    <NextModal blur open={open} onClose={() => InviteModalStore.close()}>
      <NextModal.Header
        css={{
          marginTop: "8px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
        <h3>Invite new members</h3>
      </NextModal.Header>
      <NextModal.Body css={{ marginBottom: "8px" }}>
        <div className="flex flex-col gap-4">
          <p className="text-gray-800">
            Share this link with others so they can deposit ETH and join your
            club
          </p>
          <div className="flex flex-row gap-1 px-5 py-4 rounded-[6px] border border-secondary-300 items-center">
            <p className="grow overflow-ellipsis overflow-hidden">
              {`${window.location.origin}${pathname}`}
            </p>
            <div className="relative">
              <Button variant="text-only" onClick={copyLink}>
                <Square2StackIcon className="w-5" />
              </Button>
              {copyLinkTooltip && (
                <p className="absolute -top-8 -left-20 z-10 w-[138px] bg-gray-800 bg-opacity-80 px-3 py-1 rounded-[4px] text-white text-sm">
                  Copied invite link
                </p>
              )}
            </div>
          </div>
        </div>
      </NextModal.Body>
    </NextModal>
  );
}
