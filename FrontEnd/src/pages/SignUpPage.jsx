import React from "react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {toast} from 'react-hot-toast'

import { MessageSquare , User, Mail, Lock, Eye, EyeOff, Loader2} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";



const SignUpPage = () => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /\S+@\S+\.\S+/;



  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullname.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error("All fields are required.")
      return false
    }

    if (formData.fullname.trim().length < 3) {
      toast.error("Full name should be at least 3 characters long.")
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format. ");
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must be atleast 8 characters long and have atleast 1 uppercase , 1 lowercase , 1 special symbol and 1 numeric.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm()
    if (success === true) {
      signup(formData);
    }

  };

  return (
    
    <div className="min-h-screen grid lg:grid-cols-2">
     
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 ">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2"> Create Account </h1>
              <p className="text-base-content/60">
                Get started with your free account{" "}
              </p>
            </div>
          </div>

          {/*  */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>

              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className='size-5 text-base-content/40 z-20' />
                </div>

                <input type="text"
                  className={`input input-bordered w-full pl-15`}
                  placeholder='Enter your full name'
                  value={formData.fullname}
                  onChange={(e) => setFormData({...formData, fullname:e.target.value})}
                
                />
      

              </div>

            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>

              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className='size-5 text-base-content/40 z-20' />
                </div>

                <input type="text"
                  className={`input input-bordered w-full pl-15`}
                  placeholder='Enter you email '
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email:e.target.value})}
                
                />
      
              </div>

            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>

              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className='size-5 text-base-content/40 z-20' />
                </div>

                <input type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-15`}
                  placeholder='********* '
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password:e.target.value})}
                />

                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => {
                  setShowPassword(!showPassword)
                }}>
                  {showPassword ? (<EyeOff className='size-5 text-baes-content/40 z-10' />) : (<Eye className='size-5 text-base-content/40 z-10'/>)}


                </button>
      
              </div>

            </div>

            
            <button type='submit' className="btn btn-primary w-full" disabled={isSigningUp} >
              {isSigningUp ? (
                <>
                  <Loader2 className='size-5 animate-spin' />
                  Loading...
                </>
              ) :("Create Account")}

            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to='/signin' className="link link-primary">
                Sign in
              </Link>
            
            </p>
          </div>
        </div>

        
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        caption="Connect with friends, share moments, and stay in touch with your loved ones. "
      />
    </div>
  );
};

export default SignUpPage;
