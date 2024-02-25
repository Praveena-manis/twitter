import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faHouse,faUser,faRightFromBracket,faCircleUser } from '@fortawesome/free-solid-svg-icons';
import './sidebar.css';
import { FaUserCircle } from "react-icons/fa";
import logo from '../images/bluechat.png'
import { useDispatch,useSelector} from 'react-redux';
const Sidebar = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const user=useSelector(state=>state.userReducer);
    const logout=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({type:'LOGIN_ERROR'});
        navigate('/login');
    }
    return (
        <div className='app'>
         {localStorage.getItem('token')!=null?<nav className="sidebar bg-light mt-auto">
                    <img src={logo} alt='logo' className='logo'/>
                    <ul className="list-unstyled components">
                        <li>
                            <NavLink to="/" style={{ textDecoration: 'none' }}>
                            <FontAwesomeIcon icon={faHouse} />
                            Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile"style={{ textDecoration: 'none' }}>
                            <FontAwesomeIcon icon={faUser} />
                            Profile</NavLink>
                        </li>
                        <li>
                            <NavLink to="/login"style={{ textDecoration: 'none' }} onClick={()=>logout()}>
                            <FontAwesomeIcon icon={faRightFromBracket} />Logout</NavLink>
                        </li>
                            </ul>
                            <div className='my-1 p-3 pb-5 py-5'>
                            <ul>
                            <li>
                        <NavLink to="/login"className='user mt-5'style={{ textDecoration: 'none' }}>
                        <img className='p-2 profile img-fluid'  alt="profile pic" src={'http://localhost:5500/api/v1/user/download/' + user.user.profile}/>
<span>{user.user.name}</span>
                            <p className='p-4'>@{user.user.username}</p>
       </NavLink>
                        </li>
                    </ul>
                    </div>
                </nav>:''}
                
</div>
    )
}
export default Sidebar;