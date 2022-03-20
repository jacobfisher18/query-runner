import {
  Badge,
  Button,
  Group,
  Loader,
  Menu,
  Select,
  Switch,
  useMantineColorScheme,
} from "@mantine/core";
import { FiDatabase } from "react-icons/fi";
import { useConnectionsStore } from "../store/connections";
import { useModalsStore } from "../store/modals";
import { isTruthy } from "../utils/nil";
import ConnectionsModal from "./ConnectionsModal";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { useTheme } from "../hooks/useTheme";
import { useConnections } from "../hooks/useConnections";
import { Connection } from "../models/connection";
import { useState } from "react";
import { sleep } from "../utils/time";

function Header() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const theme = useTheme();

  const [isConnectLoading, setIsConnectLoading] = useState(false);

  const { setIsConnectionsModalOpen } = useModalsStore();

  const { connections } = useConnections();

  const {
    selectedConnectionId,
    selectConnection,
    connectedConnectionIds,
    addConnectedConnection,
    removeConnectedConnection,
  } = useConnectionsStore();
  const selectedConnection = Object.values(connections || {}).find(
    (c) => c?.id === selectedConnectionId
  );

  const handleConnect = async (c: Connection) => {
    try {
      setIsConnectLoading(true);
      await sleep(300); // Sleep to prevent jitter
      await window.electron.connectClient({
        id: c.id,
        user: c.user,
        password: c.password,
        port: parseInt(c.port, 10),
        host: c.host,
        database: c.database,
      });
      addConnectedConnection(c.id);
      setIsConnectLoading(false);
    } catch (err: unknown) {
      setIsConnectLoading(false);
      alert((err as Error).message);
    }
  };

  const handleDisconnect = async (id: string) => {
    try {
      await window.electron.disconnectClient(id);
      removeConnectedConnection(id);
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
          {dark ? (
            <BsFillSunFill
              color={theme.colors.yellow[3]}
              style={{ width: 15, height: 15 }}
            />
          ) : (
            <BsFillMoonFill
              color={theme.colors.blue[3]}
              style={{ width: 15, height: 15 }}
            />
          )}
          <Switch checked={dark} onChange={() => toggleColorScheme()} />
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
            data={Object.values(connections ?? {})
              .filter(isTruthy)
              .map((c) => ({ value: c.id, label: c.name }))}
            onChange={(id) => {
              if (id) {
                selectConnection(id);
              }
            }}
          />
          {selectedConnection &&
            (connectedConnectionIds.includes(selectedConnectionId ?? "") ? (
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
                leftIcon={
                  isConnectLoading ? (
                    <Loader size={14} style={{ marginRight: 5 }} />
                  ) : (
                    <BsFillLightningChargeFill style={{ marginRight: 5 }} />
                  )
                }
                variant="outline"
                size="xs"
                onClick={() => handleConnect(selectedConnection)}
              >
                Connect
              </Button>
            ))}
        </Group>
      </Group>
    </>
  );
}

export default Header;
