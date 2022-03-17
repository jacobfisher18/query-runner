import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-pgsql";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-chrome";

import styled from "styled-components";
import { useTheme } from "../hooks/useTheme";

function Editor({
  code,
  setCode,
  onKeyDown,
}: {
  code: string;
  setCode: (code: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
}) {
  const theme = useTheme();

  const renderLineNumbers = (input: string) =>
    input
      .split("\n")
      .map((_, i) => <LineNumberLine key={i + 1}>{i + 1}</LineNumberLine>);

  return (
    <Container>
      <LineNumbers>{renderLineNumbers(code)}</LineNumbers>
      <AceEditor
        value={code}
        mode="pgsql"
        theme={theme.colorScheme === "dark" ? "monokai" : "chrome"}
        onChange={(val) => setCode(val)}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        showGutter={false}
        // TODO: How to enable hotkeys
        // onKeyDown={onKeyDown}
        highlightActiveLine={false}
        style={{
          fontSize: 12,
          backgroundColor: theme.color.highlight,
          lineHeight: 1.5,
          width: "100%",
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const LineNumbers = styled.div`
  background-color: ${(p) => p.theme.color.highlight};
  padding-top: 0px;
  padding-left: 10px;
  min-width: 25px;
`;

const LineNumberLine = styled.p`
  line-height: 1.5;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono,
    Menlo, monospace;
  color: ${(p) => p.theme.color.highlightSecondary};
`;

export default Editor;
