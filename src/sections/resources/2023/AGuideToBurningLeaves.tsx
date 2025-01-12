import { List, Text } from "@chakra-ui/react";
import { availableAmount, getCampground, myLevel } from "kolmafia";
import { $effect, $familiar, $item, $skill, get, have } from "libram";
import { FC } from "react";

import AdviceTooltipText from "../../../components/AdviceTooltipText";
import Line from "../../../components/Line";
import LinkBlock from "../../../components/LinkBlock";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { inventoryLink } from "../../../util/links";
import { isNormalCampgroundPath } from "../../../util/paths";
import { plural } from "../../../util/text";

interface LeafyFight {
  leafCost: number;
  summonedMonster: string;
  scaling: string;
  leavesDropped: number;
  extraDrops: string;
}

interface LeafySummon {
  leafCost: number;
  summonedItem: string;
  description: string;
  meltingStatus: boolean;
  prefName: string;
}

const LEAFY_SUMMONS: LeafySummon[] = [
  {
    leafCost: 37,
    summonedItem: "Autumnic Bomb",
    description: "potion; prismatic stinging (25 turns)",
    meltingStatus: false,
    prefName: "",
  },
  {
    leafCost: 42,
    summonedItem: "Impromptu Torch",
    description: "weapon; +2 mus/fight",
    meltingStatus: true,
    prefName: "",
  },
  {
    leafCost: 43,
    summonedItem: "Flaming Fig Leaf",
    description: "pants; +2 mox/fight",
    meltingStatus: true,
    prefName: "",
  },
  {
    leafCost: 44,
    summonedItem: "Smoldering Drape",
    description: "cape; +2 mys/fight, +20% stat",
    meltingStatus: true,
    prefName: "",
  },
  {
    leafCost: 50,
    summonedItem: "Distilled Resin",
    description: "potion; generate +1 leaf/fight (100 turns)",
    meltingStatus: false,
    prefName: "",
  },
  {
    leafCost: 66,
    summonedItem: "Autumnal Aegis",
    description: "shield; +250 DA, +2 all res",
    meltingStatus: false,
    prefName: "",
  },
  {
    leafCost: 69,
    summonedItem: "Lit Leaf Lasso",
    description:
      "combat item; lasso leaf freebies for extra end-of-combat triggers",
    meltingStatus: false,
    prefName: "_leafLassosCrafted",
  },
  {
    leafCost: 74,
    summonedItem: "Forest Canopy Bed",
    description: "bed; +5 free rests, stats via rests",
    meltingStatus: false,
    prefName: "",
  },
  {
    leafCost: 99,
    summonedItem: "Autumnic Balm",
    description: "potion; +2 all res (100 turns)",
    meltingStatus: false,
    prefName: "",
  },
  {
    leafCost: 222,
    summonedItem: "Day Shortener",
    description: "spend 5 turns for a +turn item",
    meltingStatus: false,
    prefName: "_leafDayShortenerCrafted",
  },
  {
    leafCost: 1111,
    summonedItem: "Coping Juice",
    description: "copium for the masses",
    meltingStatus: false,
    prefName: "",
  },
  {
    leafCost: 6666,
    summonedItem: "Smoldering Leafcutter Ant Egg",
    description: "mosquito & leaves familiar",
    meltingStatus: false,
    prefName: "_leafAntEggCrafted",
  },
  {
    leafCost: 11111,
    summonedItem: "Super-Heated Leaf",
    description: "burn leaves into your skiiiin",
    meltingStatus: false,
    prefName: "_leafTattooCrafted",
  },
];

const LEAFY_FIGHTS: LeafyFight[] = [
  {
    leafCost: 11,
    summonedMonster: "Flaming Leaflet",
    scaling: "11/11/11",
    leavesDropped: 4,
    extraDrops: "",
  },
  {
    leafCost: 111,
    summonedMonster: "Flaming Monstera",
    scaling: "scaling",
    leavesDropped: 7,
    extraDrops: "leafy browns",
  },
  {
    leafCost: 666,
    summonedMonster: "Leaviathan",
    scaling: "scaling boss (hard!)",
    leavesDropped: 125,
    extraDrops: "flaming leaf crown",
  },
];

