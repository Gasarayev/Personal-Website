require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const engine = require("ejs-mate");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = socketIo(server);
require("./click-game")(io);

// Middleware and Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Multer konfiqurasiyası
const uploadDirectory = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Function to read blog data from a JSON file
function getBlogs() {
  const dataPath = path.join(__dirname, "db.json");
  const data = fs.readFileSync(dataPath);
  const jsonData = JSON.parse(data);
  return jsonData.blogs;
}

function formatTitleForUrl(title) {
  if (!title) return "";
  return title

    .toLowerCase()
    .replace(/[ş]/g, "s")
    .replace(/[ə]/g, "e")
    .replace(/[ı]/g, "i")
    .replace(/[ğ]/g, "g")
    .replace(/[ü]/g, "u")
    .replace(/[ö]/g, "o")
    .replace(/[ç]/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/--+/g, "-")
    .trim("-");
}

// Routes
// Homepage Route
app.get("/", (req, res) => {
  const canonicalUrl = "http://localhost:3000";
  res.render("index", {
    title: "Emil Gasarayev, Frontend Developer (Javascript, React, SEO)",
    metaDescription:
      "Emil Gasarayev, Frontend Developer olaraq JavaScript, React texnologiyalarında peşəkardır. Code Academy-də 'Advance Frontend Programming' kursunu bitirib. (SEO)",
    metaKeywords: "Emil Gasarayev, Frontend Developer, Javascript, React, SEO",
    canonicalUrl,
  });
});

// Portfolio Route
app.get("/portfolio", (req, res) => {
  const canonicalUrl = "http://localhost:3000/portfolio";
  res.render("portfolio", {
    title: "Portfolio - Emil Gasarayev",
    metaDescription:
      "Emil Gasarayev, SEO mütəxəssisi və Frontend Developer. 2 illik təcrübəm nəticəsində iştirak etdiyim Frontend və SEO sahələrindəki layihələrimi təqdim edirəm.",
    metaKeywords: "Portfolio, Emil Gasarayev",
    canonicalUrl,
  });
});

// Contact Route
app.get("/contact", (req, res) => {
  const canonicalUrl = "http://localhost:3000/contact";
  res.render("contact", {
    title: "Contact - Emil Gasarayev",
    metaDescription:
      "Emil Gasarayev ilə əlaqə qurmaq üçün ətraflı məlumat və əlaqə forması. SEO və Frontend Development xidmətləri haqqında sorğularınızı göndərin.",
    metaKeywords: "Contact, Emil Gasarayev",
    canonicalUrl,
  });
});

// Click Game Route
app.get("/click-game", (req, res) => {
  const canonicalUrl = "http://localhost:3000/click-game";
  res.render("click-game", {
    title: "Click Game - Emil Gasarayev",
    metaDescription: "Sadə klik oyunu - klik etdikcə skoru artırın.",
    metaKeywords: "Click Game, Oyun",
    canonicalUrl,
    showFooter: false
  });
});

// Hangman Game Route
app.get("/hangman", (req, res) => {
  const canonicalUrl = "http://localhost:3000/hangman";
  res.render("hangman", {
    title: "Hangman Game - Emil Gasarayev",
    metaDescription: "Play Hangman Game and guess the hidden word!",
    metaKeywords: "Hangman, Game, Word Guess",
    canonicalUrl,
    showFooter: false
  });

  
});

// Blog List Route
app.get("/blog", (req, res) => {
  const canonicalUrl = "http://localhost:3000/blog";
  const blogs = getBlogs();
  res.render("blog", {
    title: "Blog - Emil Gasarayev",
    metaDescription: "Emil Gasarayev tərəfindən yazılmış blog yazıları",
    metaKeywords: "Blog, Emil Gasarayev, Yazılar",
    blogs,
    canonicalUrl,
  });
});

// Blog Details Route
app.get("/blog/:title", (req, res) => {
  const canonicalUrl = `http://localhost:3000/blog/${req.params.title}`;
  const blogs = getBlogs();
  const blog = blogs.find((b) => b.formattedTitle === req.params.title);

  if (blog) {
    const shortMetaDescription = blog.metaDescription.substring(0, 160);
    res.render("blog-details", {
      title: blog.title,
      content: blog.content,
      subtitles: blog.subtitles,
      image1: blog.image1,
      metaDescription: shortMetaDescription,
      youtube_link: blog.youtube_link,
      faq: blog.faq,
      canonicalUrl,
      metaKeywords: "Blog, Emil Gasarayev, Yazılar",
    });
  } else {
    res.status(404).render("404", {
      title: "404 - Blog Tapılmadı",
      metaDescription: "Axtardığınız blog tapılmadı.",
      metaKeywords: "404, blog tapılmadı",
    });
  }
});

// Admin Login Route
app.get("/admin/login", (req, res) => {
  res.render("admin-login", {
    title: "Admin Giriş",
    canonicalUrl: "http://localhost:3000/admin/login",
  });
});

// Admin Login Validation Route
app.post("/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.redirect("/admin");
  } else {
    res.render("admin-login", {
      title: "Admin Giriş",
      canonicalUrl: "http://localhost:3000/admin/login",
      errorMessage: "Yanlış şifrə, yenidən cəhd edin.",
    });
  }
});

// Admin Panel (Private Route)
app.get("/admin", (req, res) => {
  if (req.session.isAdmin) {
    res.render("admin-panel", {
      title: "Admin Paneli",
      canonicalUrl: "http://localhost:3000/admin",
    });
  } else {
    res.redirect("/admin/login");
  }
});

// Blog Creation Route for Admin
app.post("/admin/blog/create", upload.single("image1"), (req, res) => {
  const {
    title,
    content,
    subtitle,
    content_subtitle,
    faq,
    youtube_link,
    meta_description,
  } = req.body;
  const image = req.file ? req.file.filename : null;

  const formattedTitle = formatTitleForUrl(title);

  const newBlog = {
    id: Date.now(),
    title,
    formattedTitle,
    metaDescription: meta_description,
    content,
    image1: image,
    youtube_link,
    subtitles: subtitle.map((sub, index) => ({
      subtitle: sub,
      content: content_subtitle[index],
    })),
    faq: faq.question.map((question, index) => ({
      question,
      answer: faq.answer[index],
    })),
  };

  const blogs = getBlogs();
  blogs.push(newBlog);

  const dataPath = path.join(__dirname, "db.json");
  fs.writeFileSync(dataPath, JSON.stringify({ blogs }, null, 2));

  res.redirect("/admin");
});

// 404 Error Route
app.use((req, res) => {
  res.status(404).render("404", {
    title: "404 - Səhifə Tapılmadı",
    metaDescription: "404 səhifəsi tapılmadı.",
    metaKeywords: "404, səhifə tapılmadı",
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
