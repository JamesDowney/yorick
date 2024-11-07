import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  availableAmount,
  canAdventure,
  getCampground,
  isUnrestricted,
  myPath,
} from "kolmafia";
import { $item, $location, $path, $skill, get } from "libram";
import { FC } from "react";

import AdviceTooltipIcon from "../../components/AdviceTooltipIcon";
import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { haveUnrestricted } from "../../util/available";
import { skillLink } from "../../util/links";
import { questStarted } from "../../util/quest";
import { renderSourceList, Source } from "../../util/source";
import { plural } from "../../util/text";

const FREE_FIGHTS: Source[] = [
  {
    name: "Snojo",
    remaining: () =>
      +canAdventure($location`The X-32-F Combat Training Snowman`) &&
      10 - get("_snojoFreeFights"),
    render: ({ remaining }) => (
      <Line href="/place.php?whichplace=snojo">
        {plural(remaining, "free Snojo fight")}.
      </Line>
    ),
  },
  {
    name: "NEP",
    remaining: () =>
      +(
        (isUnrestricted($item`Neverending Party invitation envelope`) &&
          get("_neverendingPartyToday")) ||
        get("neverendingPartyAlways")
      ) && 10 - get("_neverendingPartyFreeTurns"),
    render: ({ remaining }) => (
      <Line href="/place.php?whichplace=town_wrong">
        {plural(remaining, "free NEP fight")}.
      </Line>
    ),
  },
  {
    name: "Witchess",
    remaining: () =>
      +(
        getCampground()["Witchess Set"] && isUnrestricted($item`Witchess Set`)
      ) && 5 - get("_witchessFights"),
    render: ({ remaining }) => (
      <Line href="/campground.php?action=witchess">
        {plural(remaining, "Witchess fight")}.
      </Line>
    ),
  },
  {
    name: "CMG",
    remaining: () =>
      +haveUnrestricted($item`cursed magnifying glass`) &&
      5 - get("_voidFreeFights"),
    render: ({ remaining }) => (
      <Line equipItem={$item`cursed magnifying glass`}>
        {plural(remaining, "free void fight")} (
        {get("cursedMagnifyingGlassCount")}/13 charge).
      </Line>
    ),
  },
  {
    name: "Burning Leaves",
    remaining: () =>
      +!!getCampground()["A Guide to Burning Leaves"] &&
      5 - get("_leafMonstersFought"),
    render: ({ remaining }) => {
      const leaves = availableAmount($item`inflammable leaf`);
      const leavesNeeded = 5 * remaining;
      return (
        <Line href="/campground.php?preaction=leaves">
          {remaining} burning leaf fights
          {leaves < leavesNeeded ? ` (${leaves}/${leavesNeeded} leaves)` : ""}.
        </Line>
      );
    },
  },
  {
    name: "LOV Tunnel",
    remaining: () =>
      +(
        get("loveTunnelAvailable") &&
        !get("_loveTunnelUsed") &&
        isUnrestricted($item`LOV Entrance Pass`)
      ) && 3,
    render: () => (
      <Line href="/place.php?whichplace=town_wrong">
        3 free LOV Tunnel fights.
      </Line>
    ),
  },
  {
    name: "Forest Tentacle",
    remaining: () =>
      +(questStarted("questL02Larva") && questStarted("questG02Whitecastle")) &&
      1 - +get("_eldritchTentacleFought"),
    render: () => (
      <Line href="/place.php?whichplace=forestvillage&action=fv_scientist">
        1 free eldritch tentacle in the forest.
      </Line>
    ),
  },
  {
    name: "Evoke Horror",
    remaining: () =>
      +haveUnrestricted($skill`Evoke Eldritch Horror`) &&
      1 - +get("_eldritchHorrorEvoked"),
    render: () => (
      <Line href={skillLink($skill`Evoke Eldritch Horror`)}>
        1 free eldritch horror via Evoke Eldritch Horror.
      </Line>
    ),
  },
];

const FreeFights: FC = () => {
  if (myPath() === $path`Avant Guard`) return null;

  const { total, rendered } = renderSourceList(FREE_FIGHTS);
  if (total === 0) return null;

  return (
    <Tile
      header={`${plural(total, "free fight")}`}
      id="free-fights-tile"
      imageUrl="/images/adventureimages/eldtentacle.gif"
      tooltip={
        <AdviceTooltipIcon
          text={`These are inherently free fights. They do not cost a turn, nor do they
            decrement your effects. Many of them are scaling fights; by stacking
            large +mainstat% modifiers, they will give increasing amounts of stats
            and allow you to level very quickly!`}
          icon={QuestionOutlineIcon}
        />
      }
    >
      {rendered}
    </Tile>
  );
};

export default FreeFights;