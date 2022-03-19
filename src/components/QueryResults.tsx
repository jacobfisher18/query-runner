import styled from "styled-components";
import { Space, Table, Text } from "@mantine/core";
import { QueryResult } from "../store/queryResult";
import { getTheme, useTheme } from "../hooks/useTheme";
import { BsCheckCircle } from "react-icons/bs";

const HEADER_HEIGHT = 50;

function QueryResults(props: { data: QueryResult }) {
  const theme = useTheme();
  const { fields, rows } = props.data;

  return (
    <Container>
      <Header>
        <BsCheckCircle color={theme.colors.green[5]} size={20} />
        <Space w={15} />
        <Text size="sm" weight={600} color={theme.color.foreground}>
          {rows.length} Rows
        </Text>
      </Header>
      <Space h={HEADER_HEIGHT}></Space>
      <Table striped highlightOnHover style={{ borderCollapse: "collapse" }}>
        <TableHeader>
          <TableHeadRow>
            <TableHead key={0} /> {/* Line numbers */}
            {fields.map((f) => (
              <TableHead key={f.name}>{f.name}</TableHead>
            ))}
          </TableHeadRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => {
            return (
              <TableRow key={i}>
                <TableData key={i}>{i + 1}</TableData> {/* Line numbers */}
                {fields.map((f) => (
                  <TableData key={f.name}>{r[f.name] as string}</TableData>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px 30px;
  align-items: center;
  height: ${HEADER_HEIGHT}px;
  position: fixed;
  background-color: ${(p) => getTheme(p).color.background};
  width: 100%;
  border-bottom: solid 1px ${(p) => getTheme(p).color.highlight};
`;

const TableHeader = styled.thead``;

const TableHeadRow = styled.tr``;

const TableHead = styled.th`
  border-right: solid 1px ${(p) => getTheme(p).color.highlight};
  border-left: solid 1px ${(p) => getTheme(p).color.highlight};
  background-color: ${(p) => getTheme(p).color.backgroundSecondary};
  border-top: solid 1px ${(p) => getTheme(p).color.highlight};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr``;

const TableData = styled.td`
  border-right: solid 1px ${(p) => getTheme(p).color.highlight};
  border-left: solid 1px ${(p) => getTheme(p).color.highlight};
`;

export default QueryResults;
