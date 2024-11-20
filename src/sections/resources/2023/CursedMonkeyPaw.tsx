import { List, Text } from "@chakra-ui/react";
import {
  availableAmount,
  canAdventure,
  Effect,
  haveEquipped,
  Item,
  myAscensions,
  Skill,
} from "kolmafia";
import {
  $effect,
  $item,
  $location,
  $skill,
  CursedMonkeyPaw,
  get,
  have,
  questStep,
} from "libram";
import { ReactNode } from "react";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { inventoryLink } from "../../../util/links";
import { inRun, questFinished, questStarted } from "../../../util/quest";
import { plural } from "../../../util/text";

interface MonkeyWish {
  target: Item | Effect;
  additionalDescription?: ReactNode;
  shouldDisplay: boolean;
  currentlyAccessible: boolean;
}

interface MonkeySkill {
  fingerCount: number;
  theSkill: Skill;
  description: string;
}

function inRunWishes() {
  return [
    {
      target: $item`sonar-in-a-biscuit`,
      shouldDisplay:
        questStep("questL04Bat") !== 999 &&
        !canAdventure($location`The Boss Bat's Lair`),
      currentlyAccessible: canAdventure($location`Guano Junction`),
    },
    {
      target: $item`enchanted bean`,
      shouldDisplay: !get("giantGrown") && !have($item`enchanted bean`),
      currentlyAccessible: canAdventure($location`The Beanbat Chamber`),
    },
    {
      target: $effect`Knob Goblin Perfume`,
      shouldDisplay:
        !questFinished("questL05Goblin") && !have($item`Knob Goblin perfume`),
      currentlyAccessible: true,
    },
    {
      target: $item`Knob Goblin harem veil`,
      shouldDisplay:
        !questFinished("questL05Goblin") &&
        !have($item`Knob Goblin harem veil`),
      currentlyAccessible: canAdventure($location`Cobb's Knob Harem`),
    },
    {
      target: $item`Knob Goblin harem pants`,
      shouldDisplay:
        !questFinished("questL05Goblin") &&
        !have($item`Knob Goblin harem pants`),
      currentlyAccessible: canAdventure($location`Cobb's Knob Harem`),
    },
    {
      target: $item`stone wool`,
      shouldDisplay:
        !canAdventure($location`The Hidden Park`) &&
        availableAmount($item`stone wool`) < 2,
      currentlyAccessible: canAdventure($location`The Hidden Temple`),
    },
    {
      target: $item`amulet of extreme plot significance`,
      shouldDisplay:
        !canAdventure(
          $location`The Castle in the Clouds in the Sky (Ground Floor)`,
        ) && !have($item`amulet of extreme plot significance`),
      currentlyAccessible: canAdventure(
        $location`The Penultimate Fantasy Airship`,
      ),
    },
    {
      target: $item`Mohawk wig`,
      shouldDisplay:
        !questFinished("questL10Garbage") && !have($item`Mohawk wig`),
      currentlyAccessible: canAdventure(
        $location`The Penultimate Fantasy Airship`,
      ),
    },
    {
      target: $item`book of matches`,
      shouldDisplay:
        myAscensions() !== get("hiddenTavernUnlock") &&
        !have($item`book of matches`),
      currentlyAccessible: canAdventure($location`The Hidden Park`),
    },
    {
      target: $item`rusty hedge trimmers`,
      shouldDisplay: get("twinPeakProgress") < 13,
      currentlyAccessible: canAdventure($location`Twin Peak`),
    },
    {
      target: $item`killing jar`,
      shouldDisplay:
        questStep("questL11Desert") < 2 &&
        get("desertExploration") < 100 &&
        !have($item`killing jar`),
      currentlyAccessible: canAdventure($location`The Haunted Library`),
    },
    {
      target: $effect`Dirty Pear`,
      additionalDescription: (
        <Text as="span" color="purple.500">
          double sleaze damage
        </Text>
      ),
      shouldDisplay: get("zeppelinProtestors") < 80,
      currentlyAccessible: true,
    },
    {
      target: $effect`Painted-On Bikini`,
      additionalDescription: (
        <Text as="span" color="purple.500">
          +100 sleaze damage
        </Text>
      ),
      shouldDisplay: get("zeppelinProtestors") < 80,
      currentlyAccessible: true,
    },
    {
      target: $item`glark cable`,
      shouldDisplay: questStep("questL11Ron") < 5,
      currentlyAccessible: canAdventure($location`The Red Zeppelin`),
    },
    {
      target: $item`short writ of habeas corpus`,
      shouldDisplay: !questFinished("questL11Spare"),
      currentlyAccessible: canAdventure($location`The Hidden Park`),
    },
    {
      target: $item`lion oil`,
      shouldDisplay: !have($item`Mega Gem`) && !have($item`lion oil`),
      currentlyAccessible: canAdventure($location`Whitey's Grove`),
    },
    {
      target: $item`bird rib`,
      shouldDisplay: !have($item`Mega Gem`) && !have($item`bird rib`),
      currentlyAccessible: canAdventure($location`Whitey's Grove`),
    },
    {
      target: $item`drum machine`,
      shouldDisplay:
        get("desertExploration") < 100 && !have($item`drum machine`),
      currentlyAccessible: canAdventure($location`The Oasis`),
    },
    {
      target: $item`shadow brick`,
      shouldDisplay:
        get("_shadowBricksUsed") + availableAmount($item`shadow brick`) < 13,
      currentlyAccessible: true,
    },
    {
      target: $item`green smoke bomb`,
      shouldDisplay:
        !questFinished("questL12War") &&
        get("sidequestArenaCompleted") !== "hippy",
      currentlyAccessible:
        questStarted("questL12War") && get("hippiesDefeated") >= 400,
    },
    {
      target: $item`star chart`,
      shouldDisplay:
        !get("nsTowerDoorKeysUsed").includes("Richard's star key") &&
        !have($item`Richard's star key`) &&
        !have($item`star chart`),
      currentlyAccessible: canAdventure($location`The Hole in the Sky`),
    },
    {
      target: $effect`Frosty`,
      additionalDescription: "init/item/meat",
      shouldDisplay:
        !get("nsTowerDoorKeysUsed").includes("digital key") &&
        !have($item`digital key`) &&
        get("8BitScore") < 10000,
      currentlyAccessible: true,
    },
    {
      target: $effect`Staying Frosty`,
      additionalDescription: (
        <Text as="span" color="blue.500">
          cold damage race
        </Text>
      ),
      shouldDisplay:
        get("nsContestants3") !== -1 && get("nsChallenge2") === "cold",
      currentlyAccessible: true,
    },
    {
      target: $effect`Dragged Through the Coals`,
      additionalDescription: (
        <Text as="span" color="red.500">
          hot damage race
        </Text>
      ),
      shouldDisplay:
        get("nsContestants3") !== -1 && get("nsChallenge2") === "hot",
      currentlyAccessible: true,
    },
    {
      target: $effect`Bored Stiff`,
      additionalDescription: (
        <Text as="span" color="gray.500">
          spooky damage race
        </Text>
      ),
      shouldDisplay:
        get("nsContestants3") !== -1 && get("nsChallenge2") === "spooky",
      currentlyAccessible: true,
    },
    {
      target: $effect`Sewer-Drenched`,
      additionalDescription: (
        <Text as="span" color="green.500">
          stench damage race
        </Text>
      ),
      shouldDisplay:
        get("nsContestants3") !== -1 && get("nsChallenge2") === "stench",
      currentlyAccessible: true,
    },
    {
      target: $effect`Fifty Ways to Bereave Your Lover`,
      additionalDescription: (
        <Text as="span" color="purple.500">
          sleaze damage race
        </Text>
      ),
      shouldDisplay:
        get("nsContestants3") !== -1 &&
        get("nsChallenge2") === "sleaze" &&
        get("zeppelinProtestors") > 79,
      currentlyAccessible: true,
    },
    {
      target: $item`lowercase N`,
      additionalDescription: "summon the nagamar",
      shouldDisplay:
        questStep("questL13Final") < 14 &&
        !have($item`lowercase N`) &&
        have($item`ruby W`) &&
        have($item`metallic A`) &&
        have($item`heavy D`),
      currentlyAccessible: canAdventure($location`The Valley of Rof L'm Fao`),
    },
  ];
}

