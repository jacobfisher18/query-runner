import styled from "styled-components";
import { Text } from "@mantine/core";
import { Query, useQueriesStore } from "../store/queries";
import { isTruthy } from "../utils/nil";
import { useTheme } from "../hooks/useTheme";

function FileManager(props: { selectQuery: (q: Query) => void }) {
  const theme = useTheme();
  const { queries } = useQueriesStore();

  return (
    <Container>
      {Object.values(queries)
        .filter(isTruthy)
        .map((d, i) => (
          <File key={i} onClick={() => props.selectQuery(d)}>
            <Text size="sm" color={theme.color.foreground}>
              {d.name}
            </Text>
          </File>
        ))}
    </Container>
  );
}

const Container = styled.div`
  background-color: ${(p) => p.theme.color.backgroundSecondary};
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100%;
  padding-top: 30px;
`;

const File = styled.div`
  padding: 5px 20px;

  &:hover {
    background-color: ${(p) => p.theme.color.backgroundSecondaryHover};
    cursor: pointer;
  }
`;

export default FileManager;
