import styled from "styled-components";
import { SavedQuery } from "../models/query";
import { Text } from "@mantine/core";
import { useSavedQueriesStore } from "../store/savedQueries";
import { isTruthy } from "../utils/nil";

function FileManager(props: { selectQuery: (q: SavedQuery) => void }) {
  const { queries } = useSavedQueriesStore();

  return (
    <Container>
      {Object.values(queries)
        .filter(isTruthy)
        .map((d, i) => (
          <File key={i} onClick={() => props.selectQuery(d)}>
            <Text size="sm">{d.name}</Text>
          </File>
        ))}
    </Container>
  );
}

const Container = styled.div`
  background-color: #f4f6fa;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100%;
  padding-top: 30px;
`;

const File = styled.div`
  padding: 5px 20px;

  &:hover {
    background-color: #eeeeee;
    cursor: pointer;
  }
`;

export default FileManager;
