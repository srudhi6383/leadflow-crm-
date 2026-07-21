const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  addLeadNote,
  deleteLead,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { validateLead } = require('../validators/leadValidator');

router.route('/')
  .get(protect, getLeads)
  .post(protect, validate(validateLead), createLead);

router.route('/:id')
  .get(protect, getLeadById)
  .put(protect, updateLead)
  .delete(protect, deleteLead);

router.post('/:id/notes', protect, addLeadNote);

module.exports = router;
