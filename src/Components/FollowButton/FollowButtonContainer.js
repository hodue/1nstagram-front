import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import { FOLLOW, UNFOLLOW } from './FollowButtonQuries';
import FollowButtonPresenter from './FollowButtonPresenter';

const FollowButtonContainer = ({ isFollowing, id }) => {
  const [isFollowingS, setIsFollowingS] = useState(isFollowing);
  const [followMutation] = useMutation(FOLLOW, { variables: { id }});
  const [unfollowMutation] = useMutation(UNFOLLOW, { variables: { id }});

  const onClick = () => {
    if(isFollowingS === true) {
      setIsFollowingS(false);
      unfollowMutation();
    } else {
      setIsFollowingS(true);
      followMutation();
    }
  };
  return <FollowButtonPresenter onClick={onClick} isFollowing={isFollowingS} />;
};

FollowButtonContainer.propTypes = {
  isFollowing: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired
};

export default FollowButtonContainer;