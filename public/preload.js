const { Client } = require("pg");
const { contextBridge } = require("electron");

const client = new Client({
  user: "postgres",
  password: "somePassword",
  port: 5432,
  host: "localhost",
});

process.once("loaded", async () => {
  try {
    await client.connect();
    console.log("connected db client");
  } catch (err) {
    console.error("could not connect db client", { err });
  }
});

contextBridge.exposeInMainWorld("electron", {
  async queryDatabase(query) {
    try {
      const result = await client.query(query);
      console.log("db query completed");
      return [result, undefined];
    } catch (err) {
      console.info("db query errored");
      return [undefined, err.message];
    }
  },
});
