// import React, { useState, useEffect, useRef } from "react";

// export default function ProfilePic({ changeprofile }) {
//   const hiddenFileInput = useRef(null);
//   const [image, setImage] = useState("");
//   const [url, setUrl] = useState("");

//   // posting image to cloudinary
//   const postDetails = () => {
//     const data = new FormData();
//     data.append("file", image);
//     data.append("upload_preset", "insta-clone");
//     data.append("cloud_name", "cantacloud2");
//     fetch("https://api.cloudinary.com/v1_1/cantacloud2/image/upload", {
//       method: "post",
//       body: data,
//     })
//       .then((res) => res.json())
//       .then((data) => setUrl(data.url))
//       .catch((err) => console.log(err));
//     console.log(url);
//   };

//   const postPic = () => {
//     // saving post to mongodb
//     fetch("http://localhost:5500/api/v1/user/uploadprofile", {
//       method: "put",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + localStorage.getItem("token"),
//       },
//       body: JSON.stringify({
//         pic: url,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//         changeprofile();
//         window.location.reload();
//       })
//       .catch((err) => console.log(err));
//   };

//   const handleClick = () => {
//     hiddenFileInput.current.click();
//   };

//   useEffect(() => {
//     if (image) {
//       postDetails();
//     }
//   }, [image]);
//   useEffect(() => {
//     if (url) {
//       postPic();
//     }
//   }, [url]);
//   return (
//     <div className="profilePic darkBg">
//       <div className="changePic centered">
//         <div>
//           <h2>Change Profile Photo</h2>
//         </div>
//         <div style={{ borderTop: "1px solid #00000030" }}>
//           <button
//             className="upload-btn"
//             style={{ color: "#1EA1F7" }}
//             onClick={handleClick}
//           >
//             Upload Photo
//           </button>
//           <input
//             type="file"
//             ref={hiddenFileInput}
//             accept="image/*"
//             style={{ display: "none" }}
//             onChange={(e) => {
//               setImage(e.target.files[0]);
//             }}
//           />
//         </div>
//         <div style={{ borderTop: "1px solid #00000030" }}>
//           <button className="upload-btn" style={{ color: "#ED4956" }}>
//             {" "}
//             Remove Current Photo
//           </button>
//         </div>
//         <div style={{ borderTop: "1px solid #00000030" }}>
//           <button
//             style={{
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "15px",
//             }}
//             onClick={changeprofile}
//           >
//             cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, {useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import { BASE_URL } from '../config';
import './home.css';
import { toast, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
const ProfilePic = ({changeprofile}) => {
    const user = useSelector(state => state.userReducer);
    console.log(user.user.name)
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState({ preview: '', data: null })
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);    
    const handleFileSelect = (event) => {
        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        }
        setImage(img);
    }
    const CONFIG_OBJ = {
        headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
   
    const uploadprofile = async () => {
        //     e.preventDefault();
        const formData = new FormData();
        formData.append('profile', image.data);
        try {
            setLoading(true);
           
            // write api call to create post
            const postResponse = await axios.put(`${BASE_URL}/api/v1/user/uploadprofile`, formData, CONFIG_OBJ, 
            // {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     }
            );
            if (postResponse.status === 200) {
                setLoading(false);
                toast.success(postResponse.data.message);
            }
        }
        catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <>
            <div className="container">
                <div className='row'>
                    {/* <div className='col-md-3 col-sm-12'>
                        <Sidebar />
                    </div> */}
                    <div className='col-md-12 col-sm-12 text'>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <Button variant="outline-primary w-400" onClick={handleShow}>
                                 Upload
                            </Button>
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>New Tweet</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="dropZoneContainer">
                                        <label htmlFor="drop_zone" className="FileUploadLabel p-2 mx-2 image">
                                            <FontAwesomeIcon icon={faImage} className="ImageIcon" />
                                        </label>
                                        <input
                                            type="file"
                                            id="drop_zone"
                                            className="FileUpload"
                                            accept=".jpg, .png, .gif"
                                            onChange={handleFileSelect}
                                            style={{ display: 'none' }}
                                        />
                                        <div className="dropZoneOverlay">
                                            {image.preview && <img src={image.preview} width='300' height='300' alt=''/>}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-12'>
                                            {loading ? <div className='col-md-12 mt-3 text-center'>
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div> : ''}
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={() => uploadprofile()}>
                                        Upload Profile Picture
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>                        
                    </div>
                </div>
                <ToastContainer/>
            </div>
        </>
    )
}
export default ProfilePic;