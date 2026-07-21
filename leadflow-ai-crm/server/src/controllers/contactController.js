const Contact = require('../models/Contact');
const Activity = require('../models/Activity');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { exportToCsv } = require('../utils/csvExporter');
const { getIsConnected } = require('../config/db');
const { contacts, companies, activities } = require('../services/inMemoryStore');

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res, next) => {
  try {
    const { search, company, page = 1, limit = 10, exportCsv } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { designation: { $regex: search, $options: 'i' } },
        ];
      }
      if (company) query.company = company;

      if (exportCsv === 'true') {
        const list = await Contact.find(query).populate('company', 'name');
        const rows = list.map((c) => ({
          FirstName: c.firstName,
          LastName: c.lastName,
          Email: c.email,
          Phone: c.phone,
          Designation: c.designation,
          Company: c.company ? c.company.name : '',
          Notes: c.notes,
        }));
        const csvString = exportToCsv(rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="contacts_export.csv"');
        return res.status(200).send(csvString);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const totalItems = await Contact.countDocuments(query);
      const contactsList = await Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('company', 'name industry');

      return sendSuccess(res, 'Contacts fetched successfully', contactsList, 200, {
        totalItems,
        totalPages: Math.ceil(totalItems / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      });
    } else {
      let result = [...contacts];
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (c) =>
            c.firstName.toLowerCase().includes(s) ||
            c.lastName.toLowerCase().includes(s) ||
            c.email.toLowerCase().includes(s) ||
            c.designation.toLowerCase().includes(s)
        );
      }
      if (company) result = result.filter((c) => c.company === company);

      if (exportCsv === 'true') {
        const rows = result.map((c) => {
          const comp = companies.find((cp) => cp._id === c.company || cp.id === c.company);
          return {
            FirstName: c.firstName,
            LastName: c.lastName,
            Email: c.email,
            Phone: c.phone,
            Designation: c.designation,
            Company: comp ? comp.name : '',
            Notes: c.notes,
          };
        });
        const csvString = exportToCsv(rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="contacts_export.csv"');
        return res.status(200).send(csvString);
      }

      const totalItems = result.length;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const paginated = result.slice(skip, skip + parseInt(limit));

      const populated = paginated.map((c) => {
        const comp = companies.find((cp) => cp._id === c.company || cp.id === c.company);
        return {
          ...c,
          company: comp ? { _id: comp._id, name: comp.name, industry: comp.industry } : null,
        };
      });

      return sendSuccess(res, 'Contacts fetched successfully', populated, 200, {
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

// @desc    Get contact by ID
// @route   GET /api/contacts/:id
// @access  Private
const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const contact = await Contact.findById(id).populate('company');
      if (!contact) return sendError(res, 'Contact not found', 404);
      return sendSuccess(res, 'Contact fetched successfully', contact);
    } else {
      const contact = contacts.find((c) => c._id === id || c.id === id);
      if (!contact) return sendError(res, 'Contact not found', 404);
      const comp = companies.find((cp) => cp._id === contact.company || cp.id === contact.company);
      return sendSuccess(res, 'Contact fetched successfully', {
        ...contact,
        company: comp || null,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create contact
// @route   POST /api/contacts
// @access  Private
const createContact = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, designation, company, notes } = req.body;

    if (getIsConnected()) {
      const newContact = await Contact.create({
        firstName,
        lastName,
        email,
        phone: phone || '',
        designation: designation || '',
        company: company || null,
        notes: notes || '',
        createdBy: req.user._id,
      });

      await Activity.create({
        user: req.user._id,
        userName: req.user.name,
        type: 'CONTACT_ADDED',
        description: `Added new contact "${firstName} ${lastName}"`,
        contact: newContact._id,
      });

      return sendSuccess(res, 'Contact created successfully', newContact, 201);
    } else {
      const newContact = {
        _id: 'cnt_' + Date.now(),
        id: 'cnt_' + Date.now(),
        firstName,
        lastName,
        email,
        phone: phone || '',
        designation: designation || '',
        company: company || null,
        notes: notes || '',
        createdAt: new Date().toISOString(),
      };

      contacts.unshift(newContact);

      activities.unshift({
        _id: 'act_' + Date.now(),
        id: 'act_' + Date.now(),
        userName: req.user ? req.user.name : 'Alex Morgan',
        type: 'CONTACT_ADDED',
        description: `Added new contact "${firstName} ${lastName}"`,
        createdAt: new Date().toISOString(),
      });

      return sendSuccess(res, 'Contact created successfully', newContact, 201);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, designation, company, notes } = req.body;

    if (getIsConnected()) {
      const contact = await Contact.findById(id);
      if (!contact) return sendError(res, 'Contact not found', 404);

      if (firstName) contact.firstName = firstName;
      if (lastName) contact.lastName = lastName;
      if (email) contact.email = email;
      if (phone !== undefined) contact.phone = phone;
      if (designation !== undefined) contact.designation = designation;
      if (company !== undefined) contact.company = company || null;
      if (notes !== undefined) contact.notes = notes;

      const updated = await contact.save();
      return sendSuccess(res, 'Contact updated successfully', updated);
    } else {
      const idx = contacts.findIndex((c) => c._id === id || c.id === id);
      if (idx === -1) return sendError(res, 'Contact not found', 404);

      contacts[idx] = {
        ...contacts[idx],
        firstName: firstName || contacts[idx].firstName,
        lastName: lastName || contacts[idx].lastName,
        email: email || contacts[idx].email,
        phone: phone !== undefined ? phone : contacts[idx].phone,
        designation: designation !== undefined ? designation : contacts[idx].designation,
        company: company !== undefined ? company : contacts[idx].company,
        notes: notes !== undefined ? notes : contacts[idx].notes,
      };

      return sendSuccess(res, 'Contact updated successfully', contacts[idx]);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const contact = await Contact.findById(id);
      if (!contact) return sendError(res, 'Contact not found', 404);
      await contact.deleteOne();
      return sendSuccess(res, 'Contact deleted successfully');
    } else {
      const idx = contacts.findIndex((c) => c._id === id || c.id === id);
      if (idx === -1) return sendError(res, 'Contact not found', 404);
      contacts.splice(idx, 1);
      return sendSuccess(res, 'Contact deleted successfully');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