function aftercoreWishes() {
  return [
    {
      target: $item`bag of foreign bribes`,
      shouldDisplay: canAdventure($location`The Ice Hotel`),
      currentlyAccessible: true,
    },
  ];
}

function monkeySkills(): MonkeySkill[] {
  return [
    {
      fingerCount: 5,
      theSkill: $skill`Monkey Slap`,
      description: "killbanish",
    },
    { fingerCount: 4, theSkill: $skill`Monkey Tickle`, description: "delevel" },
    {
      fingerCount: 3,
      theSkill: $skill`Evil Monkey Eye`,
      description: "spooky delevel",
    },
    {
      fingerCount: 2,
      theSkill: $skill`Monkey Peace Sign`,
      description: "heal",
    },
    {
      fingerCount: 1,
      theSkill: $skill`Monkey Point`,
      description: "Olfaction-lite",
    },
  ];
}

function showWish({
  target,
  currentlyAccessible,
  additionalDescription,
}: MonkeyWish) {
  const color = currentlyAccessible ? "black" : "gray.500";

  return (
    <List.Item color={color} key={target.identifierString}>
      {target.name}
      {additionalDescription && <>: {additionalDescription}</>}
    </List.Item>
  );
}

function showWishes(wishes: MonkeyWish[]) {
  const currentWishes = wishes
    .filter((wish) => wish.shouldDisplay && wish.currentlyAccessible)
    .map(showWish);
  const futureWishes = wishes
    .filter((wish) => wish.shouldDisplay && !wish.currentlyAccessible)
    .map(showWish);
  return [...currentWishes, ...futureWishes];
}

