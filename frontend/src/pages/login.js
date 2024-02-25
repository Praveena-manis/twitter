import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from '../config';
import Image from '../images/login.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const login = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = { email, password}
            const resp = await axios.post(`${BASE_URL}/api/v1/auth/login`, data)
            console.log(resp);
            if (resp.status === 200) {
                setLoading(false);
                toast.success(resp.data.message);
                localStorage.setItem('token',resp.data.jwtToken);
                localStorage.setItem('user',JSON.stringify(resp.data.userInfo));
                dispatch({type:'LOGIN_SUCCESS',payload:resp.data.userInfo});
                setLoading(false);
                navigate('/')
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
        setEmail('');
        setPassword('');
    }
    return (
        <div className="container mt-5">
            <div className='row'>
                <div className='col-md-7 col-sm-12 d-flex align-items-center justify-content-center'>
                    <img src={Image} alt="register" className="image w-100" style={{height:"485px"}}></img>
                </div>
                <div className='col-md-5 col-sm-12'>
                    <div className='card shadow'>
                    {loading?<><div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                            </div></>:''}
                        <div className='card-body'>
                            <h4 className='card-title text-center mt-3 fw-100'>LOGIN</h4>
                            <form onSubmit={(e) => login(e)}>
                                <input type="email" value={email} placeholder="Email-Id" onChange={(e) => setEmail(e.target.value)} className="p-2 mt-2 mb-4 form-control" />
                                <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="p-2 mt-2 mb-4 form-control" />
                                <div className='mt-3 d-grid'>
                                    <button type="submit" className="btn btn-primary fw-500">Login</button>
                                </div>
                                <div className='my-4'>
                                    <hr className='text-muted' />
                                    <h5 className='text-muted text-center'>OR</h5>
                                    <hr className='text-muted' />
                                </div>
                                <div className='mt-3 mb-5 d-grid'>
                                <h6 className='text-center'>Don't have an account?</h6>
                                    <Link to="/register" className='btn btn-primary fw-500'>Register</Link>
                                </div>
                                <ToastContainer/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;