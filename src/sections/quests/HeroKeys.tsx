import { Link, ListItem, UnorderedList } from "@chakra-ui/react";
import {
  availableAmount,
  canEquip,
  haveEquipped,
  isUnrestricted,
  Item,
  myLocation,
  myPath,
} from "kolmafia";
import {
  $familiar,
  $item,
  $items,
  $location,
  $path,
  $skill,
  AugustScepter,
  get,
  have,
  sum,
} from "libram";
import { FC, Fragment, ReactNode, useMemo } from "react";

import Line from "../../components/Line";
import QuestTile from "../../components/QuestTile";
import Tile from "../../components/Tile";
import { NagPriority } from "../../contexts/NagContext";
import useNag from "../../hooks/useNag";
import { haveUnrestricted } from "../../util/available";
import { inventoryLink, skillLink } from "../../util/links";
import { commaOr, plural, pluralJustDesc } from "../../util/text";

interface Source {
  name: ReactNode;
  count: number;
  condition: () => boolean;
}

const looseTeethSources: Source[] = [
  {
    name: "casting Aug. 22",
    count: 4,
    condition: () => AugustScepter.canCast(22),
  },
  {
    name: "toothy sklelton in the Nook",
    // Approximation of how many teeth you can get from the nook
    count: 1 + Math.ceil((get("cyrptNookEvilness") - 13) / 8),
    condition: () => get("cyrptNookEvilness") > 13,
  },
  {
    name: "Alcove boss",
    count: 1,
    condition: () => get("cyrptAlcoveEvilness") > 0,
  },
] as const;

const skeletonBoneSources: Source[] = [
  {
    name: "spiny skleleton in the Nook",
    // Approximation of how many bones you can get from the nook
    count: 1 + Math.ceil((get("cyrptNookEvilness") - 13) / 5),
    condition: () => get("cyrptNookEvilness") > 13,
  },
  {
    name: "Nook boss",
    count: 3,
    condition: () => get("cyrptNookEvilness") > 0,
  },
  {
    name: (
      <Link target="_blank" href="https://bofa.loathers.net">
        BOFA (approximate)
      </Link>
    ),
    count: 1,
    condition: () => have($skill`Just the Facts`),
  },
] as const;

