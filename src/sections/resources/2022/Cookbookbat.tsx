import { Stack, Text, UnorderedList } from "@chakra-ui/react";
import { availableAmount } from "kolmafia";
import { $familiar, $item, clamp, get } from "libram";

import AdviceTooltip from "../../../components/AdviceTooltip";
import Line from "../../../components/Line";
import Tile from "../../../components/Tile";
import { haveUnrestricted } from "../../../util/available";
import { plural } from "../../../util/text";

const Cookbookbat = () => {
  const cookbookbat = $familiar`Cookbookbat`;
  const whey = $item`St. Sneaky Pete's Whey`;
  const veg = $item`Vegetable of Jarlsberg`;
  const yeast = $item`Yeast of Boris`;

  if (!haveUnrestricted(cookbookbat)) return null;

  const wheyAmount = availableAmount(whey);
  const vegAmount = availableAmount(veg);
  const yeastAmount = availableAmount(yeast);

  if (!get("_canEat") && wheyAmount + vegAmount + yeastAmount < 1) return null;

  const borisBreadCraftable = Math.floor(yeastAmount / 2);
  const roastedVegCraftable = Math.floor(vegAmount / 2);
  const focacciaCraftable =
    roastedVegCraftable > 0 && borisBreadCraftable > 0
      ? Math.min(borisBreadCraftable, roastedVegCraftable)
      : 0;

  const freeCooksRemaining = clamp(5 - get("_cookbookbatCrafting"), 0, 5);

  return (
    <Tile
      header="Pizza party with the Cookbookbat!"
      imageUrl="/images/itemimages/bbat_fam.gif"
      href="/craft.php?mode=cook"
    >
      <Line href="/craft.php?mode=cook">
        You currently have {wheyAmount} whey, {vegAmount} veg, and {yeastAmount}{" "}
        yeast. Make:
      </Line>
      <UnorderedList>
        <Line>
          <b>{borisBreadCraftable}x Boris's Bread:</b> +100% meat.
        </Line>
        <Line>
          <b>{roastedVegCraftable}x Roasted Vegetable of Jarlsberg:</b> +100%
          item.
        </Line>
        <Line>
          <b>{focacciaCraftable}x Roasted Vegetable Focaccia:</b> +10 fam XP.
        </Line>
      </UnorderedList>
      <AdviceTooltip
        text={
          <Stack align="start">
            <Text as="b">Cookbookbat Recipes!</Text>
            <Text>Boris's Bread = yeast + yeast</Text>
            <Text>Roasted Vegetable of Jarlsberg = veg + veg</Text>
            <Text>Roasted Vegetable Focaccia = bread + roastveg</Text>
          </Stack>
        }
        label="Important Recipes"
      />
      {freeCooksRemaining > 0 && (
        <Line>
          <b>{plural(freeCooksRemaining, "free cook")}:</b> Unstable fulminate,
          potions, and more.
        </Line>
      )}
    </Tile>
  );
};

export default Cookbookbat;
