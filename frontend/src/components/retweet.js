// import React from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { BASE_URL } from '../config';
// const CONFIG_OBJ = {
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": "Bearer " + localStorage.getItem("token")
//     }
// }
// const retweetTweet = async (tweetId) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/api/v1/tweet/retweet/${tweetId}`,{},CONFIG_OBJ);
//    console.log(response);
//     if (response.status === 200) {
//       toast.success('Tweet retweeted successfully');
//     }
//   } catch (error) {
//     console.error('Error retweeting tweet:', error);
//     toast.error('Failed to retweet tweet');
//   }
// };

// const TweetComponent = ({ tweet }) => {
//   return (
//     <div>
//       {/* <p>{tweet.content}</p> */}
//       <button onClick={() => retweetTweet(tweet?._id)}>Retweet</button>
//       {tweet && tweet.isRetweeted && (
//         <p style={{ color: 'green' }}>Retweeted by {tweet.retweets}</p>
//       )}
//     </div>
//   );
// };

// export default TweetComponent;
import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../config';

const CONFIG_OBJ = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
}

const retweetTweet = async (tweetId) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/tweet/retweet/${tweetId}`, {}, CONFIG_OBJ);
    console.log(response);
    if (response.status === 200) {
      toast.success('Tweet retweeted successfully');
    }
  } catch (error) {
    console.error('Error retweeting tweet:', error);
    toast.error('Failed to retweet tweet');
  }
};

const TweetComponent = ({ tweet }) => {
  return (
    <div>
      {/* <p>{tweet.content}</p> */}
      <button onClick={() => retweetTweet(tweet?._id)}>Retweet</button>
      {tweet && tweet.isRetweeted && (
        <div>
          <p style={{ color: 'green' }}>Retweeted by:</p>
          <ul>
            {tweet.retweets.map((retweet, index) => (
              <li key={index}>{retweet.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TweetComponent;
