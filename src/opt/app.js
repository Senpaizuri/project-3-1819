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
            console.log(id)
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
            localStorage.setItem("fresh-token",tokenData.data.startChat.session.token)
            let
                socket = new WebSocket("ws://localhost:5000/subscriptions")
            socket.onmessage = (e)=>{
                console.log(e.data)
            }
            socket.onerror = (err)=>{
                console.log(err)
            }
            socket.onopen = function(event) {
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
                
                console.log(x)

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
            }
        }
    }
        
    app.init()
})()