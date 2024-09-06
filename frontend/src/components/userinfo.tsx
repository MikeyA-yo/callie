import { useEffect, useState } from "react"
import { GetUser } from "../../wailsjs/go/main/App";

export function UserIntro(){
    const [user, setUser] = useState<string>("");
    const [userOb, setUserOb] = useState<any>()
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
          {!user && 
          <div>
            Hey World, not you, cuz no account
          </div>
            }
        </>
    )
}