const AGuideToBurningLeaves: FC = () => {
  const guideToLeaves = $item`A Guide to Burning Leaves`;
  const haveLeaves = haveUnrestricted(guideToLeaves);
  const haveCampground = isNormalCampgroundPath();
  const inflammableLeaf = $item`inflammable leaf`;
  const leafCount = availableAmount(inflammableLeaf);

  const canUseShorty = haveUnrestricted($familiar`Shorter-Order Cook`);
  const canUseCrab = haveUnrestricted($familiar`Imitation Crab`);
  const hasTaoOfTheTerrapin = have($skill`Tao of the Terrapin`);
  const hasForestCanopyBed = !!getCampground()["forest canopy bed"];
  const inRun = get("kingLiberated") === false;

  const fightsRemaining = Math.max(0, 5 - get("_leafMonstersFought"));
  const leafletsUserCanSummon = Math.floor(leafCount / 11);

  const haveResin = have($item`distilled resin`);
  const haveResined = have($effect`Resined`);

  useNag(
    () => ({
      id: "burning-leaves-nag",
      priority: NagPriority.MID,
      imageUrl: "/images/itemimages/al_resin.gif",
      node: haveLeaves &&
        haveCampground &&
        !haveResined &&
        (haveResin || leafCount >= 50) && (
          <Tile
            header="Get Resined"
            imageUrl="/images/itemimages/al_resin.gif"
            href={
              haveResin
                ? inventoryLink($item`distilled resin`)
                : "/campground.php?preaction=leaves"
            }
            linkEntireTile
          >
            <Line>
              Use distilled resin{!haveResin && " (50 leaves)"} to collect more
              leaves.
            </Line>
          </Tile>
        ),
    }),
    [haveCampground, haveLeaves, haveResin, haveResined, leafCount],
  );

  if (!haveLeaves || !haveCampground) return null;

  return (
    <Tile
      header="Burning Leaves"
      imageUrl="/images/itemimages/al_book.gif"
      href="/campground.php?preaction=leaves"
    >
      <LinkBlock href="/campground.php?preaction=leaves">
        <Line fontWeight="bold">Item Summons:</Line>
        <List.Root>
          {LEAFY_SUMMONS.map((summon) => {
            if (
              ((canUseShorty || canUseCrab) && summon.leafCost === 37) ||
              (myLevel() > 11 && [42, 43].includes(summon.leafCost)) ||
              (hasTaoOfTheTerrapin && summon.leafCost === 66) ||
              (have($item`${summon.summonedItem}`) &&
                [42, 43, 44, 66, 74].includes(summon.leafCost)) ||
              (hasForestCanopyBed && summon.leafCost === 74) ||
              (inRun &&
                [99, 222, 1111, 6666, 11111].includes(summon.leafCost)) ||
              (!inRun && [42, 43, 44, 66].includes(summon.leafCost))
            ) {
              return null;
            }

            const hasEnoughLeaves = leafCount >= summon.leafCost;
            return (
              <List.Item
                key={summon.summonedItem}
                color={hasEnoughLeaves ? "black" : "gray.solid"}
              >
                {summon.leafCost} leaves: {summon.summonedItem} -{" "}
                {summon.description}
                {summon.meltingStatus && (
                  <Text as="span" fontSize="xs" color="gray.solid">
                    {" "}
                    (melting)
                  </Text>
                )}
              </List.Item>
            );
          })}
        </List.Root>
      </LinkBlock>

      {fightsRemaining > 0 && (
        <>
          <LinkBlock href="/campground.php?preaction=leaves">
            <Line fontWeight="bold">Fight Summons:</Line>
            <List.Root>
              {LEAFY_FIGHTS.map((fight) => {
                if (
                  inRun &&
                  have($item`flaming leaf crown`) &&
                  fight.summonedMonster === "Leaviathan"
                ) {
                  return null;
                }

                const hasEnoughLeaves = leafCount >= fight.leafCost;
                return (
                  <List.Item
                    key={fight.summonedMonster}
                    color={hasEnoughLeaves ? "black" : "gray.solid"}
                  >
                    {fight.leafCost} leaves: {fight.summonedMonster} -{" "}
                    {fight.scaling}; ~{fight.leavesDropped} leaves dropped
                    {fight.extraDrops && (
                      <Text as="span" fontSize="xs" color="gray.solid">
                        {" "}
                        (also, drops {fight.extraDrops})
                      </Text>
                    )}
                  </List.Item>
                );
              })}
            </List.Root>
          </LinkBlock>
          {leafCount >= 111 * fightsRemaining ? (
            <AdviceTooltipText
              advice={`You can summon ${fightsRemaining} monstera for scaling fights.`}
            >
              <Line>{`You have enough leaves for ${fightsRemaining} monstera.`}</Line>
            </AdviceTooltipText>
          ) : leafCount >= 11 * fightsRemaining ? (
            <AdviceTooltipText
              advice={`You can summon ${fightsRemaining} leaflets for familiar turns.`}
            >
              <Line>{`You have enough leaves for ${fightsRemaining} leaflets.`}</Line>
            </AdviceTooltipText>
          ) : leafCount >= 11 ? (
            <AdviceTooltipText advice="Save leaves for more fights!">
              <Line>{`You can currently summon ${plural(leafletsUserCanSummon, "leaflet")}.`}</Line>
            </AdviceTooltipText>
          ) : (
            <AdviceTooltipText advice="Save leaves for fights!">
              <Line>You cannot currently summon a free fight.</Line>
            </AdviceTooltipText>
          )}
        </>
      )}
    </Tile>
  );
};

export default AGuideToBurningLeaves;
