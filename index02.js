import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import {pool,login,register,addblog,deleteblog,getblogs,getblogid} from './database.js'
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app=express();
const port=3000;
var username="";
var password="";  
var blogs = [];
var blog_id="";
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index04.html");
});

app.get("/reg",(req,res)=>{
    return res.sendFile(__dirname+"/public/index08.html");
})

app.get("/blog-finder",(req,res)=>{
    res.sendFile(__dirname+"/public/index01.html");
});

app.get("/home",(req,res)=>{
    res.sendFile(__dirname+"/public/index01.html");
});

app.get("/authors",(req,res)=>{
    res.sendFile(__dirname+"/public/index02.html");
}); 

app.get("/pricing",(req,res)=>{
    res.sendFile(__dirname+"/public/index03.html");
});

function confirmation(req, res, next) {
    password = req.body["password"];
    username = req.body["username"];
    console.log(password);
    console.log(username);
    next();
}
app.use(confirmation);

app.post("/check", confirmation, async (req, res) => {

    const result = await login(username,password)

    if (result) {
        res.sendFile(__dirname + "/public/index01.html");
    } else {
        res.sendFile(__dirname+"/public/index04.html");
    }

});

app.post("/checkreg", confirmation, async (req, res) => {

    await register(username,password)

    res.sendFile(__dirname + "/public/index01.html");

});

app.get("/upgrade",(req,res)=>{
    res.redirect("/home");
});

app.get("/new",(req,res)=>{
    res.sendFile(__dirname+"/public/index05.html");
});

// Route to handle new blog submissions
app.post("/submit", async (req, res) => {
    const newBlog = {
        id: req.body.blogid,
        name: req.body.blogName,
        content: req.body.blogContent,
        link:req.body.link,
        author: req.body.authorName
    };

    await addblog(newBlog)
    blogs.push(newBlog);
    res.redirect("/blogs");
});

// Route to display all blogs
app.get("/blogs", (req, res) => {
    res.render("displayBlogs", { blogs });
});

app.get("/modify",(req,res)=>{
    res.sendFile(__dirname+"/public/index06.html");
});

app.post("/update", (req, res) => {
    const blog_id = req.body.blogid;
    const modified_blog = {
        id: blog_id,
        name: req.body.blogName,
        content: req.body.blogContent,
        author: req.body.authorName,
    };
    console.log(blogs[blog_id]);
    const index = blogs.findIndex(blog => blog.id == blog_id);
    if (index !== -1) {
        blogs[index] = modified_blog;
    }
    res.redirect("/blogs");
});

app.get("/deleteRequest",(req,res)=>{
    res.sendFile(__dirname+"/public/index07.html");
});

app.post("/delete",async (req,res)=>{
    blog_id=req.body.blogid;
    await deleteblog(blog_id)
    blogs = blogs.filter(blog => blog.id != blog_id);
    res.redirect("/blogs");
});

app.get("/back",(req,res)=>{
    res.sendFile(__dirname+"/public/index01.html");
});

app.get("/search",async(req,res)=>{
    const blogs=await getblogs()
    console.log(blogs)
    res.render('searchBlogs',{blogs:blogs});
});

app.post("/searchResults",async(req,res)=>{

    const blog=await getblogid(req.body.blogid)
    console.log(blog)

    res.render("displayBlogs", { blogs:blog});
})

app.listen(port,async () => {

    // check if the database is connected
    try {
        await pool.query('SELECT 1 + 1 AS solution');
        console.log('Database is connected');
    } catch (error) {
        console.log('Database is not connected');
    }

    console.log(`The server is listening at port ${port}`);
});
