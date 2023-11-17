import React, { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { userContext } from '../UserContext';
import axios from 'axios';
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const {user,setUser} = useContext(userContext);
  async function handleLogin(e){
    e.preventDefault();
    try {
      const userDoc = await axios.post('/login', {
        email,
        password
      })
      setUser(userDoc.data);
      alert('Login successful')
      setRedirect(true);
    } catch (e) {
      alert('Login failed')
    }
  }
  if(redirect){
    return (<Navigate to={'/'}/>)
  }
  return (
    <div className='mt-4 grow flex items-center justify-center'>
      <div className='mb-64'>
        <h1 className='text-4xl text-center mb-4'>Login</h1>
      <form className='max-w-md mx-auto' onSubmit={handleLogin}>
        <input type='email' 
        placeholder='email'
        value={email} 
        onChange={e => setEmail(e.target.value)}/>
        <input type='password' 
        placeholder='password'
        value={password} 
        onChange={e => setPassword(e.target.value)}/>
        <button className='primary'>Login</button>
        <div className='text-center py-2 text-gray-500'>
          Don't have an account yet? <Link className='underline text-black' to={'/register'}>Register now</Link>
        </div>
      </form>
      </div>
    </div>
  )
}

export default LoginPage