require("dotenv").config({path:".env"})
const
    express = require("express"),
    fetch = require("node-fetch"),
    app = express(),
    http = require("http").Server(app),
    ejs = require("ejs"),
    gql = require("graphql-tag"),
    io = require("socket.io")(http),
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

http.listen(port,()=>{
    console.log(
        `App listening to port: ${port}`
    )
})

io.on("connection",(socket)=>{
    console.log("Connected")
    socket.emit("connection",{"msg":"You've been connected"})
    socket.on("disconnect",()=>{
        console.log("Disconnected")
    })
})