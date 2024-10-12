import express from "express";
import bodyParser from "body-parser";
import fs from "fs"

const app = express();
const port = 3000;
let loggedIn = false;
let blogList = [
    { id: 0, title: "Introduction to the Blog.", content: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis rutrum nisi, id imperdiet odio egestas ac. Mauris sed arcu nec turpis vehicula bibendum. Etiam vitae lorem elit. Maecenas vitae ante aliquet, malesuada lacus eget, consectetur ex. Duis mattis blandit nisl, nec egestas lacus dictum eu."], createTime: new Date() },
    { id: 1, title: "First blog!", content: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis rutrum nisi, id imperdiet odio egestas ac. Mauris sed arcu nec turpis vehicula bibendum. Etiam vitae lorem elit. Maecenas vitae ante aliquet, malesuada lacus eget, consectetur ex. Duis mattis blandit nisl, nec egestas lacus dictum eu."], createTime: new Date() },
    { id: 2, title: "Second post.", content: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis rutrum nisi, id imperdiet odio egestas ac. Mauris sed arcu nec turpis vehicula bibendum. Etiam vitae lorem elit. Maecenas vitae ante aliquet, malesuada lacus eget, consectetur ex. Duis mattis blandit nisl, nec egestas lacus dictum eu."], createTime: new Date() }
];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

/*======== HOME PAGE - BLOG LIST ========*/
app.get("/", (req, res) => {
    res.render("index.ejs", { blogList });
})


/*======== POST VIEW ========*/
app.get("/post/:id", (req, res) => {
    const post = {
        id: req.params.id,
        title: blogList[req.params.id].title,
        content: blogList[req.params.id].content,
        createTime: blogList[req.params.id].createTime
    }

    if (post) res.render("post.ejs", { post, loggedIn });
    else res.status(404);
})

/*======== CREATE POST ========*/
app.get("/create", (req, res) => {
    if (!loggedIn) {
        res.render("log-in.ejs");
    } else res.render("create.ejs");
})


app.post("/submit", (req, res) => {
    console.log(req.body.content);
    blogList.push({
        id: blogList.length,
        title: req.body["title"],
        content: req.body["content"].split("\n"),
        createTime: new Date()
    });

    res.render("index.ejs", { blogList });
})

/*======== EDIT & DELETE ========*/
app.post("/manage", (req, res) => {
    if (req.body.username === "admin" && req.body.password === "Admin01*") {
        loggedIn = true;
        res.render("manage.ejs", { blogList });
    }
    else res.render("log-in.ejs");
})

app.get("/manage", (req, res) => {
    if (!loggedIn) {
        res.render("log-in.ejs");
    } else res.render("manage.ejs", { blogList });
    
})

//Edit Post
app.get("/edit/:id", (req, res) => {
    const editingPost = {
        id: blogList[req.params.id].id,
        title: blogList[req.params.id].title,
        content: blogList[req.params.id].content,
    }
    if (editingPost) {
        res.render("edit.ejs", { editingPost });
    } else res.status(404);
})

app.post("/submit-change/:id", (req, res) => {
    blogList[req.params.id].title = req.body.title;
    blogList[req.params.id].content = req.body.content.split("\n");

    const post = blogList[req.params.id];
    res.render("post.ejs", { post });
})

//Remove Post
app.get("/remove/:id", (req, res) => {
    console.log(blogList[req.params.id]);
    if (blogList[req.params.id]) {
        blogList.splice(req.params.id, 1);
        console.log("Blog removed successfully!");
        res.render("index.ejs", { blogList });
    } else {
        res.status(404);
    }
})

/*======== ABOUT PAGE ========*/
app.get("/about", (req, res) => {
    res.render("about.ejs");
})

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server running on port ${port}.`)
})


/*======== FUNCTIONS ========*/



/* [REMOVED] MIDDLEWARE FUNCTIONS USED INSIDE HANDLERS

function createPostFile(id, title, content) {
    const fileContent =
        `<%- include("../partials/header.ejs") %>
        <h1>${title}</h1>
        <p>${content}</p>
        <%- include("../partials/footer.ejs") %>`

    fs.writeFile(`views/post/post${id}.ejs`, fileContent, err => {
        if (err) {
          console.error(err);
        } else {
          console.log(`post${id} written successfully.`);
        }
      });
}

*/