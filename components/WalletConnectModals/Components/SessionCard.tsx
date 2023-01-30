import { Avatar, Button, Card, Text } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

import { truncate } from "../../../lib/HelperUtil";

/**
 * Types
 */
interface IProps {
  topic?: string;
  logo?: string;
  name?: string;
  url?: string;
  onDisconnect?: () => void;
}

/**
 * Component
 */
export default function SessionCard({ logo, name, url, onDisconnect }: IProps) {
  return (
    <Card
      variant="bordered"
      css={{
        position: "relative",
        marginBottom: "$6",
        minHeight: "70px",
        width: "100%",
      }}
      className="!mb-0"
    >
      <Card.Body className="flex !flex-row !justify-between !gap-2 !flex-wrap">
        <div className="flex flex-row items-center gap-3 min-w-[240px] max-w-[360px]">
          <Avatar src={logo} />
          <div className="grow">
            <Text h5>
              {name}
            </Text>
            <Link href={url!} className="grow text-primary-600">
              {truncate(url?.split("https://")[1] ?? "Unknown", 24)}
            </Link>
          </div>
        </div>
        <Button auto flat color="error" onClick={onDisconnect} className="!w-10">
          Disconnect
        </Button>
      </Card.Body>
    </Card>
  );
}
