const validateCompany = (data) => {
  const errors = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Company name is required';
  }

  if (!data.industry || data.industry.trim() === '') {
    errors.industry = 'Industry is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = { validateCompany };
