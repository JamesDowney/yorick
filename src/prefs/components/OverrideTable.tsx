import { Heading, Table } from "@chakra-ui/react";
import { FC } from "react";

import OverrideRow from "./OverrideRow";

interface OverrideTableProps {
  filterRegex: RegExp | null;
  heading: string;
  data: string[];
  getOverride: (row: string) => string;
  getCurrent: (row: string) => string;
}

const OverrideTable: FC<OverrideTableProps> = ({
  heading,
  filterRegex,
  data,
  getOverride,
  getCurrent,
}) => (
  <>
    <Heading as="h2" size="md" textAlign="center">
      {heading}
    </Heading>
    <Table.Root size="sm">
      <Table.Body>
        {data
          .filter((item) => !filterRegex || filterRegex.test(getOverride(item)))
          .map((item) => (
            <OverrideRow
              key={getOverride(item)}
              override={getOverride(item)}
              label={item}
              current={getCurrent(item)}
            />
          ))}
      </Table.Body>
    </Table.Root>
  </>
);

export default OverrideTable;
