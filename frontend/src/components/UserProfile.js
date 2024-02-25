import React, { useEffect, useState } from "react";
// import "./profile.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from "./layout";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config";
import Image from 'react-bootstrap/Image'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCalendar } from "@fortawesome/free-solid-svg-icons";
export default function UserProfile() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const { userid } = useParams();
  const [isFollow, setIsFollow] = useState(false);
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const formattedDate = user.dateofbirth ? new Date(user.dateofbirth).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : '';
  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  }
  // to follow user
  const followUser = (userId) => {
    fetch("http://localhost:5500/api/v1/user/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsFollow(true);
      });
  };

  // to unfollow user
  const unfollowUser = (userId) => {
    fetch("http://localhost:5500/api/v1/user/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => {
        res.json();
      })
      .then((data) => {
        console.log(data);
        setIsFollow(false);
      });
  };
  const usertweets = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/api/v1/tweet/${userid}/usertweets`, CONFIG_OBJ);
      if (resp.status === 200) {
        setTweets(resp.data);
        toast.success("user tweet updated successfully")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
    }
  }


  useEffect(() => {
    fetch(`http://localhost:5500/api/v1/user/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUser(result.user);
        setPosts(result.user.profile);
        if (
          result.user.followers.includes(
            JSON.parse(localStorage.getItem("user"))._id
          )
        ) {
          setIsFollow(true);
        }
      });
      usertweets();
  }, [isFollow]);

  return (
    <div className='container mt-mb-5 mt-3'>
      <div className='row'>
        <div className='col-md-3'>
          <Layout />
        </div>
        <div className='container1 col-md-9'>
          <div className="profile">
            {/* Profile frame */}
            <div className="profile-frame">
              {/* profile-pic */}
              <div className="profile-pic">
                <img src={`${BASE_URL}/api/v1/user/download/` + posts} alt="" />
              </div>

              <div className="profile-data mt-5">
                <h1 >{user.name}</h1>
                <div className='px-5 mx-5 p-5'>
                  {/* <h1>{user.name}</h1> */}
                  <button
                    className="followBtn"
                    onClick={() => {
                      if (isFollow) {
                        unfollowUser(user._id);
                      } else {
                        followUser(user._id);
                      }
                    }}
                  >
                    {isFollow ? "Unfollow" : "Follow"}
                  </button>
                  <hr></hr>
                  <div className="profile-info ml-5 d-flex">
                    <span className="fw-bolder">{user.followers ? user.followers.length : "0"} followers</span>
                    <span className="fw-bolder px-2">{user.following ? user.following.length : "0"} following</span>
                  </div>
                  <hr></hr>
                  <div className="location ">
                    <FontAwesomeIcon icon={faCalendar} /><span className='p-2 mx-2'>DOB:{formattedDate}</span>
                    <FontAwesomeIcon icon={faLocationDot} /><span>Location:{user.location}</span>
                  </div>
                </div>
              </div>

              <hr
                style={{
                  width: "90%",

                  opacity: "0.8",
                  margin: "25px auto",
                }}
              /> 
              </div>
              </div>
              </div>
                        <div className="mb-5">
                <h4>Tweets And Replies</h4>
                {tweets.map((post) => {
                  return (
                    <div className="post">
                      <div className='tweet d-flex'>
                        <Image
                          src={'http://localhost:5500/api/v1/user/download/' + posts}
                          alt="" width='70px' height='70px' roundedCircle
                        />
                        <span className='fs-5 fw-bolder'>@{user.name}</span>
                      </div>
                      <div className="p-3 align-items-center"> {post.content}</div>
                      <img width='160px' height='160px' alt="profile pic" src={'http://localhost:5500/api/v1/user/download/' + post.image} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

  );
}