require("dotenv").config({path:".env"})
const
    express = require("express"),
    fetch = require("node-fetch"),
    app = express(),
    ejs = require("ejs"),
    gql = require("graphql-tag"),
    port = process.env.PORT || 3001

// App settings
app.set("view engine", "ejs")

app.use(express.static("src"));

// Routing
app.get("/",(req,res)=>{
    res.render("pages/home",{title:"Home"})
})

app.get("/auth/linkedin",(req,res)=>{
    res.render(res)
})

app.listen(port,()=>{
    console.log(
        `App listening to port: ${port}`
    )
})