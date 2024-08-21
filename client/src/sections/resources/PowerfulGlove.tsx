import { Text } from "@chakra-ui/react";
import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { plural } from "../../util/text";
import { $item, get, have } from "libram";

/**
 * Summarizes # of glove charges remaining, gives pixel status
 * @returns A tile describing the Powerful Glove
 */

const PowerfulGlove = () => {
  const batteryUsed = get("_powerfulGloveBatteryPowerUsed");

  return (
    <Tile
      header="Powerful Glove"
      imageUrl="/images/itemimages/Pglove.gif"
      linkedContent={$item`Powerful Glove`}
      hide={!have($item`Powerful Glove`)}
    >
      {batteryUsed < 100 && (
        <Line>
          {100 - batteryUsed}% charge{" "}
          {batteryUsed <= 90 && (
            <Text as="span" color="gray.500">
              {`(can replace ${plural(
                Math.floor((100 - batteryUsed) / 10),
                "monster"
              )})`}
            </Text>
          )}
          .
        </Line>
      )}
    </Tile>
  );
};

export default PowerfulGlove;
