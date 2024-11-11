import { itemAmount, numericModifier, toItem } from "kolmafia";
import { $item, $location, $monster, get, have, questStep } from "libram";
import { FC } from "react";

import Line from "../../components/Line";
import Monsters from "../../components/Monsters";
import QuestTile from "../../components/QuestTile";
import faxLikes from "../../util/faxLikes";
import { atStep, Step } from "../../util/quest";
import { commaAnd, commaOr, plural, truthy } from "../../util/text";

const TRAPPER_URL = "/place.php?whichplace=mclargehuge&action=trappercabin";

const Level8: FC = () => {
  const step = questStep("questL08Trapper");

  const goatCheese = itemAmount($item`goat cheese`);
  const oreType = get("trapperOre") || "none";
  const ore = oreType !== "none" ? itemAmount(toItem(oreType)) : 0;

  const rope = have($item`ninja rope`);
  const crampons = have($item`ninja crampons`);
  const carabiner = have($item`ninja carabiner`);
  const ninjaCount = (rope ? 1 : 0) + (crampons ? 1 : 0) + (carabiner ? 1 : 0);

  const coldRes = Math.floor(numericModifier("Cold Resistance"));

  const yetiCount = $location`Mist-Shrouded Peak`.turnsSpent;

  if (step === Step.FINISHED) return null;

  // TODO: Support eXtreme slope path.
  return (
    <QuestTile
      header="Trapper"
      imageUrl={atStep(step, [
        [Step.UNSTARTED, "/images/otherimages/thetrapper.gif"],
      ])}
      href={atStep(step, [
        [Step.UNSTARTED, "/council.php"],
        [Step.STARTED, TRAPPER_URL],
        [1, undefined],
        [2, "/place.php?whichplace=mclargehuge"],
      ])}
      minLevel={8}
    >
      {atStep(step, [
        [Step.UNSTARTED, <Line>Visit Council to start quest.</Line>],
        [Step.STARTED, <Line>Visit the Trapper to get your assignment.</Line>],
        [
          1,

          goatCheese < 3 || ore < 3 ? (
            <>
              <Line href="/place.php?whichplace=mclargehuge">
                Acquire{" "}
                {commaAnd(
                  truthy([
                    goatCheese < 3 && `${3 - goatCheese} goat cheese`,
                    ore < 3 && `${3 - ore} ${oreType}`,
                  ]),
                )}
                .
              </Line>
              {goatCheese < 3 && (
                <Line>
                  <Monsters
                    location={$location`The Goatlet`}
                    target={$monster`dairy goat`}
                  />
                </Line>
              )}
              {ore < 3 && faxLikes.length > 0 && (
                <Line>Could use {commaOr(faxLikes())} for a mountain man.</Line>
              )}
            </>
          ) : (
            <Line href={TRAPPER_URL}>Return to the trapper.</Line>
          ),
        ],
        [
          2,
          ninjaCount < 3 ? (
            <Line>
              Stack +combat and adventure for{" "}
              {plural(
                3 - ninjaCount,
                "ninja snowman assassin",
                "ninja snowmen assassins",
              )}
              . Need{" "}
              {commaAnd(
                truthy([
                  !rope && "ninja rope",
                  !crampons && "ninja crampons",
                  !carabiner && "ninja carabiner",
                ]),
              )}
              .
            </Line>
          ) : (
            <Line>
              {coldRes >= 5
                ? "Climb "
                : `Get 5 cold resistance (+${5 - coldRes}) and climb `}
              the Icy Peak.
            </Line>
          ),
        ],
        [
          3,
          <Line>
            {coldRes >= 5
              ? "Fight "
              : `Get 5 cold resistance (+${5 - coldRes}) and fight `}
            {yetiCount < 3
              ? `${plural(3 - yetiCount, "yeti")} and Groar`
              : "Groar"}
            .
          </Line>,
        ],
        [5, <Line>Return fur to the Trapper.</Line>],
      ])}
    </QuestTile>
  );
};

export default Level8;
