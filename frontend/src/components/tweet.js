import React from 'react';

const Tweet = ({ tweetData }) => {
  return (
    <div>
      <p>{tweetData.content}</p>
      {tweetData.retweets.length > 0 && (
        <p>
          Retweeted by: {tweetData.retweets.map((userId) => userId.name).join(', ')}
        </p>
      )}
      {/* ... other tweet details ... */}
    </div>
  );
};

export default Tweet;