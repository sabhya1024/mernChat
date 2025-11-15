import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast'
// import { Facebook } from 'lucide-react'


export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],

    checkAuth: async () => {
        try { 
            const res = await axiosInstance.get('/auth/check')
            set({authUser: res.data})
        }
        catch (error) {
            set({ authUser: null });
        }
        finally {
            set({isCheckingAuth : false})
        }
    },

    signup: async (data) => {
        set({isSigningUp : true})
        try {
            const res = await axiosInstance.post('/auth/signup', data);
             set({ authUser: res.data });
            toast.success('Account created successfully . ')
           
            
        } catch (error) {
            toast.error(`Error in signup. `)
            return false;
        }
        finally {
            set({isSigningUp: false})
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success("logged out successfully")
         }
        catch (error) {
            toast.error('Failed to logout. Try again.')
            return false;
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/signin", data);
            set({ authUser: res.data });
            toast.success("Logged In  successfully . ");
            
        } catch (error) {
            toast.error("Failed to sign-in");
            console.log("Internal server error . ")
            return false
            
        } finally {
            set({isLoggingIn: false})
        }
    },

    updateProfile : async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.patch('/auth/update-profile', data);
            set({ authUser: res.data });
            toast.success('profile Updated successfully')
            
        } catch (error) {
            console.log("error in update profile ", error);
            toast.error("Can't update profile.")
        }
        finally {
            set({isUpdatingProfile: false})
        }
    }
}))