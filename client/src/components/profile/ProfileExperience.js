import React from 'react';
import { PropTypes } from 'prop-types';
import { Moment } from 'react-moment';

const ProfileExperience = ({
  experience: { comapny, title, location, current, to, from, description },
}) => (
  <div>
    <h3 className='tect-dark'>{comapny}</h3>
    <p>
      <Moment format='YYYY/MM/DD'>{from}</Moment> -{' '}
      {!to ? 'now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
    </p>
    <p>
      <strong>Position:</strong> {title}
    </p>
    <p>
      <strong>Description:</strong> {description}
    </p>
  </div>
);

ProfileExperience.propTypes = {
  experience: PropTypes.array.isRequired,
};

export default ProfileExperience;
