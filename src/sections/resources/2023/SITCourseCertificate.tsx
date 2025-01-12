import { $item, $skill, have } from "libram";
import { useMemo } from "react";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { NagPriority } from "../../../contexts/NagContext";
import useNag from "../../../hooks/useNag";
import { haveUnrestricted } from "../../../util/available";
import { inventoryUseLink } from "../../../util/links";
import { inRun } from "../../../util/quest";

const MISC_PHRASES = [
  "Don't play hooky!",
  "You already paid for it.",
  "This one time in college...",
  "Bright college days, oh, carefree days that fly.",
  "No child of mine is leaving here without a degree!",
  "Make like a tree and leaf (through your papers).",
];

const SITCertificate = () => {
  const sitCertificate = $item`S.I.T. Course Completion Certificate`;
  const haveSit = haveUnrestricted(sitCertificate);
  const currentlyInRun = inRun();

  const havePsychogeologist = have($skill`Psychogeologist`);
  const haveInsectologist = have($skill`Insectologist`);
  const haveCryptobotanist = have($skill`Cryptobotanist`);

  const hasAnySkill =
    havePsychogeologist || haveInsectologist || haveCryptobotanist;

  const randomPhrase = useMemo(
    () => MISC_PHRASES[Math.floor(Math.random() * MISC_PHRASES.length)],
    [],
  );

  useNag(
    () => ({
      id: "sit-course-certificate-nag",
      priority: NagPriority.LOW,
      imageUrl: "/images/itemimages/sitcert.gif",
      node: haveSit && currentlyInRun && !hasAnySkill && (
        <Tile
          header="S.I.T. Course Enrollment"
          imageUrl="/images/itemimages/sitcert.gif"
          href={inventoryUseLink(sitCertificate)}
          linkEntireTile
        >
          <Line>{randomPhrase} Take your S.I.T. course!</Line>
        </Tile>
      ),
    }),
    [currentlyInRun, hasAnySkill, haveSit, randomPhrase, sitCertificate],
  );

  return null;
};

export default SITCertificate;
