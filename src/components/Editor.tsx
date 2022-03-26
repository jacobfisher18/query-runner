import styled from "styled-components";
import { useTheme } from "../hooks/useTheme";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { githubLight } from "../lib/codeMirrorThemes/githubLight";
import { oneDark } from "../lib/codeMirrorThemes/oneDark";

function Editor({
  code,
  setCode,
}: {
  code: string;
  setCode: (code: string) => void;
}) {
  const theme = useTheme();

  const handleChange = (e: any, obj: any) => {
    /**
     * This is needed because the onChange event can also fire upon other events, which
     * leads to unintended updates to the code and thus buggy behavior.
     */
    if (obj.selectionSet) {
      setCode(e);
    }
  };

  return (
    <Container>
      <CodeMirror
        value={code}
        extensions={[sql()]}
        onChange={handleChange}
        theme={theme.colorScheme === "dark" ? oneDark : githubLight}
        style={{
          fontSize: 12,
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

  div {
    /* Disable outline that is being applied by CodeMirror */
    outline: none !important;
  }
`;

export default Editor;
