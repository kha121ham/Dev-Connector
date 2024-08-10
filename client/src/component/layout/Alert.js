import React from 'react';
import ProbTypes from 'prop-types';
import { connect } from 'react-redux';
const Alert = ({ alerts }) => alerts !==null && alerts.length >0 && alerts.map(alert=> (
<div key = {alert.id} className={`alert alert-${alert.alertType}`}>
  {alert.msg}
</div>));



Alert.probTypes = {
  alerts:ProbTypes.array.isRequired
}

const mapStateToProbs = state => ({
  alerts:state.alert
});

export default connect(mapStateToProbs) (Alert)
