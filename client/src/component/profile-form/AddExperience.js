import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addExperience } from '../../actions/profile';
import { getCurrentProfile } from '../../actions/profile';

const AddExperience = ({ addExperience, profile: { loading , profile }, getCurrentProfile }) => {
const [formData, setFormData] = useState({
    company:'',
    title:'',
    location:'',
    from:'',
    to:'',
    current:false,
    description:'',
}) ;
const [toDateDisabled, toggleDisabled] = useState(false);
const { company, title, location, from, to, current, description } = formData;
useEffect(()=>{
  getCurrentProfile();
  setFormData({
    company:loading || !profile.experience.company ? '' : profile.experience.company,
    title:loading || !profile.experience.title ? '' : profile.experience.title,
    location:loading || !profile.experience.location ? '' : profile.experience.location,
    from:loading || !profile.experience.from ? '' : profile.experience.from,
    to:loading || !profile.experience.to ? '' : profile.experience.to,
    current:loading || !profile.experience.current ? '' : profile.experience.current,
    description:loading || !profile.experience.description ? '' : profile.experience.description,
})
},[getCurrentProfile])
const onChange= e => setFormData({ ...formData,[e.target.name]:e.target.value })
  return (
    <Fragment>
         <h1 class="large text-primary">
       Add An Experience
      </h1>
      <p class="lead">
        <i class="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form class="form" onSubmit={e=>{
        e.preventDefault();
        addExperience(formData);
      }}>
        <div class="form-group">
          <input type="text" placeholder="* Job Title" name="title" required value={title} onChange={e=>onChange(e)}/>
        </div>
        <div class="form-group">
          <input type="text" placeholder="* Company" name="company" required value={company} onChange={e=>onChange(e)}/>
        </div>
        <div class="form-group">
          <input type="text" placeholder="Location" name="location" value={location} onChange={e=>onChange(e)} />
        </div>
        <div class="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={e=>onChange(e)} />
        </div>
         <div class="form-group">
          <p><input type="checkbox" name="current" checked={current} value={current} onChange={
            e=>{
                setFormData({ ...formData, current:!current });
                toggleDisabled(!toDateDisabled);
            }
          } /> {' '}Current Job</p>
        </div>
        <div class="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange={e=>onChange(e)} disabled={toDateDisabled ? 'disabled' : '' } />
        </div>
        <div class="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Job Description"
            value={description} onChange={e=>onChange(e)}
          ></textarea>
        </div>
        <input type="submit" class="btn btn-primary my-1" />
        <a class="btn btn-light my-1" href="dashboard.html">Go Back</a>
      </form>
    </Fragment>
  )
}

AddExperience.propTypes = {
  addExperience:PropTypes.func.isRequired,
  getCurrentProfile:PropTypes.func.isRequired
}

const mapStateToProps = state =>({
  profile:state.profile
})

export default connect(mapStateToProps, { addExperience, getCurrentProfile }) (AddExperience);
