(()=>{
    const app = {
        init:async()=>{
            let
                advertisers = await app.req("graphql",{
                    method:"POST",
                    headers:{
                        "content-type":"application/json",
                    },
                    body:JSON.stringify({
                        "operationName": null, "variables": {
                            "fixedIP": null,
                            "fixedPath": "/constructeur"
                        }, 
                        "query": "query ($fixedIP: String, $fixedPath: String, $regionProvince: String) {\n  pickAdvertisement(fixedIP: $fixedIP, fixedPath: $fixedPath, regionProvince: $regionProvince) {\n    id\n    companies {\n      id\n      name\n      advertisedLocation\n      logo {\n        id\n        url\n        __typename\n      }\n      __typename\n    }\n    copy {\n      header\n      subHeader\n      profileLabel\n      actionButton\n      footer\n      footerButton\n      profileAvatar {\n        id\n        url\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
                        })
                    })
            
            app.render.adv(advertisers)
        },
        req:(endpoint,req)=>{
            return fetch(`http://localhost:5000/${endpoint}`,req).then(res => res.json())  
        },
        handleData:(data)=>{
            console.log(data)
        },
        startChat:async(id)=>{
            let
                tokenData = await app.req("graphql",{
                    method:"POST",
                    headers:{
                        "content-type":"application/json",
                    },
                    body:JSON.stringify({
                        "query":`mutation ($advertisementId: Int, $companyId: Int) {
                            startChat(advertisementId: $advertisementId, companyId: $companyId) {
                              session {
                                token
                                expiresAt
                                __typename
                              }
                              __typename
                            }
                          }`,
                        "variables":{"companyId":id,"advertisementId":5}
                    })
                })

            // Store that fresh session token
            localStorage.setItem("fresh-token",tokenData.data.startChat.session.token)
            
            // Who needs Socket.IO?
            let
                socket = new WebSocket("ws://localhost:5000/subscriptions","graphql-ws")
            socket.onmessage = (e)=>{
                let
                    data = JSON.parse(e.data)
                switch(data.type){
                    case "data":
                        app.render.chatMessage(data)
                    break;
                    default:
                        console.log(e.data)
                    break;
                }
            }
            socket.onerror = (err)=>{
                console.log(err)
            }
            socket.onopen = await async function(event) {
                let
                    agencyData = await app.req("graphql",{
                        method:"POST",
                        headers:{
                            "content-type":"application/json",
                            "Authorization":`Bearer ${localStorage.getItem("fresh-token")}`
                        },
                        body:JSON.stringify({
                            "operationName":"getAgency",
                            "query":`query getAgency {
                                agency {
                                  id
                                  name
                                  textHeader
                                  textSub
                                  isAgencyOnline
                                  __typename
                                }
                              }`
                        })
                    }),
                    messages = await app.req("graphql",{
                        method:"POST",
                        headers:{
                            "content-type":"application/json",
                            "Authorization":`Bearer ${localStorage.getItem("fresh-token")}`
                        },
                        body:JSON.stringify({
                            "operationName":"getMessages",
                            "query":`query getMessages($take: Int, $sort: MessagesSortingInputType, $skip: Int) {
                                chat {
                                  id
                                  lastModerator {
                                    id
                                    person {
                                      id
                                      fullName
                                      __typename
                                    }
                                    __typename
                                  }
                                  messages(sort: $sort, take: $take, skip: $skip) {
                                    nodes {
                                      ...message
                                      __typename
                                    }
                                    count
                                    totalCount
                                    page
                                    totalPages
                                    hasNextPage
                                    __typename
                                  }
                                  __typename
                                }
                              }
                              
                              fragment message on MessageType {
                                id
                                type
                                text
                                senderRole
                                senderPerson {
                                  id
                                  fullName
                                  picture {
                                    id
                                    url
                                    __typename
                                  }
                                  __typename
                                }
                                createdAt
                                type
                                companies {
                                  id
                                  name
                                  logo {
                                    id
                                    url
                                    __typename
                                  }
                                  __typename
                                }
                                acceptedCompanies {
                                  id
                                  __typename
                                }
                                startMessageAnswered
                                privacyAnswered
                                companiesAnswered
                                privacyUrl
                                attachments {
                                  id
                                  originalFilename
                                  url
                                  fileSize
                                  fileType
                                  __typename
                                }
                                __typename
                              }`,
                              "variables": {
                                  skip: 0,
                                  sort: {
                                      createdAt: "DESC"
                                  },
                                  take: 20
                              }
                        })
                    })
                app.render.chatWidget(agencyData,messages)
                console.log("connected")
                socket.send(JSON.stringify({type: "connection_init", payload: {}}))
                socket.send(JSON.stringify({
                    "id": "1",
                    "type": "start",
                    "payload": {
                        "variables": {},
                        "extensions": {},
                        "operationName": "newMessage",
                        "query": "subscription newMessage {\n  message {\n    ...message\n    __typename\n  }\n}\n\nfragment message on MessageType {\n  id\n  type\n  text\n  senderRole\n  senderPerson {\n    id\n    fullName\n    picture {\n      id\n      url\n      __typename\n    }\n    __typename\n  }\n  createdAt\n  type\n  companies {\n    id\n    name\n    logo {\n      id\n      url\n      __typename\n    }\n    __typename\n  }\n  acceptedCompanies {\n    id\n    __typename\n  }\n  startMessageAnswered\n  privacyAnswered\n  companiesAnswered\n  privacyUrl\n  attachments {\n    id\n    originalFilename\n    url\n    fileSize\n    fileType\n    __typename\n  }\n  __typename\n}\n",
                        "token": `Bearer ${localStorage.getItem("fresh-token")}`
                    }
                }))
                socket.send(JSON.stringify({
                    "id": "2",
                    "type": "start",
                    "payload": {
                        "variables": {
                            "agencyId": id
                        },
                        "extensions": {},
                        "operationName": "isAgencyOnline",
                        "query": "subscription isAgencyOnline($agencyId: Int) {\n  isAgencyOnline(agencyId: $agencyId)\n}\n",
                        "token": `Bearer ${localStorage.getItem("fresh-token")}`
                    }
                }))
            }
            
        },
        render:{
            adv:(data)=>{
                let
                    x = data.data.pickAdvertisement,
                    newUl = document.createElement("ul")
            
                newUl.classList.add("list-company")
                
                document.querySelector("span").innerHTML =  ""

                x.companies.forEach(obj => {
                    let
                        newH1 = document.createElement("h1"),
                        newSpan = document.createElement("span"),
                        newLi = document.createElement("li"),
                        newButton = document.createElement("button"),
                        intermediar = ["Tony","Chris","Bruce","Natasha","Rocket","Thor","Quill"]

                    newButton.innerHTML = `
                        Intressant?<br>
                        <span>Praat met ${intermediar[Math.floor(Math.random()*intermediar.length)]} ></span>
                    `

                    newButton.addEventListener("click",()=>{
                        let
                            adv = Number(newButton.parentElement.getAttribute("data-adv"))
                        app.startChat(adv)
                    })

                    newH1.innerText = obj.name
                    newSpan.innerText = obj.advertisedLocation

                    newLi.appendChild(newH1)
                    newLi.appendChild(newSpan)
                    newLi.appendChild(newButton)

                    newLi.setAttribute("data-adv",obj.id)

                    newUl.appendChild(newLi)
                })

                document.querySelector("#app").appendChild(newUl)
            },
            chatMessage:(data)=>{
                let
                    msg = data.payload.data.message,
                    renderMsg = ()=>{
                        const
                            chatBody = document.querySelector(".fresh-chat_body ol"),
                            newLi = document.createElement("li"),
                            newP = document.createElement("p"),
                            newMsg = document.createElement("span"),
                            newTime = document.createElement("span"),
                            time = new Date(msg.createdAt)

                        newLi.setAttribute("data-msgID",msg.id)
                        
                        newMsg.classList.add("fresh-message")
                        newMsg.innerHTML = msg.text
                        newTime.classList.add("fresh-message")
                        newTime.innerHTML = `${time.getHours()}:${time.getMinutes()}`
                        
                        if(msg.senderRole === "candidate"){
                            newP.classList.add("candidate")
                            newLi.classList.add("candidate")
                        }

                        newP.appendChild(newMsg)
                        newP.appendChild(newTime)
                        newLi.appendChild(newP)
                        chatBody.appendChild(newLi)
                    }
                if(document.querySelector("[data-msgID]:last-of-type") == null){
                    renderMsg()
                }else if(document.querySelector("[data-msgID]:last-of-type").getAttribute("data-msgID") < msg.id){
                    renderMsg()
                }


            },
            chatWidget:(agencyData,messagesData)=>{
                const
                    newCont = document.createElement("div"),
                    newHeader = document.createElement("header"),
                    newH1 = document.createElement("h1"),
                    newH2 = document.createElement("h2"),
                    newBody = document.createElement("div"),
                    newOl = document.createElement("ol"),
                    newForm = document.createElement("form"),
                    newInput = document.createElement("input"),
                    newButton = document.createElement("input"),
                    newLnkdn = document.createElement("div")
                let
                    agency = agencyData.data.agency,
                    messages = messagesData.data.chat

                newCont.classList.add("fresh-chat")

                newHeader.classList.add("fresh-chat_header")
                newH1.innerHTML = messages.lastModerator.person.fullName
                newH2.innerHTML = agency.name

                newHeader.appendChild(newH1)
                newHeader.appendChild(newH2)  
                newCont.appendChild(newHeader)

                newBody.classList.add("fresh-chat_body")

                newBody.appendChild(newOl)
                newCont.appendChild(newBody)

                newForm.classList.add("fresh-chat_input")
                newInput.setAttribute("type","text")
                newInput.setAttribute("placeholder","Type a message")
                newButton.setAttribute("type","submit")
                newButton.setAttribute("value","submit")
                
                newForm.addEventListener("submit",(e)=>{
                    e.preventDefault()
                    let 
                        msg = newForm.querySelector("input[type='text']").value
                    if(msg.length >0){
                        app.req("graphql",{
                            method:"POST",
                            headers:{
                                "content-type":"application/json",
                                "Authorization":`Bearer ${localStorage.getItem("fresh-token")}`
                            },
                            body:JSON.stringify({
                                "query":`mutation ($message: AddMessageInputType) {
                                    addMessage(message: $message) {
                                        success
                                        __typename
                                    }
                                }`,
                                "variables":{"message":{"text":msg}}
                            })
                        }).then(()=>{
                            newForm.querySelector("input[type='text']").value = ""
                            newLnkdn.classList.add("active")
                            newCont.classList.add("active")
                        })
                    }
                })

                newForm.appendChild(newInput)
                newForm.appendChild(newButton)
                newCont.appendChild(newForm)

                newLnkdn.classList.add("fresh-chat_linkedin")
                newLnkdn.innerHTML = `
                    <header>
                        LinkedIn: Werkgever
                    </header>
                    <div class="linkedin-body">
                        <h1>Who are we?</h1>
                        <div class="text">Lorem ipsum</div>
                        <div class="text">Lorem ipsum</div>
                        <h1>What do we offer?</h1>
                        <div class="text">Lorem ipsum</div>
                        <div class="text">Lorem ipsum</div>
                    </div>
                `

                newCont.appendChild(newLnkdn)

                document.querySelector("#app").appendChild(newCont)
            }
        }
    }
        
    app.init()
})()