import axios from "axios";
import { useState,createContext, useEffect } from "react"

export const userContext = createContext({});

export function UserContextProvider({children}){
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    useEffect(() =>{
        if(!user || user===undefined){
            axios.get('/profile').then((res) =>{
                setUser(res.data['user']);
                setReady(true);
            });
            
        }
    }
    ,[])
    return(
        <userContext.Provider value={{user, setUser,ready, setReady}}>
            {children}
        </userContext.Provider>
    )
}