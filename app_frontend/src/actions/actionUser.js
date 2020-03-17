
const addUser = (token,email,uid) => ({
    type:"ADD_USER",
    token:token,
    email : email,
    uid:uid
  })

export default addUser;  
