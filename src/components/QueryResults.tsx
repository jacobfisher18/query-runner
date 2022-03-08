import styled from "styled-components";

import { Table } from "@mantine/core";
import { QueryResult } from "../store/queryResult";

function QueryResults(props: { data: QueryResult }) {
  const { fields, rows } = props.data;
  return (
    <Container>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            {fields.map((f) => (
              <th key={f.name}>{f.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            return (
              <tr key={i}>
                {fields.map((f) => (
                  <td key={f.name}>{r[f.name] as string}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

export default QueryResults;
