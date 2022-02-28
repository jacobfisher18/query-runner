import { Badge, Group, Tooltip } from "@mantine/core";

function Header({ dbName }: { dbName: string }) {
  return (
    <Group
      style={{
        height: "50px",
        borderBottom: "1px solid #eeeeee",
        padding: "0px 30px",
      }}
      position="apart"
    >
      <Group></Group>
      <Group>
        <Tooltip label={`connected to ${dbName}`} position="left">
          <Badge variant="dot" color="green">
            {dbName}
          </Badge>
        </Tooltip>
      </Group>
    </Group>
  );
}

export default Header;
