import { ListItem, UnorderedList } from "@chakra-ui/react";
import { canAdventure, Location } from "kolmafia";
import { sum } from "libram";
import { FC } from "react";

import AdviceTooltip from "../../components/AdviceTooltip";
import Line from "../../components/Line";
import MainLink from "../../components/MainLink";
import Tile from "../../components/Tile";
import { remainingDelay } from "../../questInfo/delay";
import { parentPlaceLink } from "../../util/links";
import { plural } from "../../util/text";

type Details = { zone: Location; remaining: number; available: boolean };

const ZoneList: FC<{
  zones: Details[];
}> = ({ zones }) => (
  <UnorderedList>
    {zones.map(({ zone, remaining, available }) => (
      <ListItem
        key={zone.identifierString}
        color={available ? undefined : "gray.500"}
      >
        <MainLink href={parentPlaceLink(zone)}>
          {plural(remaining, "turn")} in {zone.identifierString}.
        </MainLink>
      </ListItem>
    ))}
  </UnorderedList>
);

const Delay: FC = () => {
  let allRemaining = remainingDelay()
    .map(({ zone, remaining }) => ({
      zone,
      remaining,
      available: canAdventure(zone),
    }))
    .sort(
      ({ available: availableA }, { available: availableB }) =>
        +availableB - +availableA,
    );
  let truncated: Details[] = [];
  if (
    allRemaining.length > 7 &&
    allRemaining.some(({ available }) => !available)
  ) {
    truncated = allRemaining.slice(7);
    allRemaining = allRemaining.slice(0, 7);
  }

  const total = sum(allRemaining, ({ remaining }) => remaining);
  return (
    <Tile
      header={`${plural(total, "turn")} of delay`}
      id="delay-zones-tile"
      imageUrl="/images/itemimages/al_dayshorter.gif"
    >
      <Line>Use free runs and free wanderers to avoid spending turns.</Line>
      <ZoneList zones={allRemaining} />
      {truncated.length > 0 && (
        <Line>
          <AdviceTooltip
            text={<ZoneList zones={truncated} />}
            label="Later zones."
          />
        </Line>
      )}
    </Tile>
  );
};

export default Delay;