const CursedMonkeysPaw = () => {
  const cursedMonkeysPaw = $item`cursed monkey's paw`;

  const monkeyWishesLeft = CursedMonkeyPaw.wishes();

  if (!haveUnrestricted(cursedMonkeysPaw) || monkeyWishesLeft === 0) {
    return null;
  }

  const options = inRun()
    ? showWishes(inRunWishes())
    : showWishes(aftercoreWishes());

  return (
    <Tile
      header={plural(
        monkeyWishesLeft,
        "monkey's paw wish",
        "monkey's paw wishes",
      )}
      imageUrl={
        monkeyWishesLeft > 0
          ? `/images/itemimages/monkeypaw${5 - monkeyWishesLeft}.gif`
          : undefined
      }
      linkedContent={cursedMonkeysPaw}
    >
      <Line href="/main.php?action=cmonk">
        Return to monke. Wish for items or effects:
      </Line>
      {options.length > 0 && (
        <>
          <Line fontWeight="bold">Possible wishes:</Line>
          <List.Root>{options}</List.Root>
        </>
      )}
      <Line fontWeight="bold">Monkey skills:</Line>
      <List.Root>
        {monkeySkills().map((skill) => (
          <List.Item key={skill.fingerCount}>
            <Text as="b">
              {plural(skill.fingerCount, "finger", "fingers")}:
            </Text>{" "}
            {skill.description}
          </List.Item>
        ))}
      </List.Root>
      {monkeyWishesLeft === 5 && (
        <>
          <Line
            href={
              haveEquipped(cursedMonkeysPaw)
                ? inventoryLink(cursedMonkeysPaw)
                : undefined
            }
          >
            Turn-taking repeat-use banish. Lasts until you use it again!
          </Line>
          {!haveEquipped(cursedMonkeysPaw) && (
            <Line>Equip your cursed monkey paw first.</Line>
          )}
        </>
      )}
    </Tile>
  );
};

export default CursedMonkeysPaw;
