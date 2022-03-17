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
import { Connection } from "../models/connection";
import { useModalsStore } from "../store/modals";
import { isTruthy } from "../utils/nil";
import { FiDatabase } from "react-icons/fi";
import { useState } from "react";
import { useConnections } from "../hooks/useConnections";

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

function AccordionContents({
  c,
  handleDelete,
  handleSave,
}: {
  c: Connection;
  handleDelete: () => void;
  handleSave: (data: Omit<Connection, "id" | "type">) => void;
}) {
  const [name, setName] = useState(c.name);
  const [host, setHost] = useState(c.host);
  const [user, setUser] = useState(c.user);
  const [password, setPassword] = useState(c.password);
  const [port, setPort] = useState(c.port);
  const [database, setDatabase] = useState(c.database);

  return (
    <>
      <TextInput
        value={name}
        placeholder="User Database Prod"
        label="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <Row>
        <TextInput
          value={host}
          placeholder="localhost"
          label="Host"
          onChange={(e) => setHost(e.target.value)}
        />
        <Space w={10} />
        <TextInput
          value={port}
          placeholder="4321"
          label="Port"
          onChange={(e) => setPort(e.target.value)}
        />
      </Row>
      <Row>
        <TextInput
          value={user}
          placeholder="writer_user"
          label="User"
          onChange={(e) => setUser(e.target.value)}
        />
        <Space w={10} />
        <TextInput
          type="password"
          value={password}
          placeholder="******"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Row>
      <Row>
        <TextInput
          value={database}
          placeholder="main"
          label="Database"
          onChange={(e) => setDatabase(e.target.value)}
        />
        <Space w={10} />
        <Select
          data={["Postgres"]}
          label="Type"
          value={c.type}
          disabled
          iconWidth={0}
          style={{ width: 180 }}
        />
      </Row>
      <Group position="apart" mt={10}>
        <Group>
          <Button
            variant="subtle"
            size="xs"
            onClick={handleDelete}
            color="dark"
          >
            Delete
          </Button>
        </Group>
        <Group>
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              setName(c.name);
              setHost(c.host);
              setUser(c.user);
              setPassword(c.password);
              setPort(c.port);
              setDatabase(c.database);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            size="xs"
            onClick={() =>
              handleSave({
                name,
                host,
                user,
                port,
                password,
                database,
              })
            }
          >
            Save
          </Button>
        </Group>
      </Group>
    </>
  );
}

function ConnectionsModal() {
  const { connections, createConnection, saveConnection, deleteConnection } =
    useConnections();

  const {
    isConnectionsModalOpen: isOpen,
    setIsConnectionsModalOpen: setIsOpen,
  } = useModalsStore();

  return (
    <Modal
      opened={isOpen}
      onClose={() => setIsOpen(false)}
      title="Database Connections"
    >
      <Group position="right" mt={20}>
        <Button variant="filled" size="xs" onClick={() => createConnection()}>
          New Connection
        </Button>
      </Group>
      <Divider mt={10} />
      <Accordion iconPosition="right">
        {Object.values(connections ?? {})
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
              <AccordionContents
                c={c}
                handleSave={(data) => saveConnection({ id: c.id, data })}
                handleDelete={() => deleteConnection(c.id)}
              />
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
