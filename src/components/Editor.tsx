import CodeEditor from "@uiw/react-textarea-code-editor";
import styled from "styled-components";

function Editor({
  code,
  setCode,
  onKeyDown,
}: {
  code: string;
  setCode: (code: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
}) {
  const renderLineNumbers = (input: string) =>
    input
      .split("\n")
      .map((_, i) => <LineNumberLine key={i + 1}>{i + 1}</LineNumberLine>);

  return (
    <Container>
      <LineNumbers>{renderLineNumbers(code)}</LineNumbers>
      <CodeEditor
        value={code}
        language="sql"
        placeholder=""
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        onKeyDown={onKeyDown}
        style={{
          fontSize: 12,
          backgroundColor: "#f5f5f5",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
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
  background-color: #f5f5f5;
  padding-top: 15px;
  padding-left: 10px;
  min-width: 25px;
`;

const LineNumberLine = styled.p`
  line-height: 1.5;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono,
    Menlo, monospace;
  color: #aaa;
`;

export default Editor;
