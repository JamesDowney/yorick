import { List, Text } from "@chakra-ui/react";
import { availableAmount, canAdventure, haveEffect } from "kolmafia";
import { $effect, $item, $location, get } from "libram";

import AdviceTooltipText from "../../../components/AdviceTooltipText";
import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { plural } from "../../../util/text";

interface ShadowBrickLocation {
  zoneName: string;
  extraItems: string;
  canAccess: boolean;
}

const ClosedCircuitPayPhone = () => {
  const closedCircuitPayPhone = $item`closed-circuit pay phone`;
  const havePayPhone = haveUnrestricted(closedCircuitPayPhone);
  const shadowLodestone = $item`Rufus's shadow lodestone`;
  const shadowBrick = $item`shadow brick`;
  const shadowAffinity = $effect`Shadow Affinity`;

  const rufusQuestState = get("questRufus");
  const questObjectiveFulfilled = rufusQuestState === "step1";
  const shadowLodestones = availableAmount(shadowLodestone);
  const riftAdvsUntilNC = get("encountersUntilSRChoice");
  const calledRufusToday = get("_shadowAffinityToday");
  const shadowAffinityTurns = haveEffect(shadowAffinity);
  const shadowBricks = availableAmount(shadowBrick);
  const shadowBrickUsesLeft = Math.min(13 - get("_shadowBricksUsed"), 13);

  const shadowBrickLocations: ShadowBrickLocation[] = [
    {
      zoneName: "Cemetary",
      extraItems: "(also has bread, stick)",
      canAccess: canAdventure($location`Shadow Rift (The Misspelled Cemetary)`),
    },
    {
      zoneName: "Hidden City",
      extraItems: "(also has sinew, nectar)",
      canAccess: canAdventure($location`Shadow Rift (The Hidden City)`),
    },
    {
      zoneName: "Pyramid",
      extraItems: "(also has sausage, sinew)",
      canAccess: canAdventure(
        $location`Shadow Rift (The Ancient Buried Pyramid)`,
      ),
    },
  ];

  const getShadowBrickLocationTooltip = () => {
    return (
      <List.Root>
        {shadowBrickLocations.map((location, index) => (
          <Text
            key={index}
            color={location.canAccess ? "fg.muted" : "fg.subtle"}
            fontWeight="bold"
          >
            {location.zoneName} {location.extraItems}
          </Text>
        ))}
      </List.Root>
    );
  };

  useNag(
    () => ({
      id: "closed-circuit-pay-phone-lodestone-nag",
      priority: NagPriority.LOW,
      imageUrl: "/images/itemimages/rufusphone.gif",
      node: havePayPhone && questObjectiveFulfilled && (
        <Tile
          header="Rufus quest done"
          imageUrl="/images/itemimages/rufusphone.gif"
          linkedContent={closedCircuitPayPhone}
        >
          <Line>Call Rufus and get a lodestone.</Line>
        </Tile>
      ),
    }),
    [havePayPhone, questObjectiveFulfilled, closedCircuitPayPhone],
  );

  useNag(
    () => ({
      id: "closed-circuit-pay-phone-shadow-rift-nc-nag",
      priority: NagPriority.LOW,
      imageUrl: "/images/itemimages/shadowbucket.gif",
      node: havePayPhone &&
        rufusQuestState === "started" &&
        riftAdvsUntilNC === 0 && (
          <Tile
            header="Shadow Rift NC up next"
            imageUrl="/images/itemimages/shadowbucket.gif"
          >
            <Line>Fight a boss or get an artifact.</Line>
          </Tile>
        ),
    }),
    [havePayPhone, rufusQuestState, riftAdvsUntilNC],
  );

  if (!havePayPhone) return null;

  return (
    <>
      <Tile linkedContent={closedCircuitPayPhone}>
        {shadowLodestones > 0 && (
          <Line>
            <Text as="span" color="purple.solid">
              Have {plural(shadowLodestones, "shadow lodestone")}.
            </Text>
          </Line>
        )}
        <Line>{riftAdvsUntilNC} encounters until NC/boss.</Line>
        {!calledRufusToday && (
          <Line color="blue.solid">Haven't called Rufus yet today.</Line>
        )}
        {calledRufusToday && (
          <Line>
            Optionally call Rufus again for another (turn-taking) quest.
          </Line>
        )}
        <AdviceTooltipText
          advice={getShadowBrickLocationTooltip()}
          children="Shadow Brick locations"
        />
      </Tile>

      {shadowAffinityTurns > 0 && (
        <Tile
          header={`${shadowAffinityTurns} Shadow Rift free fights`}
          id="shadow-rift-active-free-fights"
          imageUrl="/images/adventureimages/voidguy.gif"
        >
          <Line color="purple.solid">Shadow Rift fights are free!</Line>
          <Line>{riftAdvsUntilNC} encounters until NC/boss.</Line>
          <Line>(don't use other free kills in there)</Line>
        </Tile>
      )}

      {shadowBricks > 0 && (
        <Tile
          header={`${plural(shadowBricks, "shadow brick")}${shadowBrickUsesLeft < shadowBricks ? ` (${shadowBrickUsesLeft} usable today)` : ""}`}
          id="shadow-brick-tile"
          imageUrl="/images/itemimages/shadowbrick.gif"
        >
          <Line>Win a fight without taking a turn.</Line>
        </Tile>
      )}

      {shadowLodestones > 0 && (
        <Tile
          header={`${shadowLodestones} Rufus's shadow lodestones`}
          id="shadow-lodestone-tile"
          imageUrl="/images/itemimages/shadowlodestone.gif"
        >
          <Line>
            30 advs of +100% init, +100% item, +200% meat, -10% combat.
          </Line>
          <Line>Triggers on next visit to any Shadow Rift.</Line>
        </Tile>
      )}

      {!calledRufusToday && (
        <Tile
          header="Shadow Affinity free fights"
          imageUrl="/images/itemimages/rufusphone.gif"
          linkedContent={closedCircuitPayPhone}
        >
          <Line>Call Rufus to get 11+ free Shadow Rift combats.</Line>
        </Tile>
      )}
    </>
  );
};

export default ClosedCircuitPayPhone;
