import e from "express";
import PG from "pg";
import fs from "fs";
import bodyParser from "body-parser";

const app = e();
const port = 3000;

// Reads db-config.json and creates pg.client()
const dbConfig = JSON.parse(fs.readFileSync("db-config.json", "utf8"));
const db = new PG.Client(dbConfig);
db.connect();

async function getRecords() {
  const records = (await db.query("SELECT * FROM record")).rows;
  return records;
}
async function getRecordById(id) {
  const records = (await db.query("SELECT * FROM record")).rows;
  const record = records.find((record) => record.id === id);
  return record;
}
async function findRecordsByTitle(title) {
  const records = (
    await db.query(
      "SELECT * FROM public.record WHERE LOWER(title) LIKE '%' || $1 || '%'",
      [title]
    )
  ).rows;
  return records;
}

app.use(bodyParser.urlencoded({ extended: true }));
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

  if (record) res.render("book.ejs", { record: record });
  else res.sendStatus(404);
});

app.post("/search", async (req, res) => {
  const searchQuery = req.body.query;
  const records = await findRecordsByTitle(searchQuery);

  res.render("index.ejs", { records: records });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