const HeroKeys: FC = () => {
  const fatLootTokens = availableAmount($item`fat loot token`);
  const towerKeysUsed = get("nsTowerDoorKeysUsed")
    .split(",")
    .filter((s) => s)
    .map((name) => Item.get(name));
  const heroKeys = $items`Sneaky Pete's key, Jarlsberg's key, Boris's key`;
  const heroKeysUsed = heroKeys.filter((key) => towerKeysUsed.includes(key));
  const heroKeysAvailable = heroKeys.filter((key) => have(key));
  const heroKeysMissing = heroKeys.filter(
    (key) => !heroKeysUsed.includes(key) && !heroKeysAvailable.includes(key),
  );

  const neededTokensKeys = heroKeysMissing.length - fatLootTokens;

  const needKeys =
    myPath() !== $path`Community Service` &&
    myPath() !== $path`Actually Ed the Undying` &&
    neededTokensKeys > 0;

  const ringOfDetectBoringDoors = $item`ring of Detect Boring Doors`;
  const haveRingOfDetectBoringDoors = have(ringOfDetectBoringDoors);
  const haveRingEquipped = haveEquipped(ringOfDetectBoringDoors);
  const elevenFootPole = $item`eleven-foot pole`;
  const haveElevenFootPole = have(elevenFootPole);
  const pickOMaticLockpicks = $item`Pick-O-Matic lockpicks`;
  const havePickOMaticLockpicks = have(pickOMaticLockpicks);
  const gelatinousCubeling = $familiar`Gelatinous Cubeling`;
  const canTakeCubeling =
    have(gelatinousCubeling) && canEquip(gelatinousCubeling);

  const lastAdventure = myLocation();
  const dailyDungeonDone = get("dailyDungeonDone");
  const lastDailyDungeonRoom = get("_lastDailyDungeonRoom");

  const dailyDungeonRemaining = !haveRingOfDetectBoringDoors
    ? 15 - lastDailyDungeonRoom
    : lastDailyDungeonRoom > 10
      ? 15 - lastDailyDungeonRoom
      : lastDailyDungeonRoom > 5
        ? 13 - lastDailyDungeonRoom
        : 11 - lastDailyDungeonRoom;

  const looseTeethCount = availableAmount($item`loose teeth`);
  const skeletonBoneCount = availableAmount($item`skeleton bone`);
  const skeletonKeyCount = availableAmount($item`skeleton key`);
  const skeletonKeyCreatable = Math.min(looseTeethCount, skeletonBoneCount);
  const skeletonKeyAvailable = skeletonKeyCount + skeletonKeyCreatable;

  const potentialLooseTeeth =
    looseTeethCount +
    sum(looseTeethSources, (source) => (source.condition() ? source.count : 0));
  const potentialSkeletonBones =
    skeletonBoneCount +
    sum(skeletonBoneSources, (source) =>
      source.condition() ? source.count : 0,
    );
  const potentialSkeletonKeys =
    skeletonKeyCount + Math.min(potentialLooseTeeth, potentialSkeletonBones);

  const needMoreSkeletonKeysForDailyDungeon =
    !dailyDungeonDone &&
    !have($item`Platinum Yendorian Express Card`) &&
    !have(pickOMaticLockpicks) &&
    skeletonKeyAvailable <= 1;
  const needSkeletonKeyForTower = skeletonKeyAvailable === 0;
  const avoidUsingSkeletonKey =
    needMoreSkeletonKeysForDailyDungeon &&
    potentialSkeletonKeys <= 2 &&
    canTakeCubeling;

  const skeletonKeyOptions = useMemo(
    () => (
      <>
        <Line>
          You need{" "}
          {needMoreSkeletonKeysForDailyDungeon
            ? "more skeleton keys"
            : "a skeleton key for the tower"}
          . You have {skeletonKeyAvailable} keys ({looseTeethCount} teeth,{" "}
          {skeletonBoneCount} bones).
        </Line>
        <UnorderedList>
          {looseTeethSources.map((source, index) => (
            <ListItem key={index}>
              {source.count} teeth from {source.name}.
            </ListItem>
          ))}
          {skeletonBoneSources.map((source, index) => (
            <ListItem key={index}>
              {source.count} bones from {source.name}.
            </ListItem>
          ))}
        </UnorderedList>
      </>
    ),
    [
      needMoreSkeletonKeysForDailyDungeon,
      skeletonKeyAvailable,
      looseTeethCount,
      skeletonBoneCount,
    ],
  );

  useNag(() => {
    const nodes: Record<string, ReactNode> = {};
    if (
      needKeys &&
      lastAdventure === $location`The Daily Dungeon` &&
      lastDailyDungeonRoom < 14 &&
      neededTokensKeys > 0
    ) {
      if (
        haveRingOfDetectBoringDoors &&
        !haveRingEquipped &&
        !dailyDungeonDone &&
        lastDailyDungeonRoom < 10
      ) {
        nodes.ring = (
          <Tile
            header="Wear ring of detect boring doors"
            linkedContent={ringOfDetectBoringDoors}
          >
            <Line>Speeds up daily dungeon.</Line>
          </Tile>
        );
      }

      if (avoidUsingSkeletonKey) {
        nodes.skeletonKey = (
          <Tile
            header="Avoid using your skeleton key in the daily dungeon"
            imageUrl="/images/itemimages/skeletonkey.gif"
          >
            <Line>Running low, will need one for the tower.</Line>
            {skeletonKeyOptions}
          </Tile>
        );
      }

      if (
        (canTakeCubeling &&
          !havePickOMaticLockpicks &&
          (skeletonKeyAvailable === 0 || avoidUsingSkeletonKey)) ||
        !haveElevenFootPole ||
        !haveRingOfDetectBoringDoors
      ) {
        nodes.cubeling = (
          <Tile
            header="Use gelatinous cubeling first"
            linkedContent={gelatinousCubeling}
          >
            <Line>
              You're adventuring in the daily dungeon without cubeling drops.
            </Line>
          </Tile>
        );
      }
    }

    return {
      id: "daily-dungeon-location-nag",
      priority: NagPriority.HIGH,
      node:
        Object.keys(nodes).length > 0 ? (
          <>
            {Object.entries(nodes).map(([key, node]) => (
              <Fragment key={key}>{node}</Fragment>
            ))}
          </>
        ) : null,
    };
  }, [
    needKeys,
    lastAdventure,
    lastDailyDungeonRoom,
    neededTokensKeys,
    haveRingOfDetectBoringDoors,
    haveRingEquipped,
    dailyDungeonDone,
    avoidUsingSkeletonKey,
    canTakeCubeling,
    havePickOMaticLockpicks,
    skeletonKeyAvailable,
    haveElevenFootPole,
    ringOfDetectBoringDoors,
    skeletonKeyOptions,
    gelatinousCubeling,
  ]);

  return (
    (needKeys || needSkeletonKeyForTower) && (
      <QuestTile
        header={`Get ${plural(
          neededTokensKeys,
          "fat loot token",
        )} or ${pluralJustDesc(neededTokensKeys, "key")}`}
        id="hero-key-quest"
        imageUrl="/images/itemimages/loottoken.gif"
      >
        {needKeys && (
          <>
            <Line href={!dailyDungeonDone ? "/da.php" : undefined}>
              Explore{" "}
              {dailyDungeonDone
                ? ""
                : `${plural(dailyDungeonRemaining, "more room")} of `}
              the Daily Dungeon{" "}
              {get("dailyDungeonDone") ? "again tomorrow " : ""}
              for a fat loot token.
              {have($item`candy cane sword cane`) &&
              !get("candyCaneSwordDailyDungeon") &&
              lastDailyDungeonRoom < 10
                ? " Wear your candy cane sword for an extra token in room 10."
                : ""}
            </Line>
            {haveUnrestricted($skill`Lock Picking`) && !get("lockPicked") && (
              <Line href={skillLink($skill`Lock Picking`)}>
                Pick a lock for one of {commaOr(heroKeysMissing)}.
              </Line>
            )}
            {haveUnrestricted($item`Deck of Every Card`) &&
              get("_deckCardsDrawn") <= 10 &&
              !get("_deckCardsSeen").includes("Tower") && (
                <Line href={inventoryLink($item`Deck of Every Card`)}>
                  Draw the Tower card from your Deck for a key.
                </Line>
              )}
            {(get("_frToday") || get("frAlways")) &&
              isUnrestricted($item`FantasyRealm guest pass`) && (
                <Line>Fight 5 fantasy bandits for a fat loot token.</Line>
              )}
          </>
        )}
        {/* TODO: Move this to another file and give skeleton keys their own tile. */}
        {needSkeletonKeyForTower ? (
          skeletonKeyOptions
        ) : skeletonKeyCount <= 1 ? (
          <Line
            command={`create ${Math.min(5, skeletonKeyCreatable)} skeleton key`}
          >
            Make up to {plural(skeletonKeyCreatable, "more skeleton key")} for
            the dungeon.
          </Line>
        ) : null}
      </QuestTile>
    )
  );
};

export default HeroKeys;
