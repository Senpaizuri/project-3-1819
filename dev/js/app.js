(()=>{
    const app = {
        init:async()=>{
            console.log(await app.getAdvertisers())
        },
        getAdvertisers:()=>{
            return fetch("http://localhost:5000/graphql",{
                method:"POST",
                headers:{
                    "content-type":"application/json"
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
        }
    }
        
    app.init()
})()