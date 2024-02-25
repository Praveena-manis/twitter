import React, { useEffect, useState } from "react";
import "./profile.css";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from './layout';
import './home.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProfilePic from "./profilePic";
import { toast } from 'react-toastify';
import Image from 'react-bootstrap/Image'
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config";
import './home.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot ,faCalendar} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE
} from '../redux/actionTypes';
export default function Profie(props) {
    const [dateofbirth, setDateofBirth] = useState(null);
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.userReducer);
    const [pic, setPic] = useState([]);
    const [show, setShow] = useState(false)
    const [tweets, setTweets] = useState([]);
    const [user, setUser] = useState("")
    const [changePic, setChangePic] = useState(false)
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    // const [all, setAll] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // const formattedDate = JSON.parse(localStorage.getItem("user")).dateofbirth ? new Date(JSON.parse(localStorage.getItem("user")).dateofbirth).toLocaleDateString('en-IN',{ timeZone: 'Asia/Kolkata' }) : '';
    const changeprofile = () => {
        if (changePic) {
            setChangePic(false)
        } else {
            setChangePic(true)
        }
    }
    const formattedDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
      
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
      
        return [day, month, year].join('/');
      };
      
      const originalDate = user.dateofbirth;
      const formatted = formattedDate(originalDate);
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
    const handleDateChange = (date) => {
        setDateofBirth(date);
      };
      const handleUpdateProfile = async () => {
        dispatch({ type: UPDATE_PROFILE_REQUEST });
        try {
          const response = await axios.put(
            `${BASE_URL}/api/v1/user/updatedetails`,
            { name, location, dateofbirth },
            { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
          );
          const { data } = response;
          // setName(data.name);
          // setLocation(data.location);
          setDateofBirth(data.dateofbirth)
          toast.success(response.data.message);
          dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.updatedUser });
        } catch (error) {
          dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error.response.data.message });
        }
      };
    const usertweets = async () => {
        try {
            const resp = await axios.get(`${BASE_URL}/api/v1/tweet/getusertweets`, CONFIG_OBJ);
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
        fetch(`${BASE_URL}/api/v1/user/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result)
                setPic(result.user.profile);
                setUser(result.user)
                if (result.status === 200) {
                    toast.success(result.message);
                }
            });
        usertweets();
    }, []);

    return (
        <div className='container mt-mb-5 mt-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <Layout />
                </div>
                <div className='container1 col-md-9'>
                    <div className="profile">
                        {/* Profile frame */}
                        <div className="profile-frame mt-5">
                            {/* profile-pic */}
                            <div className="profile-pic px-3">
                        <img src={`${BASE_URL}/api/v1/user/download/`+pic} alt=''/> 
                                    
                                {/* profile-data */}
                                <div className="pofile-data px-5">
                                    <h1 >{JSON.parse(localStorage.getItem("user")).name}</h1>
                                    <div className="profile-info ml-5 d-flex">
                    <span className="fw-bolder">{user.followers ? user.followers.length : "0"} followers</span>
                    <span className="fw-bolder px-2">{user.following ? user.following.length : "0"} following</span>
                                <ProfilePic />                                                       
    <Button variant="primary" onClick={handleShow}>
        Edit
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit profile </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <label>Name</label>
            <input type='text' className='form-control mt-3' placeholder='Enter your Name'
              value={name} onChange={(e) => setName(e.target.value)} />
            <br />
            <label>Location</label>
            <input type='text' className='form-control mt-3' placeholder='Enter your Location'
              value={location} onChange={(e) => setLocation(e.target.value)} />
            <br />
            <div>
              <label>Date of Birth: </label>
              <DatePicker
              value={dateofbirth}
                selected={dateofbirth}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                placeholderText="Select Date of Birth"
                maxDate={new Date()}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" onClick={handleUpdateProfile} disabled={loading}>Update</Button>
          {error && <p>{error}</p>}
        </Modal.Footer>
      </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="location"> 
                         
                        <FontAwesomeIcon icon={faCalendar} /><span className='p-2 mx-2'>DOB:{formatted}</span>                      
  <FontAwesomeIcon icon={faLocationDot} /><span>Location:{JSON.parse(localStorage.getItem("user")).location}</span>
</div>
<hr></hr>
</div>
</div>
</div>
                        <div className=" container mx-4">
                            <h4>Tweets And Replies</h4>
                            {tweets.map((post) => {
                                return (
                                    <div className="post">
                                        <div className='tweet'>
                                            <Image
                                                src={'http://localhost:5500/api/v1/user/download/' + pic}
                                                alt="" width='70px' height='70px' roundedCircle
                                            />
                                            <span className='fs-5 fw-bolder'>@{JSON.parse(localStorage.getItem("user")).name}</span>
                                        </div>
                                        <div className="p-3 align-items-center"> {post.content}</div>
                                        <img width='160px' height='160px' alt="profile pic" src={'http://localhost:5500/api/v1/user/download/' + post.image} />
                                    </div>

                                )
                            })}
                        </div>
                    </div>
                 



    );
}