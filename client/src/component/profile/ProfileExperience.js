import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment';
import { connect } from 'react-redux';
const ProfileExperience = ({ expereince :{
    company,
    title,
    location,
    current,
    to,
    from,
    desciription
} }) => 
    <div>
        <h3 className="text-dark">{company}</h3>
        <p>
            <Moment format='YYYY/MM/DD'>{from}</Moment> - {to ? <Moment format='YYYY/MM/DD'>{to}</Moment> : 'Now'}
        </p>
        <p>
            <strong>Position</strong> {title}
        </p>
        <p>
            <strong>Desciription</strong> {desciription}
        </p>
    </div>
  


ProfileExperience.propTypes = {
experience:PropTypes.array.isRequired
}

export default ProfileExperience;
