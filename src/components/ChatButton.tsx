import { Button, ButtonProps, Text } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FC } from "react";

export interface ChatButtonProps extends ButtonProps {
  direction: "left" | "right";
}

const ChatButton: FC<ChatButtonProps> = ({ direction, ...props }) => (
  <Button
    asChild
    aria-label="Refresh"
    _hover={{ bgColor: "bg.emphasized" }}
    bgColor="bg"
    p={1}
    size="xs"
    variant="outline"
    height="fit-content"
    {...props}
  >
    <Text writingMode="vertical-rl" scale={-1}>
      Chat {direction === "left" ? <ChevronRight /> : <ChevronLeft />}
    </Text>
  </Button>
);

export default ChatButton;
