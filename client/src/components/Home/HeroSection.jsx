import React from 'react';
import styles from './HeroSection.module.css';
import hero from '../../assets/dev.png';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {

    const navigate = useNavigate();

    const navigateSignup = () => {
        navigate('/signup');
    }

    const navigateProblemSet = () => {
        navigate('/problemset');
    }


    return (
        <div className={styles.container}>
                <div className={styles.text}>
                    <h1 className={styles.title}>
                        <span>Think you can code?</span>
                        <br />
                        <span className={styles.secondLine}> Prove it.</span>
                        </h1>
                    <p> Dive into our problem-solving challenges and unlock your coding potential.</p>
                    <div className="buttons">
                        <button className={`${styles.button} ${styles.button1}`} onClick={navigateSignup}>Join Now</button>
                        <button className={`${styles.button} ${styles.button2}`} onClick={navigateProblemSet}>Practice</button>
                    </div>
                </div>
                <img src={hero} className={styles.hero} alt="hero" />
        </div>
    );
};

export default HeroSection;
