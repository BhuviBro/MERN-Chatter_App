import React from 'react'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import ProfilePage from './Pages/ProfilePage'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    
  <div className=' bg-[url("./src/assets/bgImage.svg")] bg-contain bg-center bg-'>
    <Routes>
      <Route path='/home' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/profile' element={<ProfilePage />} />
    </Routes>
  </div>
  )
}

export default App
