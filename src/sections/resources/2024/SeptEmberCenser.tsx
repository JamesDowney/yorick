import { List, Text } from "@chakra-ui/react";
import { availableAmount, myPrimestat, numericModifier } from "kolmafia";
import { $item, get, have } from "libram";

import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { inventoryLink } from "../../../util/links";

const SeptEmberCenser = () => {
  const septEmberCenser = $item`Sept-Ember Censer`;

  if (!haveUnrestricted(septEmberCenser)) {
    return null;
  }

  const bembershoot = $item`bembershoot`;
  const mmmBrrMouthwash = $item`Mmm-brr! brand mouthwash`;
  const septEmbers =
    get("availableSeptEmbers") + 7 * +!get("_septEmberBalanceChecked");
  const coldResistance = numericModifier("cold resistance");
  const mainstatGain = Math.floor(
    7 *
      coldResistance ** 1.7 *
      (1.0 + numericModifier(`${myPrimestat()} Experience Percent`) / 100.0),
  );
  const bembershootCount = availableAmount(bembershoot);
  const mouthwashCount = availableAmount(mmmBrrMouthwash);
  const structuralEmber = $item`structural ember`;
  const structureUsed = get("_structuralEmberUsed");
  const miniEmberingHulk = $item`miniature Embering Hulk`;
  const hulkFought = get("_emberingHulkFought");

  if (septEmbers <= 0) return null;

  return (
    <Tile
      header="Sept-Ember Censer"
      href="/shop.php?whichshop=september"
      imageUrl="/images/itemimages/embercenser.gif"
    >
      {septEmbers > 0 && (
        <>
          <Line>
            Have{" "}
            <Text as="span" color="red.solid" fontWeight="bold">
              {septEmbers}
            </Text>{" "}
            Sept-Embers to make stuff with!
          </Line>
          <List.Root>
            <List.Item>
              1 embers: +5 cold res accessory (you have {bembershootCount}).
            </List.Item>
            <List.Item>
              2 embers: mouthwash for{" "}
              <Text as="span" color="blue.solid">
                {mainstatGain}
              </Text>{" "}
              mainstat (you have{" "}
              <Text as="span" color="red.solid">
                {mouthwashCount}
              </Text>
              ).
            </List.Item>
            {!have(structuralEmber) && (
              <List.Item>4 embers: +5/5 bridge parts (1/day).</List.Item>
            )}
            {!hulkFought && !have(miniEmberingHulk) && (
              <List.Item>6 embers: embering hulk (1/day).</List.Item>
            )}
          </List.Root>
        </>
      )}
      {!structureUsed && have(structuralEmber) && (
        <Line href={inventoryLink(structuralEmber)}>
          Use your structural ember for bridge parts.
        </Line>
      )}
      {!hulkFought && have(miniEmberingHulk) && (
        <Line href={inventoryLink(miniEmberingHulk)}>
          Fight an Embering Hulk.
        </Line>
      )}
    </Tile>
  );
};

export default SeptEmberCenser;
