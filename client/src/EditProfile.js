import { useParams } from "react-router-dom";
import useFetch from "./useFetch";
import { useRef, useState } from "react";
import Axios from 'axios'
import eye from "./imgs/eye.png";
import invisible from "./imgs/invisible.png";
import camera from "./imgs/icon-photograph-profile-picture_689723-498-removebg-preview.png";
import useAuth from "./hooks/useAuth";
import NotFound from "./NotFound";

const EditProfile = () => {
    const url = "http://localhost:5000/";

    const { username } = useParams();

    const { auth } = useAuth();

    const { data: user, isPending, error } = useFetch(url + 'user/profile/' + username);

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [rePwd, setRePwd] = useState('');
    const [pwdMsg, setPwdMsg] = useState('');
    const [rePwdMsg, setRePwdMsg] = useState('');
    const [aVisible, setAVisible] = useState(true);
    const [nVisible, setNVisible] = useState(true);
    const [rVisible, setRVisible] = useState(true);
    const [changePicture, setChangePicture] = useState(false);
    const [image, setImage] = useState("");

    const fileRef = useRef(null);

    const handleIconClick = (visible, setVisible) => {
        visible ? setVisible(false) : setVisible(true)
    }

    const handleImageClick = () => {
        fileRef.current.click();
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file)
        setImage(file)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let test = true;
        const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/i;
        if (!regExp.test(newPassword) && newPassword !== '') {
            test = false;
            setPwdMsg('Minimum eight and maximum 10 characters,\nat least one uppercase letter,\none lowercase letter, one number\nand one special character.');
        } else {
            setPwdMsg('');
        }
        if (rePwd !== newPassword) {
            test = false;
            setRePwdMsg('Passwords are not the same.');
        } else {
            setRePwdMsg('');
        }

        const formData = new FormData();


        if (newPassword !== '') {
            formData.append('password', newPassword);
        } else {
            formData.append('password', password);
        }
        if (fname !== '') {
            formData.append('fname', fname);
        }
        if (lname !== '') {
            formData.append('lname', lname);
        }
        if (image !== '') {
            formData.append('userImage', image);
        }

        if (test && !isPending) {
            Axios.patch(url + "user/" + user?.id_user, formData)
                .then(res => {
                    console.log(res.data);
                    window.location.pathname = '/profile/' + username
                }).catch(err => {
                    console.log(err)
                });
            console.log('User Updated', formData)
        }
    }

    return (
        <>
            {auth?.username === username ?
                <div className="content">
                    {isPending && <div>Loading...</div>}
                    {error && <div>{error}</div>}
                    {user &&
                        <div className="edit">
                            <h2>Edit Profile</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="inputs">
                                    <div className="input-field">
                                        <label htmlFor="fname">First Name : </label>
                                        <input type="text" id='fname' defaultValue={user?.fname} onChange={(e) => setFname(e.target.value)} />
                                    </div>
                                    <div className="input-field">
                                        <label htmlFor="lname">Last Name : </label>
                                        <input type="text" id='lname' defaultValue={user?.lname} onChange={(e) => setLname(e.target.value)} />
                                    </div>
                                    <div className="input-field">
                                        <label htmlFor="username">Username : </label>
                                        <input type="text" id='username' defaultValue={user.username} disabled />
                                    </div>
                                    <div className="input-field">
                                        <label htmlFor="email">Email : </label>
                                        <input type="text" id='email' defaultValue={user.email} disabled />
                                    </div>
                                    <div className="input-field">
                                        <label htmlFor="password">Actual Password : </label>
                                        <div className="password-field" >
                                            <input required type={aVisible ? "password" : "text"} id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <img
                                                className="password-icon"
                                                src={aVisible ? eye : invisible}
                                                alt=""
                                                onClick={() => handleIconClick(aVisible, setAVisible)}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-field">
                                        <label htmlFor="pwd">New Password : </label>
                                        <div className="password-field" >
                                            <input type={nVisible ? "password" : "text"} id='pwd' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                            <img
                                                className="password-icon"
                                                src={nVisible ? eye : invisible}
                                                alt=""
                                                onClick={() => handleIconClick(nVisible, setNVisible)}
                                            />
                                        </div>
                                    </div>
                                    <p style={{
                                        color: 'red',
                                        fontSize: '15px',
                                        maxWidth: '350px'
                                    }}>{pwdMsg}</p>
                                    <div className="input-field">
                                        <label htmlFor="rePwd">Repeate New Password : </label>
                                        <div className="password-field" >
                                            <input type={rVisible ? "password" : "text"} id='rePwd' value={rePwd} onChange={(e) => setRePwd(e.target.value)} />
                                            <img
                                                className="password-icon"
                                                src={rVisible ? eye : invisible}
                                                alt=""
                                                onClick={() => handleIconClick(rVisible, setRVisible)}
                                            />
                                        </div>
                                    </div>
                                    <p style={{
                                        color: 'red',
                                        fontSize: '15px'
                                    }}>{rePwdMsg}</p>
                                    <button className="save-btn">Save</button>
                                </div>

                                <div
                                    className="photo"
                                    title="Change Photo"
                                    onMouseOver={() => setChangePicture(true)}
                                    onMouseLeave={() => setChangePicture(false)}
                                    onClick={handleImageClick}
                                >
                                    {
                                        image === "" ?
                                            <img className="profile-img" src={url + user.imagePath} alt="Profile_Picture" />
                                            : <img className="profile-img" src={URL.createObjectURL(image)} alt="img" />
                                    }
                                    <div className="img-bg" style={changePicture ? { display: 'block' } : { display: 'none' }} ></div>
                                    <img className="camera-img" src={camera} alt="" style={changePicture ? { display: 'inline' } : { display: 'none' }} />
                                    <input
                                        type="file"
                                        ref={fileRef}
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                        accept="image/jpeg, image/png, image/jpg"
                                    />
                                </div>

                            </form>
                        </div>
                    }
                </div>
                : <NotFound />
            }
        </>
    );
}

export default EditProfile;