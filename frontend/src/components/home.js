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
const Home = () => {
    const user = useSelector(state => state.userReducer);
    console.log(user.user.name)
    const [show, setShow] = useState(false);
    const [content, setContent] = useState('')
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
   
    const addtweet = async () => {
        //     e.preventDefault();
        const formData = new FormData();
        formData.append('content', content);
        formData.append('image', image.data);
        try {
            setLoading(true);
           
            // write api call to create post
            const postResponse = await axios.post(`${BASE_URL}/api/v1/user/createtweets`, formData, CONFIG_OBJ, 
            // {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     }
            );
            console.log(postResponse);
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
                            <h4 className="text1">Home</h4>
                            <Button variant="primary" onClick={handleShow}>
                                Tweet
                            </Button>
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>New Tweet</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <textarea onChange={(e) => setContent(e.target.value)} className="form-control1" placeholder="Write Your Tweet"></textarea>
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
                                    <Button variant="primary" onClick={() => addtweet()}>
                                        Add Tweet
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
export default Home;