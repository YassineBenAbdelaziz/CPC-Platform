import ProblemList from './ProblemList';
import profileImage from './imgs/blank-profile-picture-973460_1280.webp'
import useFetch from './useFetch';

const Profile = () => {

  const url = "http://localhost:5000/";

  const { data: problemset, isPending, error } = useFetch(url + 'problem');
  const problems = problemset && problemset.slice(0, 2);

  const easyCount = 750;
  const mediumCount = 500;
  const hardCount = 250;

  const easySolved = 450;
  const mediumSolved = 123;
  const hardSolved = 18;

  return (
    <div className="content">
      <div className="profile-content">
        <div className="sidebar1">
          <div className="profile">
            <div className="profile-details">
              <img className="profile-img" src={profileImage} alt="" />
              <div className="info">
                <div className="name">rami_jebali</div>
                <div className="rank">
                  Score
                  <h4>2000</h4>
                </div>
                <div className="rank">
                  Rank
                  <h4>12345</h4>
                </div>
              </div>
            </div>
            <button className="edit">Edit Profile</button>
          </div>
          <hr style={{ margin: '10px 0' }} />
          <div className='item'>
            <div className='class-title'>Languages</div>
            <div className="subitems">
              <div className="subitem">Python 10</div>
              <div className="subitem">C++ 13</div>
              <div className="subitem">C 2</div>
              <div className="subitem">Java 2</div>
            </div>
          </div>
          <hr style={{ margin: '10px 0' }} />
          <div className='item'>
            <div className='class-title'>Skills</div>
            <div className="subitems">
              <div className="subitem">dp 2</div>
              <div className="subitem">math 2</div>
              <div className="subitem">graph 2</div>
              <div className="subitem">greedy 2</div>
            </div>
          </div>
        </div>

        <div className="sidebar2">
          <div className="solved-problems">
            <div className='class-title'>Solved Problems</div>
            <div className="solved-details">
              <div className='solved-pourcentage'>
                <div>
                  <div className='solved-number'>{easySolved + mediumSolved + hardSolved}</div>
                  <div>solved</div>
                </div>
              </div>
              <div className="difficulties">
                <div className="difficulty">
                  <div className="diff">
                    <div className="diff-name">Easy</div>
                    <div className="number">{easySolved}/{easyCount}</div>
                  </div>
                  <div className="bar">
                    <div className="uncolored-bar" style={{ backgroundColor: '#00800063' }}></div>
                    <div className="colored-bar" style={{ backgroundColor: 'green', width: `${(easySolved / easyCount) * 100}%` }}></div>
                  </div>
                </div>

                <div className="difficulty">
                  <div className="diff">
                    <div className="diff-name">Medium</div>
                    <div className="number">{mediumSolved}/{mediumCount}</div>
                  </div>
                  <div className="bar">
                    <div className="uncolored-bar" style={{ backgroundColor: '#ffa50057' }}></div>
                    <div className="colored-bar" style={{ backgroundColor: 'orange', width: `${(mediumSolved / mediumCount) * 100}%` }}></div>
                  </div>
                </div>

                <div className="difficulty">
                  <div className="diff">
                    <div className="diff-name">Hard</div>
                    <div className="number">{hardSolved}/{hardCount}</div>
                  </div>
                  <div className="bar">
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
              <div className='view-all'>View All Submissions &gt;</div>
            </div>
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {problemset && <ProblemList problemset={problems} title="" titlePrefixe={true} />}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;