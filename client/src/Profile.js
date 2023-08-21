import { Link, useParams } from 'react-router-dom';
import useFetch from './useFetch';
import useAuth from './hooks/useAuth';
import SubmissionList from './SubmissionList';
import { useEffect, useState } from 'react';
import Axios from 'axios';

const Profile = () => {

  const url = "http://localhost:5000/";

  const { auth } = useAuth();

  const { username } = useParams()

  const { data: user, isPending, error } = useFetch(url + 'user/profile/' + username);

  const urlMySubmissions = url + 'submission/findByUser/' + user?.id_user;

  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const pageRequest = {
      "page": 1,
      "limit": 3
    }
    if (!isPending && !error) {
      Axios.post(urlMySubmissions, pageRequest)
        .then(res => {
          console.log('Submission Page Fetched')
          const newData = res.data.rows;
          setSubs(newData);
        }).catch(err => {
          console.log("Fetching Submissions Error")
          console.log(err)
        });
    }
  }, [urlMySubmissions, isPending, error])

  const easyCount = user?.allCount?.easy;
  const mediumCount = user?.allCount?.medium;
  const hardCount = user?.allCount?.hard;

  const easySolved = user?.solvedCount?.easy;
  const mediumSolved = user?.solvedCount?.medium;
  const hardSolved = user?.solvedCount?.hard;

  const allSolved = easySolved + mediumSolved + hardSolved
  const allCount = easyCount + mediumCount + hardCount
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <div className="content">
      {isPending && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {user &&
        <div className="profile-content">
          <div className="sidebar1">
            <div className="profile">
              <div className="profile-details">
                <img className="profile-img" src={url + user.imagePath} alt="img" />
                <div className="info">
                  <div className="name">{user.username}</div>
                  <div className="rank">
                    Score
                    <h4>{user.score}</h4>
                  </div>
                  <div className="rank">
                    Rank
                    <h4>{user.rank}</h4>
                  </div>
                </div>
              </div>
              {auth?.username === user.username && <button className="edit">Edit Profile</button>}
            </div>
            <hr style={{ margin: '10px 0' }} />
            <div className='item'>
              <div className='class-title'>Languages</div>
              <div className="subitems">
                {user?.langs.map((lang, i) => (
                  <div className="subitem" key={i}>{lang?.lang} {lang?.count}</div>
                ))}
              </div>
            </div>
            <hr style={{ margin: '10px 0' }} />
            <div className='item'>
              <div className='class-title'>Skills</div>
              <div className="subitems">
                {user?.skills.map((skill, i) => (
                  <div className="subitem" key={i}>{skill?.skill} {skill?.count}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="sidebar2">
            <div className="solved-problems">
              <div className='class-title'>Solved Problems</div>
              <div className="solved-details">
                <div
                  className='solved-pourcentage'
                  onMouseOver={() => setMouseOver(true)}
                  onMouseLeave={() => setMouseOver(false)}
                >
                  <div>
                    <div className='solved-number'>{mouseOver ? (allSolved / allCount) + '%' : allSolved}</div>
                    <div>solved</div>
                  </div>
                </div>
                <div className="difficulties">
                  <div className="difficulty">
                    <div className="diff">
                      <div className="diff-name">Easy</div>
                      <div className="number">{easySolved}/{easyCount}</div>
                    </div>
                    <div className="bar" title={(easySolved / easyCount) + '%'}>
                      <div className="uncolored-bar" style={{ backgroundColor: '#00800063' }}></div>
                      <div className="colored-bar" style={{ backgroundColor: 'green', width: `${(easySolved / easyCount) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="difficulty">
                    <div className="diff">
                      <div className="diff-name">Medium</div>
                      <div className="number">{mediumSolved}/{mediumCount}</div>
                    </div>
                    <div className="bar" title={(mediumSolved / mediumCount) + '%'}>
                      <div className="uncolored-bar" style={{ backgroundColor: '#ffa50057' }}></div>
                      <div className="colored-bar" style={{ backgroundColor: 'orange', width: `${(mediumSolved / mediumCount) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="difficulty">
                    <div className="diff">
                      <div className="diff-name">Hard</div>
                      <div className="number">{hardSolved}/{hardCount}</div>
                    </div>
                    <div className="bar" title={(hardSolved / hardCount) + '%'}>
                      <div className="uncolored-bar" style={{ backgroundColor: '#ff000047' }}></div>
                      <div className="colored-bar" style={{ backgroundColor: 'red', width: `${(hardSolved / hardCount) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-submissions">
              <div className='class-title'>
                Recent Submissions
                <Link to={`/profile/${user?.id_user}/submissions`} className='view-all'>View All Submissions &gt;</Link>
              </div>
              <SubmissionList submissions={subs} />
            </div>

          </div>
        </div>
      }
    </div>
  );
}

export default Profile;