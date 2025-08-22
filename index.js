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
async function getRecordById(id) {
  const records = (await db.query("SELECT * FROM record")).rows;
  const record = records.find((record) => record.id === id);
  return record;
}

app.use(e.static("public"));

app.get("/", async (req, res) => {
  const records = await getRecords();
  res.render("index.ejs", {
    records: records,
  });
});

app.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const record = await getRecordById(id);
  console.log(record);

  console.log(id);
  if (record) res.render("book.ejs", { record: record });
  else res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
