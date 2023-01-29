import { Avatar, Button, Card, Link, Text } from "@nextui-org/react";
import Image from "next/image";
import NextLink from "next/link";
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
    >
      <Card.Body
        css={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <Avatar src={logo} />
        <div style={{ flex: 1 }}>
          <Text h5 css={{ marginLeft: "$9" }}>
            {name}
          </Text>
          <Link href={url} css={{ marginLeft: "$9" }}>
            {truncate(url?.split("https://")[1] ?? "Unknown", 24)}
          </Link>
        </div>
        <Button auto flat color="error" onClick={onDisconnect}>
          Disconnect
        </Button>
      </Card.Body>
    </Card>
  );
}
