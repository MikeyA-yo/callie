import { useEffect, useState } from "react"
import { EditUser, GetUser } from "../../wailsjs/go/main/App";

export function UserIntro(){
    const [user, setUser] = useState<string>("");
    const [userOb, setUserOb] = useState<any>()
    const [config, setConfig] = useState({
        name:"",
        username:""
    })
    useEffect(()=>{
      async function loadUser(){
        let person = await GetUser();
        setUser(person)
      }
      loadUser()
    }, [])
    useEffect(()=>{
        user.length > 4 && setUserOb(JSON.parse(user))
    }, [user])
    
    return (
        <>
          {!userOb && 
          <div className="flex flex-col items-center w-full gap-1">
            <h1>Hello user, you don't have a name Set-up, let's do that</h1>
             <div className="flex flex-col w-full gap-2 items-center">
                <p>Name: </p>
                <input className="p-2 rounded text-[#3C3D37]" placeholder="Full Name" name="name" id="n" onChange={(e)=>{
                   setConfig(prev => {
                    return {
                        ...prev,
                        [e.target.name]:e.target.value
                    }
                   }) 
                }} />
                <p>Username: </p>
                <input className="p-2 rounded text-[#3C3D37]" placeholder="kinda like your nick name" name="username" id="nn" onChange={(e)=>{
                   setConfig(prev => {
                    return {
                        ...prev,
                        [e.target.name]:e.target.value
                    }
                   }) 
                }} />
                <button className="p-2 bg-[#3C3D37] rounded" onClick={()=>{
                    EditUser(JSON.stringify(config))
                    setUserOb(config);
                    if (document.getElementById("n") && document.getElementById("nn") ){
                        let n = document.getElementById("n") as HTMLInputElement;
                        let nn = document.getElementById("nn") as HTMLInputElement
                        n.value = ""
                        nn.value = ""
                    }
                    // document.getElementById("n") && document.getElementById("nn") && document.getElementById("n").value
                }}>Save</button>
             </div>
          </div>
            }
            {userOb &&
            <div>
                Hey {userOb.name}
            </div>

            }
        </>
    )
}