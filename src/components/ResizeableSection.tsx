import { useTheme } from "../hooks/useTheme";
import { Resizable } from "re-resizable";

function ResizeableSection({
  children,
}: {
  children?: JSX.Element | JSX.Element[];
}): JSX.Element {
  const theme = useTheme();

  return (
    <Resizable
      defaultSize={{
        width: "auto",
        height: "auto",
      }}
      enable={{
        top: true,
        right: false,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      style={{
        overflowY: "scroll",
        borderTop: `2px solid ${theme.color.highlight}`,
      }}
      maxHeight={500}
    >
      {children && { ...children }}
    </Resizable>
  );
}

export default ResizeableSection;
