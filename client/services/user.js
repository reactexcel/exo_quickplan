// const crypto = require('crypto');
// const EXO_KEY = 'exotravel';

// let userRole;

const setUserRole = function (role) {
  if (!localStorage || !role) { return; }
  // const cipher = crypto.createCipher('aes-256-cbc', EXO_KEY)
  // let crypted = cipher.update(role,'utf8','hex')
  // crypted += cipher.final('hex');
  const crypted = role;
  localStorage.setItem('user_role', crypted);
};

const getUserRole = function () {
  if (!localStorage || !localStorage.getItem('user_role')) {
    return;
  }

  const crypted = localStorage.getItem('user_role');
  // const decipher = crypto.createDecipher('aes-256-cbc', EXO_KEY);
  // let dec = decipher.update(crypted,'hex','utf8')
  // dec += decipher.final('utf8');
  return crypted; // eslint-disable-line
};

const removeUserRole = function () {
  if (localStorage) {
    localStorage.removeItem('user_role');
  }
};

export { setUserRole, getUserRole, removeUserRole };
