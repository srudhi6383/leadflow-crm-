const Company = require('../models/Company');
const Activity = require('../models/Activity');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { exportToCsv } = require('../utils/csvExporter');
const { getIsConnected } = require('../config/db');
const { companies, activities } = require('../services/inMemoryStore');

// @desc    Get all companies (search, pagination, industry filter)
// @route   GET /api/companies
// @access  Private
const getCompanies = async (req, res, next) => {
  try {
    const { search, industry, page = 1, limit = 10, exportCsv } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { industry: { $regex: search, $options: 'i' } },
        ];
      }
      if (industry) query.industry = industry;

      if (exportCsv === 'true') {
        const list = await Company.find(query);
        const rows = list.map((c) => ({
          Name: c.name,
          Industry: c.industry,
          Employees: c.employees,
          Revenue: c.revenue,
          Website: c.website,
          Email: c.email,
          Phone: c.phone,
          Address: c.address,
        }));
        const csvString = exportToCsv(rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="companies_export.csv"');
        return res.status(200).send(csvString);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const totalItems = await Company.countDocuments(query);
      const companiesList = await Company.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      return sendSuccess(res, 'Companies fetched successfully', companiesList, 200, {
        totalItems,
        totalPages: Math.ceil(totalItems / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      });
    } else {
      let result = [...companies];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (c) => c.name.toLowerCase().includes(s) || c.industry.toLowerCase().includes(s)
        );
      }
      if (industry) result = result.filter((c) => c.industry === industry);

      if (exportCsv === 'true') {
        const rows = result.map((c) => ({
          Name: c.name,
          Industry: c.industry,
          Employees: c.employees,
          Revenue: c.revenue,
          Website: c.website,
          Email: c.email,
          Phone: c.phone,
          Address: c.address,
        }));
        const csvString = exportToCsv(rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="companies_export.csv"');
        return res.status(200).send(csvString);
      }

      const totalItems = result.length;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const paginated = result.slice(skip, skip + parseInt(limit));

      return sendSuccess(res, 'Companies fetched successfully', paginated, 200, {
        totalItems,
        totalPages: Math.ceil(totalItems / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const company = await Company.findById(id);
      if (!company) return sendError(res, 'Company not found', 404);
      return sendSuccess(res, 'Company fetched successfully', company);
    } else {
      const company = companies.find((c) => c._id === id || c.id === id);
      if (!company) return sendError(res, 'Company not found', 404);
      return sendSuccess(res, 'Company fetched successfully', company);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new company
// @route   POST /api/companies
// @access  Private
const createCompany = async (req, res, next) => {
  try {
    const { name, industry, employees, revenue, website, email, phone, address } = req.body;

    if (getIsConnected()) {
      const newCompany = await Company.create({
        name,
        industry,
        employees: Number(employees) || 0,
        revenue: Number(revenue) || 0,
        website: website || '',
        email: email || '',
        phone: phone || '',
        address: address || '',
        createdBy: req.user._id,
      });

      await Activity.create({
        user: req.user._id,
        userName: req.user.name,
        type: 'COMPANY_ADDED',
        description: `Added new company "${name}"`,
        company: newCompany._id,
      });

      return sendSuccess(res, 'Company created successfully', newCompany, 201);
    } else {
      const newCompany = {
        _id: 'cmp_' + Date.now(),
        id: 'cmp_' + Date.now(),
        name,
        industry,
        employees: Number(employees) || 0,
        revenue: Number(revenue) || 0,
        website: website || '',
        email: email || '',
        phone: phone || '',
        address: address || '',
        createdAt: new Date().toISOString(),
      };

      companies.unshift(newCompany);

      activities.unshift({
        _id: 'act_' + Date.now(),
        id: 'act_' + Date.now(),
        userName: req.user ? req.user.name : 'Alex Morgan',
        type: 'COMPANY_ADDED',
        description: `Added new company "${name}"`,
        createdAt: new Date().toISOString(),
      });

      return sendSuccess(res, 'Company created successfully', newCompany, 201);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private
const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, industry, employees, revenue, website, email, phone, address } = req.body;

    if (getIsConnected()) {
      const company = await Company.findById(id);
      if (!company) return sendError(res, 'Company not found', 404);

      if (name) company.name = name;
      if (industry) company.industry = industry;
      if (employees !== undefined) company.employees = Number(employees);
      if (revenue !== undefined) company.revenue = Number(revenue);
      if (website !== undefined) company.website = website;
      if (email !== undefined) company.email = email;
      if (phone !== undefined) company.phone = phone;
      if (address !== undefined) company.address = address;

      const updated = await company.save();
      return sendSuccess(res, 'Company updated successfully', updated);
    } else {
      const idx = companies.findIndex((c) => c._id === id || c.id === id);
      if (idx === -1) return sendError(res, 'Company not found', 404);

      companies[idx] = {
        ...companies[idx],
        name: name || companies[idx].name,
        industry: industry || companies[idx].industry,
        employees: employees !== undefined ? Number(employees) : companies[idx].employees,
        revenue: revenue !== undefined ? Number(revenue) : companies[idx].revenue,
        website: website !== undefined ? website : companies[idx].website,
        email: email !== undefined ? email : companies[idx].email,
        phone: phone !== undefined ? phone : companies[idx].phone,
        address: address !== undefined ? address : companies[idx].address,
      };

      return sendSuccess(res, 'Company updated successfully', companies[idx]);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private
const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const company = await Company.findById(id);
      if (!company) return sendError(res, 'Company not found', 404);
      await company.deleteOne();
      return sendSuccess(res, 'Company deleted successfully');
    } else {
      const idx = companies.findIndex((c) => c._id === id || c.id === id);
      if (idx === -1) return sendError(res, 'Company not found', 404);
      companies.splice(idx, 1);
      return sendSuccess(res, 'Company deleted successfully');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
};
