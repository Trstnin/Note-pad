const { error } = require("console");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
console.log(PORT)

const fs = require("fs");

const path = require("path");

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, file) => {
    res.render("index", { files: file });
  });
});

app.get(`/files/:filename`, (req, res) => {
  fs.readFile(`files/${req.params.filename}`, "utf-8", (err, fileData) => {
    if (err) throw error;
    console.log(fileData);
    res.render("show", { filename: req.params.filename, fileData: fileData });
  });
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.details,
    (err) => {
      if (err) throw error;

      console.log("file is successfully added");
    }
  );

  res.redirect("/");
});

app.delete(`/delete/:filename`, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "files", filename);

  fs.unlink(filePath, (err) => {
    if (err) throw error;

    res.send("file deleted successfully");
  });
});

app.listen(PORT, ()=>{
    console.log(`app is listening at ${PORT}`)
});
