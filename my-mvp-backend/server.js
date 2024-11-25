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

  jsonData.blogs.forEach(blog => {
    
    blog.content1 = blog.content1.replace(/frontend proqramlaşdırması/gi, '<a href="/portfolio">frontend proqramlaşdırması</a>');
   
    blog.conclusion = blog.conclusion.replace(/freeCodeCamp/gi, '<a href="https://www.freecodecamp.org/">FreeCodeCamp</a>');
    blog.content4 = blog.content4.replace(/qarşılıqlı əlaqə/gi, '<a href="https://www.linkedin.com/in/emil-gasarayev-b14747223/">qarşılıqlı əlaqə</a>');

  
  });

  return jsonData.blogs;
}

app.get("/", (req, res) => {
  const canonicalUrl = "http://localhost:3000";
  res.render("index", {
    title: "Emil Gasarayev, Frontend Developer (Javascript, React, SEO)",
    metaDescription: "Emil Gasarayev, Frontend Developer olaraq JavaScript, React texnologiyalarında peşəkardır. Code Academy-də 'Advance Frontend Programming' kursunu bitirib. (SEO)",
    metaKeywords: "Emil Gasarayev, Frontend Developer, Javascript, React, SEO",
    canonicalUrl
  });
});

app.get("/portfolio", (req, res) => {
  const canonicalUrl = "http://localhost:3000/portfolio";
  res.render("portfolio", {
    title: "Portfolio - Emil Gasarayev",
    metaDescription: "Emil Gasarayev, SEO mütəxəssisi və Frontend Developer. 2 illik təcrübəm nəticəsində iştirak etdiyim Frontend və SEO sahələrindəki layihələrimi təqdim edirəm.",
    metaKeywords: "Portfolio, Emil Gasarayev",
    canonicalUrl
  });
});

app.get("/contact", (req, res) => {
  const canonicalUrl = "http://localhost:3000/contact";
  res.render("contact", {
    title: "Contact - Emil Gasarayev",
    metaDescription: "Emil Gasarayev ilə əlaqə qurmaq üçün ətraflı məlumat və əlaqə forması. SEO və Frontend Development xidmətləri haqqında sorğularınızı göndərin.",
    metaKeywords: "Contact, Emil Gasarayev",
    canonicalUrl
  });
});

app.get("/blog", (req, res) => {
  const canonicalUrl = "http://localhost:3000/blog";
  const blogs = getBlogs();
  res.render("blog", {
    title: "Blog - Emil Gasarayev",
    metaDescription: "Emil Gasarayev tərəfindən yazılmış blog yazıları",
    metaKeywords: "Blog, Emil Gasarayev, Yazılar",
    blogs,
    canonicalUrl
  });
});

app.get("/blog/:title", (req, res) => {
  const canonicalUrl = `http://localhost:3000/blog/${req.params.title}`;
  const blogs = getBlogs();

  // URL-dəki başlıq ilə uyğun blogu tapırıq
  const blog = blogs.find((b) => 
    b.title.toLowerCase().replace(/\s+/g, '-') === req.params.title.toLowerCase().replace(/\s+/g, '-')
  );

  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  res.render("blog-details", {
    title: blog.title, 
    metaDescription: blog.content.substring(0, 150), 
    metaKeywords: `Blog, ${blog.title}`,
    blog,
    canonicalUrl
  });
});

app.use((req, res) => {
  const canonicalUrl = "http://localhost:3000/404";
  res.status(404).render("404", {
    title: "404 - Page Not Found",
    metaDescription: "404 səhifəsi tapılmadı.",
    metaKeywords: "404, səhifə tapılmadı",
    canonicalUrl
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
