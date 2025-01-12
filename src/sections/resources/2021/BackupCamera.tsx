import { Text } from "@chakra-ui/react";
import { myLevel } from "kolmafia";
import { $item, get } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { plural } from "../../../util/text";

/**
 * Summarizes # of backups remaining, warns the user if the reverser is off, and makes suggestions re: enchantment
 * @returns A tile describing the Backup Camera
 */

const BackupCamera = () => {
  const _backUpUses = get("_backUpUses");
  const reverserStatus = get("backupCameraReverserEnabled");
  const cameraMode = get("backupCameraMode");
  const userLevel = myLevel();

  // Change the cameraMode variable to a more-useful summary.
  const modeToEnchantment = new Map<string, string>([
    ["meat", "+50% Meat"],
    ["ml", `+${Math.min(userLevel * 3, 50)} ML`],
    ["init", "+100% Initiative"],
  ]);

  if (!haveUnrestricted($item`backup camera`)) {
    return null;
  }

  // Currently, the primary recommendation is to swap to ML if the user is under Level 13.
  //   Realistically we probably want some other modifiers here; init if nextAdv is alcove,
  //   ML if next adv is tavern/cranny, meat if next adv is nuns. I want to build this into
  //   whatever zone recommendation system we build, so I am leaving it as a pending feature.

  return (
    <Tile linkedContent={$item`backup camera`}>
      {_backUpUses < 11 && (
        <Line>{plural(11 - _backUpUses, "backup")} remaining today.</Line>
      )}
      <Line>Currently set to {modeToEnchantment.get(cameraMode)}.</Line>
      {userLevel < 13 && cameraMode !== "ml" && (
        <Line command="backupcamera ml">
          <Text as="span" color="gray.solid">
            You aren't Level 13 yet; switch to ML?
          </Text>
        </Line>
      )}
      {!reverserStatus && (
        <Line command="backupcamera reverser on">
          <Text as="span" color="red.solid">
            WARNING!
          </Text>{" "}
          Reverser is off. Turn it on, or combats are backwards!
        </Line>
      )}
    </Tile>
  );
};

export default BackupCamera;
