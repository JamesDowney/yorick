import { List, Strong } from "@chakra-ui/react";
import { availableAmount, getCampground } from "kolmafia";
import { $item, get, have } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { inventoryLink } from "../../../util/links";
import { canAccessGarden } from "../../../util/paths";
import { inRun } from "../../../util/quest";

const gravelMessage = (gravels: number) => {
  return (
    <>
      <Strong>{gravels}</Strong>x groveling gravel (free kill*)
    </>
  );
};

const whetStoneMessage = (whetStones: number) => {
  return (
    <>
      <Strong>{whetStones}</Strong>x whet stone (+1 adv on food)
    </>
  );
};

const milestoneMessage = (milestones: number) => {
  const desertProgress = get("desertExploration");
  return (
    <>
      <Strong>{milestones}</Strong>x milestone (+5% desert progress),{" "}
      {100 - desertProgress}% remaining
    </>
  );
};

const RockGarden = () => {
  const gardenGravels = getCampground()["groveling gravel"];
  const gardenMilestones = getCampground()["milestone"];
  const gardenWhetstones = getCampground()["whet stone"];
  const desertProgress = get("desertExploration");

  const availableGravels = availableAmount($item`groveling gravel`);
  const availableMilestones = availableAmount($item`milestone`);
  const availableWhetStones = availableAmount($item`whet stone`);

  const isCommunityService = get("challengePath") === "Community Service";
  const canAccess = canAccessGarden();

  if (
    isCommunityService ||
    !canAccess ||
    !inRun() ||
    availableGravels + availableMilestones + availableWhetStones === 0
  ) {
    return null;
  }

  return (
    <Tile
      header="Rock Garden Resources"
      href="/campground.php"
      imageUrl="/images/itemimages/rockgardenbook.gif"
    >
      {!get("_molehillMountainUsed") && have($item`molehill mountain`) && (
        <Line href={inventoryLink($item`molehill mountain`)}>
          Molehill moleman: Free scaling fight.
        </Line>
      )}
      {(availableGravels > 0 ||
        availableWhetStones > 0 ||
        (availableMilestones > 0 && desertProgress < 100)) && (
        <>
          <Line>Inventory:</Line>
          <List.Root>
            {availableGravels > 0 && (
              <List.Item>{gravelMessage(availableGravels)}</List.Item>
            )}
            {availableWhetStones && (
              <List.Item>{whetStoneMessage(availableWhetStones)}</List.Item>
            )}
            {availableMilestones && desertProgress < 100 && (
              <List.Item>{milestoneMessage(availableMilestones)}</List.Item>
            )}
          </List.Root>
        </>
      )}
      {(gardenGravels > 0 ||
        gardenWhetstones > 0 ||
        (gardenMilestones > 0 && desertProgress < 100)) && (
        <>
          <Line>Harvest from your garden:</Line>
          <List.Root>
            {gardenGravels > 0 && (
              <List.Item>{gravelMessage(gardenGravels)}</List.Item>
            )}
            {gardenWhetstones > 0 && (
              <List.Item>{whetStoneMessage(gardenWhetstones)}</List.Item>
            )}
            {gardenMilestones > 0 && desertProgress < 100 && (
              <List.Item>{milestoneMessage(gardenMilestones)}</List.Item>
            )}
          </List.Root>
        </>
      )}
    </Tile>
  );
};

export default RockGarden;
