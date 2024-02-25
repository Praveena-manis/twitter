import React,{useEffect,useState} from 'react'
import Card from '../components/Card.js'
import { BASE_URL } from '../config.js'
import axios from 'axios';
import './home.css';
import {toast,ToastContainer} from 'react-toastify';
import Home from './home.js'
import Sidebar from './Sidebar.js'
import Layout from './layout.js'
const Post = () => {
    const CONFIG_OBJ = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      }
    const [alltweets,setMyalltweets]=useState([]);

    const getAlltweets = async () => {
        const resp = await axios.get(`${BASE_URL}/api/v1/tweet/`, CONFIG_OBJ);
        console.log(resp.data.tweets);
        if (resp.status === 200) {
            setMyalltweets(resp.data.tweets);
        }
    }
    const deletePost=async(postId)=>{
        const resp=await axios.delete(`${BASE_URL}/api/v1/tweet/delete/${postId}`,CONFIG_OBJ);
        console.log(resp);
        if(resp.status===200){
            getAlltweets();
            toast.success(resp.data.message); 
        }
    }

    useEffect(()=>{
        getAlltweets();
    },[])
    return (
        <div className='container mt-mb-5 mt-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <Layout/>
                    </div>
                    <div className='container1 col-md-9'>   
                <Home/>
                    {alltweets.map((post)=>{
                        return(
                            // <div className='col-md-4 mb-2'>
                            <Card postData={post} deletePost={deletePost} getAllPosts={getAlltweets} />
                            // </div>
                        )                      
                    })}
                    </div>
                </div>
              </div>
    )
}

export default Post ;