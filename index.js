const express = require("express");

const app = express();
const port = 3000;
let posts = [];  

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs')
app.engine('ejs', require('ejs').__express);
app.set('views', __dirname + '/views')

app.get("/", (req, res) => {
    return res.status(200).render("index.ejs", {posts: posts});
});

app.get("/create", (req, res) => {
    return res.status(200).render("create.ejs");
});

app.post("/save", (req, res) => {
    const id = posts.length;
    const title = req.body.title;
    const desc = req.body.desc;
    if (!title || !desc) {
        return res.status(400).send("Please fill in all fields");
    } 

    const post = {id, title, desc};
    posts.push(post);
    return res.status(201).redirect("/");
});

app.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    const post = posts.filter((n) => n.id == id)[0];
    if(post){
        return res.status(200).render("update.ejs", {post: post});
    }
        
    return res.status(404).send("Blog not found!");
})

app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const desc = req.body.desc;
    if(!title || !desc){
        return res.status(400).send("Please fill in all fields");
    }
    const index = posts.findIndex((n) => n.id == id);
    if (index !== -1){
        posts[index] = {
            ...posts[index],
            title,
            desc
        }
        return res.status(200).redirect("/");
    } 

    return res.status(404).send("Blog not found!");
});

app.get("/delete/:id", (req, res) => {
    const id = req.params.id;
    const index = posts.findIndex((n) => n.id == id);
    if (index !== -1){
        posts.splice(index, 1);
        return res.status(200).redirect("/");
    } 

    return res.status(404).send("Blog not found!");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});