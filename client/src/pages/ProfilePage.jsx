import React, { useContext, useState } from 'react'
import { userContext } from '../UserContext';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PlacesPage from './PlacesPage';
import AccountNav from '../AccountNav';
function ProfilePage() {
    const { user, ready, setUser } = useContext(userContext);
    const [redirect, setRedirect] = useState(null);

    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout() {
        try {
            await axios.post('/logout');
            setRedirect(true);
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    if (!ready) {
        return <div>Loading...</div>
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />;
    }

    
    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div>
            <AccountNav/>
            {subpage === 'profile' && (
                <div className='text-center max-w-xl mx-auto' >
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logout} className='primary max-w-md mt-2'>Logout</button>
                </div>
            )}
            {subpage === 'places' && (
                <PlacesPage />
            )}
        </div>
    )
}

export default ProfilePage