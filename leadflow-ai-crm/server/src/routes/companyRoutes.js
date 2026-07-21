const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { validateCompany } = require('../validators/companyValidator');

router.route('/')
  .get(protect, getCompanies)
  .post(protect, validate(validateCompany), createCompany);

router.route('/:id')
  .get(protect, getCompanyById)
  .put(protect, updateCompany)
  .delete(protect, deleteCompany);

module.exports = router;
