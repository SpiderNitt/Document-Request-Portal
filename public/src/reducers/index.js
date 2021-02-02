import { combineReducers } from 'redux';

import cert_upload from './cert_upload';
import utils from './utils';

export default combineReducers({
  utils,
  cert_upload
});