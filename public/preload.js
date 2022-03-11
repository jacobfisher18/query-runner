const { Client } = require("pg");
const { contextBridge } = require("electron");
const Store = require("electron-store");

const store = new Store();

// Cache consisting of a map from id to Client object
const clients = {};

function addClient(options) {
  const client = new Client({
    user: options.user,
    password: options.password,
    port: options.port,
    host: options.host,
    database: options.database,
  });
  clients[options.id] = client;
  return client;
}

contextBridge.exposeInMainWorld("electron", {
  async connectClient(options) {
    const client = clients[options.id] || addClient(options);
    try {
      await client.connect();
    } catch (err) {
      /**
       * When an error occurs, the client is actually unable to try connecting
       * again, because it retains some state thinking it's already connected.
       * So we can delete the connection to allow future retries.
       */
      delete clients[options.id];
      throw err;
    }
  },
  async disconnectClient(id) {
    const client = clients[id];
    if (!client) {
      throw new Error("Cannot disconnect client that does not exist");
    }
    await client.end();
    delete clients[id];
  },
  async queryClient(id, query) {
    const client = clients[id];
    if (!client) {
      throw new Error("Cannot query client that does not exist");
    }
    const result = await client.query(query);
    console.log("query result", result);
    return result;
  },
  getStore(key) {
    return store.get(key);
  },
  setStore(key, data) {
    store.set(key, data);
  },
  deleteStore(key) {
    store.delete(key);
  },
});
