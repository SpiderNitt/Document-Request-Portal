import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AlumniLogin from './alumni-login';
import AlumniRegister from './alumni-registration';

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const [login, loginBool] = React.useState(true);
  const [register, registerBool] = React.useState(false);
  return (
    <div className='alumni'>
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        if(newValue==1){
            registerBool(true);
            loginBool(false);
        }
        if(newValue==0){
            registerBool(false);
            loginBool(true);
        }
      }}
      showLabels
      className='topBar'
    >
      <BottomNavigationAction label="Login"  />
      <BottomNavigationAction label="Register" />
    </BottomNavigation>
    
    {login && <AlumniLogin/>}
    {register && <AlumniRegister/>} 
    </div>

  );
}