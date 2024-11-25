const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;
const engine = require("ejs-mate"); // Импортируем ejs-mate


// Укажите, что будем использовать EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Укажите папку для статических файлов (CSS, JS, изображения)
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", engine);

// Маршруты
app.get("/", (req, res) => {
    try {
      res.render("index");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error rendering the page");
    }
  });

app.get("/contact", (req, res) => {
  res.render("contact"); // Использует views/contact.ejs
});

app.get("/portfolio", (req, res) => {
  res.render("portfolio"); // Использует views/portfolio.ejs
});

app.get("/blog", (req, res) => {
  const blogs = [
    { id: 1, title: "First Blog", content: "Content of the first blog." },
    { id: 2, title: "Second Blog", content: "Content of the second blog." },
  ];
  res.render("blog", { blogs }); // Передаем данные в шаблон
});

app.get("/blog/:id", (req, res) => {
  const blogs = [
    { id: 1, title: "First Blog", content: "Content of the first blog." },
    { id: 2, title: "Second Blog", content: "Content of the second blog." },
  ];
  const blog = blogs.find((b) => b.id === parseInt(req.params.id));
  if (!blog) {
    return res.status(404).send("Blog not found");
  }
  res.render("blog-detail", { blog }); // Передаем данные блога
});

// Middleware для обработки 404
app.use((req, res) => {
  res.status(404).render("404"); // Создайте views/404.ejs
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
