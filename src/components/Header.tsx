import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Select,
  useMantineColorScheme,
} from "@mantine/core";
import { FiDatabase } from "react-icons/fi";
import { Connection, useConnectionsStore } from "../store/connections";
import { useModalsStore } from "../store/modals";
import { isTruthy } from "../utils/nil";
import ConnectionsModal from "./ConnectionsModal";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { useTheme } from "../hooks/useTheme";

function Header() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const theme = useTheme();

  const { setIsConnectionsModalOpen } = useModalsStore();

  const {
    connections,
    getSelectedConnection,
    selectConnection,
    updateConnection,
  } = useConnectionsStore();
  const selectedConnection = getSelectedConnection();

  const handleConnect = async (c: Connection) => {
    try {
      await window.electron.connectClient({
        id: c.id,
        user: c.user,
        password: c.password,
        port: parseInt(c.port, 10),
        host: c.host,
        database: c.database,
      });
      updateConnection(c.id, { isConnected: true });
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleDisconnect = async (id: string) => {
    try {
      await window.electron.disconnectClient(id);
      updateConnection(id, { isConnected: false });
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  return (
    <>
      <ConnectionsModal />
      <Group
        style={{
          height: "50px",
          borderBottom: `1px solid ${theme.color.highlight}`,
          padding: "0px 30px",
        }}
        position="apart"
      >
        <Group>
          <ActionIcon
            variant="outline"
            color={dark ? "yellow" : "blue"}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
          >
            {dark ? (
              <BsFillSunFill style={{ width: 10, height: 10 }} />
            ) : (
              <BsFillMoonFill style={{ width: 10, height: 10 }} />
            )}
          </ActionIcon>
        </Group>
        <Group>
          <Button
            variant="light"
            leftIcon={<FiDatabase />}
            size="xs"
            onClick={() => setIsConnectionsModalOpen(true)}
          >
            Connections
          </Button>
          <Select
            placeholder="DB Connection"
            searchable
            nothingFound="Not found"
            size="xs"
            style={{ width: 120 }}
            data={Object.values(connections)
              .filter(isTruthy)
              .map((c) => ({ value: c.id, label: c.name }))}
            onChange={(id) => {
              if (id) {
                selectConnection(id);
              }
            }}
          />
          {selectedConnection &&
            (selectedConnection.isConnected ? (
              <>
                <Badge variant="dot" color="green">
                  Connected
                </Badge>
                <Menu>
                  <Menu.Label>Actions</Menu.Label>
                  <Menu.Item
                    onClick={() => handleDisconnect(selectedConnection.id)}
                  >
                    Disconnect
                  </Menu.Item>
                </Menu>
              </>
            ) : (
              <Button
                variant="outline"
                size="xs"
                onClick={() => handleConnect(selectedConnection)}
              >
                <BsFillLightningChargeFill style={{ marginRight: 5 }} />
                Connect
              </Button>
            ))}
        </Group>
      </Group>
    </>
  );
}

export default Header;
