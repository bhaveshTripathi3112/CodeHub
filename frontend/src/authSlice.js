import {createAsyncThunk , createSlice, isRejectedWithValue} from '@reduxjs/toolkit'
import { axiosClient } from './utils/axiosClient'

export const registerUser = createAsyncThunk(
    'auth/register',
    async(userData , { rejectWithValue}) =>{
        try {
            console.log("Data being sent:", userData);
            const response = await axiosClient.post('/user/register',userData)
            return response.data.user
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/login',
    async(credentials , { rejectWithValue}) =>{
        try {
            const response = await axiosClient.post('/user/login',credentials)
            return response.data.user
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async(_, { rejectWithValue}) =>{
        try {
            const {data} = await axiosClient.get('/user/check')
            return data.user
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async(_, { rejectWithValue}) =>{
        try {
            await axiosClient.post('/user/logout')
            return null
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

// const response = {
//     data: {},
//     status_code:
// }



const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        isAuthenticated : false,
        loading : false ,
        error : null
    },
    reducers:{
    },
    extraReducers : (builder)=>{
        builder
            //Regsiter user cases
            .addCase(registerUser.pending , (state) => {
                state.loading = true ;
                state.error = null
            })
            .addCase(registerUser.fulfilled , (state,action) =>{
                state.loading = false
                state.isAuthenticated = !!action.payload
                state.user = action.payload
            })
            .addCase(registerUser.rejected , (state , action) =>{
                state.loading = false
                state.error = action.payload?.message || 'Something went wrong'
                state.isAuthenticated = false
                state.user = null
            })
            .addCase(loginUser.pending , (state) => {
                state.loading = true ;
                state.error = null
            })
            .addCase(loginUser.fulfilled , (state,action) =>{
                state.loading = false
                state.isAuthenticated = !!action.payload
                state.user = action.payload
            })
            .addCase(loginUser.rejected , (state , action) =>{
                state.loading = false
                state.error = action.payload?.message || 'Something went wrong'
                state.isAuthenticated = false
                state.user = null
            })
            .addCase(checkAuth.pending , (state) => {
                state.loading = true ;
                state.error = null
            })
            .addCase(checkAuth.fulfilled , (state,action) =>{
                state.loading = false
                state.isAuthenticated = !!action.payload
                state.user = action.payload
            })
            .addCase(checkAuth.rejected , (state , action) =>{
                state.loading = false
                state.error = action.payload?.message || 'Something went wrong'
                state.isAuthenticated = false
                state.user = null
            })
            .addCase(logoutUser.pending , (state) => {
                state.loading = true ;
                state.error = null
            })
            .addCase(logoutUser.fulfilled , (state) =>{
                state.loading = false
                state.isAuthenticated = false
                state.user = null
            })
            .addCase(logoutUser.rejected , (state , action) =>{
                state.loading = false
                state.error = action.payload?.message || 'Something went wrong'
                state.isAuthenticated = false
                state.user = null
            })

    }
})

export default authSlice.reducer