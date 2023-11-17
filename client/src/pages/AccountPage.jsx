import React, { useContext } from 'react'
import { userContext } from '../UserContext';
import { Navigate } from 'react-router-dom';
function AccountPage() {
    const {user} = useContext(userContext);
    if (!user){
        return Navigate
    }
  return (
    <div>AccountPage for {user?.email}</div>
  )
}

export default AccountPage