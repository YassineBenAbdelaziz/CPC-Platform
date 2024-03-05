import { Link, useParams } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import SubmissionList from './SubmissionList';
import { useState } from 'react';
import url from './Url';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from './services/user';
import { getAllSubmissions } from './services/submission';
import Error from './Error'

const Profile = () => {

  const { auth } = useAuth();

  const { username } = useParams()

  const { data: user, isPending, isError, error, isFetched } = useQuery({
    queryKey : ['profile', username],
    queryFn : async () => {
      return getProfile(username);
    }
  })
  
  const urlMySubmissions = 'findByUser/' + user?.id_user;

  const { data: subs, isPending: subsArePending, isError: subsIsError, error: subsError} = useQuery({
    queryKey: ["submissionsProfile", urlMySubmissions],
    queryFn: () => {
      const pageRequest = {
        "page": 1,
        "limit": 3
      }
      return getAllSubmissions(urlMySubmissions, pageRequest);
    },
    enabled: isFetched
  });

  const easyCount = user?.allCount?.easy;
  const mediumCount = user?.allCount?.medium;
  const hardCount = user?.allCount?.hard;

  const easySolved = user?.solvedCount?.easy;
  const mediumSolved = user?.solvedCount?.medium;
  const hardSolved = user?.solvedCount?.hard;

  const easyPercentage = easyCount ? ((easySolved / easyCount) * 100).toFixed(1) : 0;
  const mediumPercentage = mediumCount ? ((mediumSolved / mediumCount) * 100).toFixed(1) : 0;
  const hardPercentage = hardCount ? ((hardSolved / hardCount) * 100).toFixed(1) : 0;

  const allSolved = easySolved + mediumSolved + hardSolved
  const allCount = easyCount + mediumCount + hardCount
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <div className="content">
      {isPending && <div>Loading...</div>}
      {isError && <Error err={error} />}
      {!isPending && !isError && user &&
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
              {auth?.username === user.username && <Link to={`/profile/${auth?.username}/edit`}><button className="edit">Edit Profile</button></Link>}
            </div>
            <hr style={{ margin: '10px 0' }} />
            <div className='item'>
              <div className='class-title'>Languages</div>
              <div className="subitems">
                {user?.langs.map((lang, i) => (
                  <div className="subitem" key={i}>{lang?.lang} ({lang?.count})</div>
                ))}
              </div>
            </div>
            <hr style={{ margin: '10px 0' }} />
            <div className='item'>
              <div className='class-title'>Skills</div>
              <div className="subitems">
                {user?.skills.map((skill, i) => (
                  <div className="subitem" key={i}>{skill?.skill} ({skill?.count})</div>
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
                    <div className='solved-number'>{mouseOver ? ((allSolved / allCount) * 100).toFixed(1) + '%' : allSolved}</div>
                    <div>solved</div>
                  </div>
                </div>
                <div className="difficulties">
                  <div className="difficulty" title={easyPercentage + '%'}>
                    <div className="diff">
                      <div className="diff-name">Easy</div>
                      <div className="number">{easySolved}/{easyCount}</div>
                    </div>
                    <div className="bar">
                      <div className="uncolored-bar" style={{ backgroundColor: '#00800063' }}></div>
                      <div className="colored-bar" style={{ backgroundColor: 'green', width: `${easyPercentage}%` }}></div>
                    </div>
                  </div>

                  <div className="difficulty" title={mediumPercentage + '%'}>
                    <div className="diff">
                      <div className="diff-name">Medium</div>
                      <div className="number">{mediumSolved}/{mediumCount}</div>
                    </div>
                    <div className="bar" >
                      <div className="uncolored-bar" style={{ backgroundColor: '#ffa50057' }}></div>
                      <div className="colored-bar" style={{ backgroundColor: 'orange', width: `${mediumPercentage}%` }}></div>
                    </div>
                  </div>

                  <div className="difficulty" title={hardPercentage + '%'}>
                    <div className="diff">
                      <div className="diff-name">Hard</div>
                      <div className="number">{hardSolved}/{hardCount}</div>
                    </div>
                    <div className="bar" >
                      <div className="uncolored-bar" style={{ backgroundColor: '#ff000047' }}></div>
                      <div className="colored-bar" style={{ backgroundColor: 'red', width: `${hardPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-submissions">
              <div className='class-title'>
                Recent Submissions
                <Link to={`/profile/${user?.id_user}/submissions`} className='view-all'>View All &gt;</Link>
              </div>
              {subsIsError && <Error err={subsError} />}
              {subsArePending && <div>Loading...</div>}
              {!subsIsError && !subsArePending && subs && <SubmissionList submissions={subs?.rows} />}
            </div>

          </div>
        </div>
      }
    </div>
  );
}

export default Profile;