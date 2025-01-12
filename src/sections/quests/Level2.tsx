import { $location, questStep } from "libram";
import { FC } from "react";

import ForestNoncombatAdvice from "../../components/ForestNoncombatAdvice";
import Line from "../../components/Line";
import QuestTile from "../../components/QuestTile";
import { atStep, Step } from "../../util/quest";
import { plural } from "../../util/text";

const Level2: FC = () => {
  const forest = $location`The Spooky Forest`;
  const step = questStep("questL02Larva");

  if (step === Step.FINISHED) return null;

  return (
    <QuestTile
      header="Spooky Forest"
      imageUrl="/images/adventureimages/forest.gif"
      href={atStep(step, [
        [Step.UNSTARTED, "/council.php"],
        [Step.STARTED, "/woods.php"],
        [1, "/council.php"],
        [Step.FINISHED, undefined],
      ])}
      linkEntireTile
      minLevel={2}
    >
      {atStep(step, [
        [Step.UNSTARTED, <Line>Visit Council to start quest.</Line>],
        [
          Step.STARTED,
          forest.turnsSpent < 5 ? (
            <Line>
              Burn {plural(5 - forest.turnsSpent, "turn")} of delay in the
              Spooky Forest.
            </Line>
          ) : (
            <>
              <Line>Find NC for mosquito larva.</Line>
              <ForestNoncombatAdvice />
            </>
          ),
        ],
        [1, <Line>Turn in larva to the Council.</Line>],
      ])}
    </QuestTile>
  );
};

export default Level2;
