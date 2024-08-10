import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment';
import { connect } from 'react-redux';
const ProfileEducation = ({ education :{
school,
degree,
fieldofstudy,
from,
to,
desciription
} }) => 
    <div>
        <h3 className="text-dark">{school}</h3>
        <p>
            <Moment format='YYYY/MM/DD'>{from}</Moment> - {to ? <Moment format='YYYY/MM/DD'>{to}</Moment> : 'Now'}
        </p>
        <p>
            <strong>Degree</strong> {degree}
        </p>
        <p>
            <strong>Field of study</strong> {fieldofstudy}
        </p>
        <p>
            <strong>Desciription</strong> {desciription}
        </p>
    </div>
  


  ProfileEducation.propTypes = {
education:PropTypes.array.isRequired
}

export default ProfileEducation
