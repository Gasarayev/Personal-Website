const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 3000;
const engine = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);

app.use(express.static(path.join(__dirname, "public")));

function getBlogs() {
  const dataPath = path.join(__dirname, 'db.json');
  const data = fs.readFileSync(dataPath);
  const jsonData = JSON.parse(data);
  return jsonData.blogs;
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/portfolio", (req, res) => {
  res.render("portfolio");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/blog", (req, res) => {
  const blogs = getBlogs();
  res.render("blog", { blogs });
});

app.get("/blog/:id", (req, res) => {
  const blogs = getBlogs();
  const blog = blogs.find((b) => b.id === parseInt(req.params.id));
  if (!blog) {
    return res.status(404).send("Blog not found");
  }
  console.log(blog); 
  res.render("blog-details", { blog });
});

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
