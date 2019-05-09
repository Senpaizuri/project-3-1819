(()=>{
    const app = {
        init:async()=>{
            let
                advertisers = await app.getAdvertisers()
            
            app.render.adv(advertisers)
        },
        getAdvertisers:()=>{
            return fetch("http://localhost:5000/graphql",{
                method:"POST",
                headers:{
                    "content-type":"application/json",
                    "Access-Control-Allow-Origin":"*"
                },
                body:JSON.stringify({
                    "operationName": null, "variables": {
                        "fixedIP": null,
                        "fixedPath": "/constructeur"
                    }, 
                    "query": "query ($fixedIP: String, $fixedPath: String, $regionProvince: String) {\n  pickAdvertisement(fixedIP: $fixedIP, fixedPath: $fixedPath, regionProvince: $regionProvince) {\n    id\n    companies {\n      id\n      name\n      advertisedLocation\n      logo {\n        id\n        url\n        __typename\n      }\n      __typename\n    }\n    copy {\n      header\n      subHeader\n      profileLabel\n      actionButton\n      footer\n      footerButton\n      profileAvatar {\n        id\n        url\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
                    })
                }).then(res => res.json())
                
        },
        getChat:()=>{
            let query =`mutation ($advertisementId: Int, $companyId: Int) {
                startChat(advertisementId: $advertisementId, companyId: $companyId) {
                  session {
                    token
                    expiresAt
                    __typename
                  }
                  __typename
                }
              }`
        },
        handleData:(data)=>{
            console.log(data)
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
                        newLi = document.createElement("li")

                    newH1.innerText = obj.name
                    newSpan.innerText = obj.advertisedLocation

                    newLi.appendChild(newH1)
                    newLi.appendChild(newSpan)

                    newLi.setAttribute("data-adv",obj.id)

                    newUl.appendChild(newLi)

                    newLi.addEventListener("click",(e)=>{
                        console.log(e.target.getAttribute("data-adv"))
                    })
                })

                document.querySelector("#app").appendChild(newUl)
            }
        }
    }
        
    app.init()
})()