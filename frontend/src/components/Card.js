import React, { useState,useEffect } from 'react'
// import './Card.css'
import moreAction from '../images/horizontalMoreAction.PNG';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../config';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { FiHeart } from "react-icons/fi";
import {Link} from 'react-router-dom';
import { FaRegComment } from "react-icons/fa";
import moment from 'moment';
import './home.css';

const Card = (props) => {
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
    const date = moment().format("MMMM/DD/YYYY");
    const time = moment().format("HH:mm:ss");
    const user = useSelector(state => state.userReducer);
    console.log(user)
    const [pic, setPic] = useState("")
    const [commentBox, setCommentBox] = useState(false);
    const [retweet, setRetweet] = useState('');
    const [comment, setComment] = useState('')
    const submitComment = async (e, postId) => {
        if (e.key === 'Enter' && comment.trim() !== '') {
            setCommentBox(false);
            const request = { "postId": postId, "commentText": comment };
            const response = await axios.put(`${BASE_URL}/api/v1/tweet/comment`, request, CONFIG_OBJ);
            if (response.status === 200)
                props.getAllPosts();
        }
    }
    
    const Retweet = async (tweetId) => {
        try {
           // const request = { 'userId':userId};
           // console.log(request);
            const response = await axios.post(`${BASE_URL}/api/v1/tweet/retweet/${tweetId}`,{},CONFIG_OBJ);
            if (response.status === 200) {
                toast.success(response.data.message);
                props.getAllPosts();
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }
    const likeDislikePost = async (postId) => {
        try {
            const request = { "postId": postId };
            const response = await axios.put(`${BASE_URL}/api/v1/tweet/like`, request, CONFIG_OBJ);
            if (response.status === 200) {
                toast.success(response.data.message)
                props.getAllPosts();
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }
    return (
        <div>
             {props.postData.isRetweeted && (
                    <p className="retw.eet-info fs-5 ">    
                        Retweeted by @{props.postData.retweets}
                    </p>
                )}
            <div className="container1">
                <div className='row'>
                    <div className='col-md-12'>
                        <img className='p-2 profile img-fluid'  alt="profile pic" src={'http://localhost:5500/api/v1/user/download/' + props.postData.author.profile}/>
                        <span className='ms-3 fs-5 fw-bolder'>   
                         <Link style={{ textDecoration: 'none' }} to={`/profile/${props.postData.author._id}`}>@{props.postData.author.name}</Link></span>
                        <span> {date}</span> <span>{time}</span>
                        {props.postData.author._id === user.user._id ?
                            <MdDelete onClick={() => props.deletePost(props.postData._id)} className='float-end fs-1 p-2 mt-2' />
                            : ''}
                    </div>
                </div>
            </div>
   
            <div className='row ms-3 py-3 px-5 fs-2 fw-200 mb-4'>
                <p>{props.postData.content}</p>
                {props.postData.image && (<img src={`${BASE_URL}/api/v1/user/download/${props.postData.image}`} className="card-img-top" alt="" width="300" height="400" />)}
                <div className="col">
                    <span onClick={() => likeDislikePost(props.postData._id)}> <FiHeart className="heart" style={{ color: 'red' }} /> {props.postData.likes.length}</span>
                    <span onClick={() => setCommentBox(true)} className='px-5 comment'><FaRegComment style={{ color: 'blue' }} /> {props.postData.comments.length}</span>
                    <span onClick={() => Retweet(props.postData._id)}><FontAwesomeIcon icon={faRetweet} style={{ color: 'skyblue' }} />{props.postData.retweets ? props.postData.retweets.length : 0}</span>
                </div>
            </div>
            {commentBox ? <>
                <textarea onChange={(e) => setComment(e.target.value)} className="form-control" placeholder="Write Your Comment" onKeyDown={(e) => submitComment(e, props.postData._id)}></textarea>
            </> : ''}
            {props.postData.comments.sort((a, b) => new Date(b.commentedAt) - new Date(a.commentedAt)).map((comment) => {
                return (
                    <>
                        <div className="container">
                            <img className='p-1 profile img-fluid' alt="profile pic" src="https://t3.ftcdn.net/jpg/05/73/95/90/360_F_573959050_BXeecXwfgIlMFGdOfHRiSdedBealWU5Q.jpg" />
                            <span className='ms-3 fs-5 fw-bolder'>{comment.commentedBy?.name}</span>
                            <span> {date}</span> <span>{time}</span>
                            <div className='row ms-5 py-2 px-3 fs-5 fw-400 mb-4'>
                                <p>{comment.commentText}</p>
                                <div className="col">
                    <span onClick={() => likeDislikePost(props.postData.comments._id)}> <FiHeart className="heart" style={{ color: 'red' }} /> {props.postData.likes.length}</span>
                    <span onClick={() => setCommentBox(true)} className='px-5 comment'><FaRegComment style={{ color: 'blue' }} /> {props.postData.comments.length}</span>
                    <span onClick={() => Retweet(props.postData._id)}><FontAwesomeIcon icon={faRetweet} style={{ color: 'skyblue' }} />{props.postData.retweets.length}</span>
                </div>
                            </div>
                        </div>
                    </>
                )
            })}
        </div>
    )
}

export default Card
