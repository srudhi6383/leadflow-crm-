const validateLead = (data) => {
  const errors = {};

  if (!data.title || data.title.trim() === '') {
    errors.title = 'Lead title is required';
  }

  if (data.value !== undefined && data.value !== null && isNaN(data.value)) {
    errors.value = 'Lead value must be a valid number';
  }

  const validStatuses = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
  }

  const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
  if (data.priority && !validPriorities.includes(data.priority)) {
    errors.priority = `Priority must be one of: ${validPriorities.join(', ')}`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = { validateLead };
