import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from '../config';
import Chat from '../images/18386.jpg';
import { Link } from 'react-router-dom';
const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setuserName] = useState('');
    const [loading,setLoading]=useState(false);
    const signup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = { name, email, password, username }
            const resp = await axios.post(`${BASE_URL}/api/v1/auth/register`, data)
            if (resp.status === 200) {
                setLoading(false);
                toast.success(resp.data.message);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error.response.data.message);
        }
        setName('');
        setEmail('');
        setPassword('');
        setuserName('');
    }
    return (
        <div className="container mt-5">
            <div className='row'>
                <div className='col-md-7 col-sm-12 d-flex align-items-center justify-content-center'>
                    <img src={Chat} alt="register" className="image w-100" style={{height:"600px"}}></img>
                </div>
                <div className='col-md-5 col-sm-12'>
                    <div className='card shadow'>
                    {loading ?<><div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                            </div></>:''}
                        <div className='card-body'>
                            <h4 className='card-title text-center mt-3 fw-100'>Sign Up</h4>
                            <form onSubmit={(e) => signup(e)}>
                                <input type="text" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} className="p-2 mt-2 mb-4 form-control" />
                                <input type="email" value={email} placeholder="Email-Id" onChange={(e) => setEmail(e.target.value)} className="p-2 mt-2 mb-4 form-control" />
                                <input type="text" value={username} placeholder="Username" onChange={(e) => setuserName(e.target.value)} className="p-2 mt-2 mb-4 form-control" />
                                <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="p-2 mt-2 mb-4 form-control" />
                                <div className='mt-3 d-grid'>
                                    <button type="submit" className="btn btn-primary">Register</button>
                                </div>
                                <div className='my-4'>
                                    <hr className='text-muted' />
                                    <h5 className='text-muted text-center'>OR</h5>
                                    <hr className='text-muted' />
                                </div>
                                <div className='mt-3 mb-5 d-grid'>
                                <h6 className='text-center'>Already have an account?</h6>
                                    <Link to="/login" className='btn btn-primary'>Log In</Link>
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
export default Register;