import {
  Accordion,
  Button,
  Group,
  Modal,
  Space,
  TextInput,
  Text,
  Select,
  Divider,
} from "@mantine/core";
import styled from "styled-components";
import { useConnectionsStore } from "../store/connections";
import { useModalsStore } from "../store/modals";
import { isTruthy } from "../utils/nil";
import { FiDatabase } from "react-icons/fi";

function AccordionLabel({
  label,
  icon,
  description,
}: {
  label: string;
  icon: JSX.Element;
  description: string;
}) {
  return (
    <Group noWrap>
      {icon}
      <div>
        <Text>{label}</Text>
        <Text size="sm" color="dimmed" weight={400}>
          {description}
        </Text>
      </div>
    </Group>
  );
}

function ConnectionsModal() {
  const {
    isConnectionsModalOpen: isOpen,
    setIsConnectionsModalOpen: setIsOpen,
  } = useModalsStore();

  const { connections, updateConnection, addConnection, removeConnection } =
    useConnectionsStore();

  const handleAdd = () => {
    addConnection({ name: "Untitled Connection" });
  };

  const handleDelete = (connectionId: string) => {
    removeConnection(connectionId);
  };

  return (
    <Modal
      opened={isOpen}
      onClose={() => setIsOpen(false)}
      title="Database Connections"
    >
      <Group position="right" mt={20}>
        <Button variant="filled" size="xs" onClick={handleAdd}>
          New Connection
        </Button>
      </Group>
      <Divider mt={10} />
      <Accordion iconPosition="right">
        {Object.values(connections)
          .filter(isTruthy)
          .map((c) => (
            <Accordion.Item
              key={c.id}
              label={
                <AccordionLabel
                  icon={<FiDatabase />}
                  label={c.name}
                  description={c.type}
                />
              }
            >
              <TextInput
                value={c.name}
                placeholder="User Database Prod"
                label="Name"
                onChange={(e) =>
                  updateConnection(c.id, { name: e.target.value })
                }
              />
              <Row>
                <TextInput
                  value={c.host}
                  placeholder="localhost"
                  label="Host"
                  onChange={(e) =>
                    updateConnection(c.id, { host: e.target.value })
                  }
                />
                <Space w={10} />
                <TextInput
                  value={c.port}
                  placeholder="4321"
                  label="Port"
                  onChange={(e) =>
                    updateConnection(c.id, { port: e.target.value })
                  }
                />
              </Row>
              <Row>
                <TextInput
                  value={c.user}
                  placeholder="writer_user"
                  label="User"
                  onChange={(e) =>
                    updateConnection(c.id, { user: e.target.value })
                  }
                />
                <Space w={10} />
                <TextInput
                  type="password"
                  value={c.password}
                  placeholder="******"
                  label="Password"
                  onChange={(e) =>
                    updateConnection(c.id, { password: e.target.value })
                  }
                />
              </Row>
              <Row>
                <TextInput
                  value={c.database}
                  placeholder="main"
                  label="Database"
                  onChange={(e) =>
                    updateConnection(c.id, { database: e.target.value })
                  }
                />
                <Space w={10} />
                <Select
                  data={["Postgres"]}
                  label="Type"
                  value={c.type}
                  onChange={(value) =>
                    updateConnection(c.id, { type: value ?? (null as any) })
                  }
                  iconWidth={0}
                  style={{ width: 180 }}
                />
              </Row>
              <Group position="apart" mt={10}>
                <Group>
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => handleDelete(c.id)}
                    color="dark"
                  >
                    Delete
                  </Button>
                </Group>
              </Group>
            </Accordion.Item>
          ))}
      </Accordion>
    </Modal>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export default ConnectionsModal;
