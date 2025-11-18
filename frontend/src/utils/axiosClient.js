import axios from 'axios'

export const axiosClient = axios.create({
    baseURL:'https://codehub-backend-qyqw.onrender.com',
    withCredentials:true,
    headers:{
        'Content-Type' : 'application/json'
    }
})