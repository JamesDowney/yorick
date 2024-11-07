import {
  availableAmount,
  canInteract,
  myAscensions,
  myDaycount,
} from "kolmafia";
import { $familiar, $item, get, have } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { inRun } from "../../../util/quest";
import { pluralJustDesc } from "../../../util/text";

const PuckMan = () => {
  const puckMan = have($familiar`Ms. Puck Man`)
    ? $familiar`Ms. Puck Man`
    : $familiar`Puck Man`;
  const powerPillsEaten = get("_powerPillUses");
  const powerPillDrops = get("_powerPillDrops");
  const powerPillMaxDrops = myDaycount() + 1;
  const yellowPixels = availableAmount($item`yellow pixel`);

  if (!have(puckMan)) return null;

  return (
    <Tile linkedContent={puckMan} imageUrl="/images/itemimages/puckman.gif">
      {canInteract() && <Line>Power Pills: {powerPillsEaten}/20 used.</Line>}
      {inRun() && (
        <Line>
          {powerPillDrops}/{powerPillMaxDrops} power pill{" "}
          {pluralJustDesc(powerPillDrops, "drop")}.
        </Line>
      )}
      {inRun() && get("lastIslandUnlock") < myAscensions() && (
        <Line
          command={yellowPixels >= 50 ? "acquire yellow submarine" : undefined}
        >
          Open Mysterious Island with a yellow submarine
          {yellowPixels < 50 &&
            ` (need ${50 - yellowPixels} more yellow pixels)`}
          .
        </Line>
      )}
    </Tile>
  );
};

export default PuckMan;
