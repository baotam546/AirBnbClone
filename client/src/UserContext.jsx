import axios from "axios";
import { useState,createContext, useEffect } from "react"

export const userContext = createContext({});

export function UserContextProvider({children}){
    const [user, setUser] = useState(null);
    useEffect(() =>{
        if(!user){
            axios.get('/profile').then(({data}) =>{
                setUser(data);
            });
            
        }
    }
    ,[])
    return(
        <userContext.Provider value={{user, setUser}}>
            {children}
        </userContext.Provider>
    )
}