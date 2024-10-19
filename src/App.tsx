import {
  Box,
  ChakraProvider,
  Container,
  extendTheme,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { useCallback, useContext, useState } from "react";
import { RefreshContext, RefreshContextProvider } from "tome-kolmafia-client";

import BrandHeading from "./components/BrandHeading";
import ChatButton from "./components/ChatButton";
import LocationBar from "./components/LocationBar";
import RefreshButton from "./components/RefreshButton";
import NagContext from "./contexts/NagContext";
import NagContextProvider from "./contexts/NagContextProvider";
import NagSection from "./sections/NagSection";
import QuestSection from "./sections/QuestSection";
import ResourceSection from "./sections/ResourceSection";
import { setup3Frames, setup4Frames, visibleFrameCount } from "./util/frames";

const bulleted = {
  container: {
    paddingTop: "0.125rem",
    paddingLeft: "1.25rem",
  },
  item: {
    textIndent: "-0.375rem",
    _before: {
      content: '"●"',
      verticalAlign: "middle",
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: "0.75rem",
      lineHeight: 0,
      display: "inline-block",
      width: "0.375rem",
      // This is a hackish tweak...
      marginTop: "-3px",
    },
  },
};

const theme = extendTheme({
  lineHeights: {
    none: 1,
    shorter: 1.05,
    short: 1.1,
    base: 1.15,
    tall: 1.25,
    taller: 1.5,
  },
  components: {
    List: {
      variants: { bulleted },
    },
  },
});

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

  return (
    <Container paddingX={0} fontSize="sm">
      <RefreshButton
        onClick={triggerHardRefresh}
        position="absolute"
        top={1}
        right={1}
        zIndex={200}
      />
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
        <Stack divider={<StackDivider />}>
          {Object.keys(nags).length > 0 && <NagSection />}
          <QuestSection />
          <ResourceSection />
        </Stack>
      </Box>
      <LocationBar />
    </Container>
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <RefreshContextProvider>
        <NagContextProvider>
          <Layout />
        </NagContextProvider>
      </RefreshContextProvider>
    </ChakraProvider>
  );
}

export default App;
