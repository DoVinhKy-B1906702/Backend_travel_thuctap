# auth Api
host:/auth

## Register
/register
{
    username,
    password,
    firstName,
    lastName,
    gender: true or false,
    image set default dependence on gender
} 
if username exited return  {success: false, message :'Username đã tồn tại!! '}
if all good return {success: true, message:'User has created successfully', accessToken}

## Login
/login
{
    username,
    password
 
} 
if username or password empty return {success:false, message: 'Missing username/password'}
if your username is not exit so return {success: false, message: 'Incorrect username or password'}

if all good {success: true, message:'Logged in successfully', accessToken}
