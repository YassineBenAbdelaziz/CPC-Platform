import fb from "../../assets/Facebook-logo.png";
import insta from "../../assets/Instagram_logo_2016.svg.webp";
import linkedin from "../../assets/linkedin-logo-linkedin-icon-transparent-free-png.webp";

const About = () => (
    <div className="content">
        <div className="aboutus">
            <div>
                <header>
                    <h1>About Us</h1>
                </header>

                <main>
                    <section id="introduction">
                        <h2>Introduction</h2>
                        <p>
                            Welcome to our website! We are a dedicated team of programming
                            enthusiasts, and we are thrilled to introduce you to our Competitive
                            Programming Club. <br />
                            At our club, we foster a community of like-minded individuals who
                            are passionate about competitive programming. Whether you're a
                            beginner looking to learn the basics or an experienced coder seeking
                            to enhance your skills, we have something for everyone.
                        </p>
                    </section>

                    {/* <section id="history">
            <h2>Our History</h2>
            <p>Founded in 20XX, our company has grown...</p>
            </section> */}

                    <section id="mission">
                        <h2>Our Goals</h2>
                        <p>
                            <span>Tutorials and Learning Materials:</span> Access a vast
                            collection of tutorials, articles, and videos designed to improve
                            your programming skills. From data structures and algorithms to
                            advanced topics like dynamic programming and graph theory, our
                            comprehensive resources cater to programmers of all levels.
                        </p>
                        <p>
                            <span>Practice Arena:</span> Sharpen your skills through our online
                            practice platform, complete with a wide range of programming
                            problems. Practice at your own pace, track your progress, and engage
                            in healthy competition with fellow club members.
                        </p>

                        <p>
                            <span>Contests and Events: </span>Stay updated on upcoming
                            programming contests, hackathons, and coding challenges both within
                            our club and in the broader programming community. Participate in
                            these events to put your skills to the test and win exciting prizes.
                        </p>

                        <p>
                            <span>Discussion Forum: </span>Engage in lively discussions with
                            fellow members, ask questions, seek help, and share your insights.
                            Our vibrant community is always ready to offer support and guidance
                            to ensure your growth as a competitive programmer.
                        </p>
                    </section>


                    <section id="social-media">
                        <h2>Our Social Media</h2>
                        <div className="logos">
                            <a
                                href="https://www.facebook.com/cpcenicarthage"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img src={fb} alt="FaceBook_image" width={"75px"} />
                            </a>
                            <a
                                href="https://www.instagram.com/cpcenicarthage/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    src={insta}
                                    alt="Instagram_image"
                                    width={"40px"}
                                    style={{ marginBottom: "2px", marginRight: "3px" }}
                                />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/cpc-enicarthage/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    src={linkedin}
                                    alt="LinkedIn_image"
                                    width={"70px"}
                                    style={{ marginBottom: "-13px" }}
                                />
                            </a>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    </div>

);

export default About;
