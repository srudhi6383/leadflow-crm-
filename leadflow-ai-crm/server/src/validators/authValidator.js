const validateRegister = (data) => {
  const errors = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Full name is required';
  }

  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email address is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Invalid email address format';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateLogin = (data) => {
  const errors = {};

  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email address is required';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateRegister,
  validateLogin,
};
