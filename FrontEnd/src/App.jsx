import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import {Routes, Route, Navigate} from 'react-router-dom'
import { Loader } from 'lucide-react'

import { Toaster } from 'react-hot-toast'
// import axiosInstance from './lib/axios'

import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import SignUpPage from "./pages/SignUpPage"
import SignInPage from "./pages/SignInPage"
import HomePage from './pages/HomePage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'


const App = () => {
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeStore();
 
  
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
  

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [ theme ]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

 
  
  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <div>
      <Navbar></Navbar>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/signin" />}
        />

        <Route path="/settings" element={<SettingsPage />} />

        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/signin" />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />

        <Route
          path="/signin"
          element={!authUser ? <SignInPage /> : <Navigate to="/" />}
        />
      </Routes>
      
    </div>
  );
}

export default App