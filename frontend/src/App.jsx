import React from 'react'
import {Routes,Route} from "react-router-dom"
import Home from './pages/home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import Verify from './pages/Verify.jsx'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>}/>
        <Route path='/verify' element={<VerifyEmail/>}/>
        <Route path='/verify/:token' element={<Verify/>}/>
      </Routes>
    </div>
  )
}

export default App
