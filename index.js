import e from "express";
import PG from "pg";
import fs from "fs";

const app = e();
const port = 3000;

// Reads db-config.json and creates pg.client()
const dbConfig = JSON.parse(fs.readFileSync("db-config.json", "utf8"));
const db = new PG.Client(dbConfig);
db.connect();
console.log((await db.query("SELECT * FROM record")).rows);

async function getRecords() {
  const records = (await db.query("SELECT * FROM record")).rows;
  return records;
}

app.use(e.static("public"));

app.get("/", async (req, res) => {
  const records = await getRecords();
  res.render("index.ejs", { records: records });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
