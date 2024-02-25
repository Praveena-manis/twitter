import {BrowserRouter as Router,Routes,Route, useNavigate} from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
// import Sidebar from './components/Sidebar';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Home from './components/home';
import Post from './components/post';
import Profile from './components/profile';
import  UserProfile  from './components/UserProfile';
function App(){
  function DynamicRouting(){
    const dispatch=useDispatch();
    const navigate=useNavigate();
    //const user=useSelector(state=>state.userReducer)
    useEffect(()=>{
      const userData=JSON.parse(localStorage.getItem("user"))
      if(userData){
        dispatch({type:'LOGIN_SUCCESS',payload:userData})
        navigate("/");
      }else
      {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({type:'LOGIN_ERROR'})
        navigate('/login')
      }
      //eslint-disable-next-line
    },[])
  return(
    <div>
         <Routes>
         {/* <Route path="/" element={<Home/>}></Route> */}
      <Route path="/register" element={<Register/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
          <Route exact path="/" element={<Post />}></Route>
          <Route exact path="/" element={<Home/>}></Route>
          <Route exact path="/profile" element={<Profile />}></Route>
          <Route path="/profile/:userid" element={<UserProfile />}></Route>
      </Routes>
    </div>
  )
  }
  return(
    <div className='app-bg'>
    <Router>
      {/* <Sidebar/> */}
      <DynamicRouting/>
    </Router>
  </div>
  )
}

export default App;