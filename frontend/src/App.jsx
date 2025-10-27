import {Routes,Route, Navigate } from "react-router";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { checkAuth } from "./authSlice";
import {useDispatch , useSelector} from 'react-redux'
import { useEffect } from "react";
import Adminpanel from "./pages/Adminpanel";
import ProblemsPage from "./pages/ProblemsPage";

function App() {

  //code to check whether user is authenticated or not
  const {isAuthenticated , user , loading} = useSelector((state)=>state.auth)
  const dispatch = useDispatch()

  useEffect(() =>{
    
    dispatch(checkAuth())
    
  },[dispatch])

  console.log(user);
  console.log(isAuthenticated);
  
  


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }


  return (
  <>
    <Routes>
      <Route path="/" element={isAuthenticated ? <ProblemsPage></ProblemsPage> : <Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login></Login>} ></Route>
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup></Signup>}></Route>
      {/* <Route path="/admin" element={
        isAuthenticated && user?.role ==='admin' ? <Adminpanel/>  : <Navigate to='/'/>}>
      </Route> */}

      <Route path="/admin" element={<Adminpanel></Adminpanel>}></Route>
      
    </Routes>
  </>
  )
}

export default App
