import {
    GET_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    UPDATE_PROFILE,
    ACCOUNT_DELETED,
    GET_PROFILES,
    GET_REPOS,
    REMOVE_COMMENT
} from '../actions/types';
const initialState = {
    profile:null,
    profiles:[],
    repos:[],
    loading:true,
    error:{}
};
/* eslint import/no-anonymous-default-export: [2, {"allowAnonymousFunction": true}] */
export default function (state=initialState,action) {
    const { type,payload } = action;
    switch(type) {
        case UPDATE_PROFILE:
        case GET_PROFILE:
            return {
                ...state,
                profile:payload,
                loading:false
            };
        case GET_PROFILES:
            return {
                ...state,
                profiles:payload,
                loading:false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error:payload,
                loading:false,
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile:null,
                repos:[],
                loading:false
            };
        case ACCOUNT_DELETED:
            return {
                ...state,
                profiles:payload,
                loading:false
            }
        case GET_REPOS:
            return {
                ...state,
                repos:payload,
                loading:false
            };
        default:
            return state;
    }
};