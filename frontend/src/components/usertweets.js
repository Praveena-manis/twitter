import React, { useEffect, useState } from "react";
import "./profile.css";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import Layout from './layout';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DateOfBirthPicker from './dateofbirthPicker';
import ProfilePic from "./profilePic";
import { toast } from 'react-toastify';
import Image from 'react-bootstrap/Image'
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config";
import './usertweets.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
export default function Tweets(props) {
    const params=useParams();
    
    const [pic, setPic] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [user, setUser] = useState("")

    const CONFIG_OBJ = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      };
      const deletePost=async(postId)=>{
        const resp=await axios.delete(`${BASE_URL}/api/v1/tweet/delete/${postId}`,CONFIG_OBJ);
        console.log(resp);
        if(resp.status===200){
            toast.success(resp.data.message); 
        }
    }


    const usertweets=async()=>{
        try {
            const resp=await axios.get(`${BASE_URL}/api/v1/tweet/${params.id}/getusertweets`,CONFIG_OBJ);
            console.log(resp);
            if(resp.status===200){
                setTweets(resp.data);
                toast.success("user tweet updated successfully")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        }
    }
    useEffect(() => {
        fetch(`http://localhost:5500/api/v1/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result)
                setPic(result.user.profile);
                setUser(result.user)
                console.log(pic);
                if (result.status === 200) {
                    console.log(result);
                    toast.success(result.message);
                }
            });
            usertweets();
    }, []);

    return (
        <div className='container'>
            <div className='row ms-3 py-3 px-5 fs-2 fw-200 mb-4'>
                <div className='col-md-12'>                       
<FontAwesomeIcon icon={faLocationDot} /><span className="fw-bolder">Location:{JSON.parse(localStorage.getItem("user")).location} </span>    
        <div className='tweet'>
         <h1>Tweets And Replies</h1>
                  {tweets.map((post)=>{return(
                    <div>
                        <div className="post d-flex">
                <Image
                                    src={'http://localhost:5500/api/v1/user/download/' + pic}
                                    alt="" width='70px' height='70px' roundedCircle
                                />
                    <span className='fs-5 fw-bolder'>@{JSON.parse(localStorage.getItem("user")).name}</span>
                                       <MdDelete onClick={() => deletePost(post._id)} className='float-end fs-1 p-2 mt-2' />
</div>
                    <div className="p-3 align-items-center"> {post.content}</div>
                    <img width='160px' height='160px'  alt="profile pic" src={'http://localhost:5500/api/v1/user/download/' + post.image}/>
                 </div>
                
                  )})}  
                  </div>    
            </div>
                </div>
</div>

         

    );
}