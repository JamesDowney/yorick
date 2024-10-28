import { Text } from "@chakra-ui/react";
import { decode } from "html-entities";

import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { activeBanishes } from "../../util/banish";

const ActiveBanishes: FC = () => {
  const banishes = activeBanishes();
  return (
    <Tile header="Active Banishes" imageUrl="/images/itemimages/ballbat.gif">
      {banishes.map((banish, index) => (
        <Line key={index}>
          <Text as="b">{decode(banish.banishedMonster.name)}:</Text>{" "}
          {banish.banishSource} (
          {banish.banishTurnLength === -1
            ? "Until Rollover"
            : `${banish.banishTurnLength} turns`}
          )
        </Line>
      ))}
      {banishes.length === 0 && <Line>No active banishes.</Line>}
    </Tile>
  );
};

export default ActiveBanishes;
