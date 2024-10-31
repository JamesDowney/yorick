import { Box, Container, Divider, Stack } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { RefreshContext } from "tome-kolmafia-react";

import BrandHeading from "./components/BrandHeading";
import ChatButton from "./components/ChatButton";
import LocationBar from "./components/LocationBar";
import PrefsButton from "./components/PrefsButton";
import RefreshButton from "./components/RefreshButton";
import NagContext from "./contexts/NagContext";
import NagSection from "./sections/NagSection";
import QuestSection from "./sections/QuestSection";
import ResourceSection from "./sections/ResourceSection";
import { inDevMode } from "./util/env";
import { setup3Frames, setup4Frames, visibleFrameCount } from "./util/frames";

const Layout = () => {
  const { triggerHardRefresh } = useContext(RefreshContext);
  const { nags } = useContext(NagContext);

  const [chatFrameOpen, setChatFrameOpen] = useState(visibleFrameCount() >= 4);
  const toggleChatFrame = useCallback(() => {
    if (visibleFrameCount() >= 4) {
      setup3Frames();
      setChatFrameOpen(false);
    } else {
      setup4Frames();
      setChatFrameOpen(true);
    }
  }, []);

  useEffect(() => {
    if (inDevMode()) {
      // Refresh trigger for dev override interface.
      window.addEventListener("message", (event: MessageEvent) => {
        if (
          event.origin === "http://localhost:3000" &&
          event.data === "refresh"
        ) {
          triggerHardRefresh();
        }
      });
    }
  }, [triggerHardRefresh]);

  return (
    <Container paddingX={0} fontSize="sm">
      <Stack
        direction="row"
        spacing={1}
        position="absolute"
        top={1}
        right={1}
        zIndex={200}
      >
        {inDevMode() && <PrefsButton />}
        <RefreshButton onClick={triggerHardRefresh} />
      </Stack>
      <ChatButton
        direction={chatFrameOpen ? "right" : "left"}
        onClick={toggleChatFrame}
        position="absolute"
        bottom="calc(var(--chakra-space-1) + 2rem)"
        right={1}
        zIndex={200}
      />
      <Box overflow="scroll" h="calc(100vh - 2rem)">
        <BrandHeading />
        <Stack>
          {Object.keys(nags).length > 0 && <NagSection />}
          <QuestSection />
          <Divider />
          <ResourceSection />
        </Stack>
      </Box>
      <LocationBar />
    </Container>
  );
};

export default Layout;
