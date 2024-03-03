import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import eye from "./imgs/eye.png";
import invisible from "./imgs/invisible.png";
import camera from "./imgs/icon-photograph-profile-picture_689723-498-removebg-preview.png";
import useAuth from "./hooks/useAuth";
import NotFound from "./NotFound";
import url from './Url';
import { useMutation, useQuery } from '@tanstack/react-query';
import { editProfile, getProfile } from './services/user';
import { UpdateImage } from './imageCrop/UpdateImagePopup';
import { getOrientation } from 'get-orientation/browser'
import { getRotatedImage } from './imageCrop/CropImage'

const EditProfile = () => {

    const { username } = useParams();

    const { auth } = useAuth();

    const { data: user, isPending, isError, error } = useQuery({
        queryKey : ['editProfile',username],
        queryFn : async () => {
            return getProfile(username);
        }
    })
    
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [rePwd, setRePwd] = useState('');
    const [pwdMsg, setPwdMsg] = useState('');
    const [rePwdMsg, setRePwdMsg] = useState('');
    const [nVisible, setNVisible] = useState(true);
    const [rVisible, setRVisible] = useState(true);
    const [changePicture, setChangePicture] = useState(false);
    const [image, setImage] = useState(null);
    const [imageChosen, setImageChosen] = useState(false);

    const fileRef = useRef(null);

    const { data, mutate, mutationIsPending, mutationIsError, mutationError } = useMutation({
        mutationFn: async ({userId, body}) => {
            return editProfile(userId, body);
        },
        onSuccess: () => {
            window.location.pathname = '/profile/' + username;
        },
        onError : (err) => {
            console.log(err.response.data);
        }
    });

    const handleIconClick = (visible, setVisible) => {
        visible ? setVisible(false) : setVisible(true)
    }

    const handleImageClick = () => {
        fileRef.current.click();
    }

    const handleImageChange = async (e) => {
        const ORIENTATION_TO_ANGLE = {
            '3': 180,
            '6': 90,
            '8': -90,
        }
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            let imageDataUrl = await readFile(file)

            try {
            // apply rotation if needed
            const orientation = await getOrientation(file)
            const rotation = ORIENTATION_TO_ANGLE[orientation]
            if (rotation) {
                imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
            }
            } catch (e) {
                console.warn('failed to detect the orientation')
            }

            setImage(imageDataUrl)
            setImageChosen(true)
            setChangePicture(false)
        }
    }
    function readFile(file) {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.addEventListener('load', () => resolve(reader.result), false)
          reader.readAsDataURL(file)
        })
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
        }
        if (fname !== '') {
            formData.append('fname', fname);
        }
        if (lname !== '') {
            formData.append('lname', lname);
        }
        if (image !== null) {
            formData.append('userImage', image);
        }
        
        if (test && !isPending) {
            mutate({
                userId: auth?.id,
                body: formData
            });
        }console.log(formData.length);
    }

    return (
        <>
            {auth?.username === username ?
                <div className="content">
                    {isPending && <div>Loading...</div>}
                    {error && <div>{error}</div>}
                    {user &&
                        <div className="edit">
                            {
                                !imageChosen ?
                                <>
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
                                                image === null ?
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
                                </>
                                : <UpdateImage imageSrc={image} setImage={setImage} setChosen={setImageChosen} />       
                            }
                        </div>
                    }
                </div>
                : <NotFound />
            }            
        </>
    );
}

export default EditProfile;