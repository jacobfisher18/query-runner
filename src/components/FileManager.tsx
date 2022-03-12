import styled from "styled-components";
import { Text } from "@mantine/core";
import { useQueriesStore } from "../store/queries";
import { isTruthy } from "../utils/nil";
import { useTheme } from "../hooks/useTheme";
import { useHandleSelectQuery } from "../hooks/useHandleSelectQuery";

function FileManager() {
  const theme = useTheme();
  const { queries } = useQueriesStore();

  const { handleSelectQuery } = useHandleSelectQuery();

  return (
    <Container>
      {Object.values(queries)
        .filter(isTruthy)
        .map((d, i) => (
          <File key={i} onClick={() => handleSelectQuery(d)}>
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
