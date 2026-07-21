const Lead = require('../models/Lead');
const Activity = require('../models/Activity');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { exportToCsv } = require('../utils/csvExporter');
const { getIsConnected } = require('../config/db');
const { leads, companies, contacts, activities } = require('../services/inMemoryStore');

// @desc    Get all leads (with search, filter, pagination, sorting)
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      source,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      exportCsv,
    } = req.query;

    if (getIsConnected()) {
      let query = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
        ];
      }

      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (source) query.source = source;

      if (exportCsv === 'true') {
        const exportData = await Lead.find(query)
          .populate('company', 'name')
          .populate('contact', 'firstName lastName email')
          .populate('assignedTo', 'name');

        const csvRows = exportData.map((l) => ({
          Title: l.title,
          Value: l.value,
          Status: l.status,
          Priority: l.priority,
          Source: l.source,
          Company: l.company ? l.company.name : '',
          Contact: l.contact ? `${l.contact.firstName} ${l.contact.lastName}` : '',
          AssignedTo: l.assignedTo ? l.assignedTo.name : '',
          ExpectedCloseDate: l.expectedCloseDate ? l.expectedCloseDate.toISOString().split('T')[0] : '',
          CreatedAt: l.createdAt ? l.createdAt.toISOString() : '',
        }));

        const csvString = exportToCsv(csvRows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="leads_export.csv"');
        return res.status(200).send(csvString);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sortOptions = {};
      sortOptions[sortBy] = order === 'asc' ? 1 : -1;

      const totalItems = await Lead.countDocuments(query);
      const leadsList = await Lead.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('company', 'name industry')
        .populate('contact', 'firstName lastName email phone')
        .populate('assignedTo', 'name email avatar');

      const totalPages = Math.ceil(totalItems / parseInt(limit));

      return sendSuccess(res, 'Leads fetched successfully', leadsList, 200, {
        totalItems,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      });
    } else {
      // In-memory fallback mode
      let result = [...leads];

      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (l) => l.title.toLowerCase().includes(s) || l.source.toLowerCase().includes(s)
        );
      }

      if (status) result = result.filter((l) => l.status === status);
      if (priority) result = result.filter((l) => l.priority === priority);
      if (source) result = result.filter((l) => l.source === source);

      // Sorting
      result.sort((a, b) => {
        let valA = a[sortBy] || '';
        let valB = b[sortBy] || '';
        if (order === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });

      if (exportCsv === 'true') {
        const csvRows = result.map((l) => {
          const comp = companies.find((c) => c._id === l.company || c.id === l.company);
          const cnt = contacts.find((c) => c._id === l.contact || c.id === l.contact);
          return {
            Title: l.title,
            Value: l.value,
            Status: l.status,
            Priority: l.priority,
            Source: l.source,
            Company: comp ? comp.name : '',
            Contact: cnt ? `${cnt.firstName} ${cnt.lastName}` : '',
            ExpectedCloseDate: l.expectedCloseDate || '',
            CreatedAt: l.createdAt || '',
          };
        });

        const csvString = exportToCsv(csvRows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="leads_export.csv"');
        return res.status(200).send(csvString);
      }

      const totalItems = result.length;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const paginated = result.slice(skip, skip + parseInt(limit));

      // Populate references
      const populated = paginated.map((l) => {
        const comp = companies.find((c) => c._id === l.company || c.id === l.company);
        const cnt = contacts.find((c) => c._id === l.contact || c.id === l.contact);
        return {
          ...l,
          company: comp ? { _id: comp._id, name: comp.name, industry: comp.industry } : null,
          contact: cnt ? { _id: cnt._id, firstName: cnt.firstName, lastName: cnt.lastName, email: cnt.email, phone: cnt.phone } : null,
          assignedTo: { _id: 'usr_admin', name: 'Alex Morgan', avatar: '' },
        };
      });

      const totalPages = Math.ceil(totalItems / parseInt(limit));

      return sendSuccess(res, 'Leads fetched successfully', populated, 200, {
        totalItems,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const lead = await Lead.findById(id)
        .populate('company')
        .populate('contact')
        .populate('assignedTo', 'name email avatar title');

      if (!lead) {
        return sendError(res, 'Lead not found', 404);
      }
      return sendSuccess(res, 'Lead retrieved successfully', lead);
    } else {
      const lead = leads.find((l) => l._id === id || l.id === id);
      if (!lead) {
        return sendError(res, 'Lead not found', 404);
      }

      const comp = companies.find((c) => c._id === lead.company || c.id === lead.company);
      const cnt = contacts.find((c) => c._id === lead.contact || c.id === lead.contact);

      const populated = {
        ...lead,
        company: comp || null,
        contact: cnt || null,
        assignedTo: { _id: 'usr_admin', name: 'Alex Morgan', title: 'VP of Global Sales' },
      };

      return sendSuccess(res, 'Lead retrieved successfully', populated);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res, next) => {
  try {
    const { title, value, status, priority, source, company, contact, assignedTo, notes, expectedCloseDate } = req.body;

    if (getIsConnected()) {
      const newLead = await Lead.create({
        title,
        value: Number(value) || 0,
        status: status || 'New',
        priority: priority || 'Medium',
        source: source || 'Website',
        company: company || null,
        contact: contact || null,
        assignedTo: assignedTo || req.user._id,
        notes: notes ? [{ text: notes, author: req.user.name }] : [],
        expectedCloseDate: expectedCloseDate || null,
        createdBy: req.user._id,
      });

      await Activity.create({
        user: req.user._id,
        userName: req.user.name,
        type: 'LEAD_CREATED',
        description: `Created new lead "${title}" ($${Number(value || 0).toLocaleString()})`,
        lead: newLead._id,
      });

      return sendSuccess(res, 'Lead created successfully', newLead, 201);
    } else {
      const newLead = {
        _id: 'led_' + Date.now(),
        id: 'led_' + Date.now(),
        title,
        value: Number(value) || 0,
        status: status || 'New',
        priority: priority || 'Medium',
        source: source || 'Website',
        company: company || null,
        contact: contact || null,
        assignedTo: assignedTo || 'usr_admin',
        notes: notes ? [{ id: 'n_' + Date.now(), text: notes, author: req.user ? req.user.name : 'Alex Morgan', createdAt: new Date().toISOString() }] : [],
        expectedCloseDate: expectedCloseDate || null,
        createdAt: new Date().toISOString(),
      };

      leads.unshift(newLead);

      activities.unshift({
        _id: 'act_' + Date.now(),
        id: 'act_' + Date.now(),
        userName: req.user ? req.user.name : 'Alex Morgan',
        type: 'LEAD_CREATED',
        description: `Created new lead "${title}" ($${Number(value || 0).toLocaleString()})`,
        createdAt: new Date().toISOString(),
      });

      return sendSuccess(res, 'Lead created successfully', newLead, 201);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, value, status, priority, source, company, contact, assignedTo, expectedCloseDate } = req.body;

    if (getIsConnected()) {
      const lead = await Lead.findById(id);
      if (!lead) {
        return sendError(res, 'Lead not found', 404);
      }

      const statusChanged = status && status !== lead.status;

      if (title !== undefined) lead.title = title;
      if (value !== undefined) lead.value = Number(value);
      if (status !== undefined) lead.status = status;
      if (priority !== undefined) lead.priority = priority;
      if (source !== undefined) lead.source = source;
      if (company !== undefined) lead.company = company || null;
      if (contact !== undefined) lead.contact = contact || null;
      if (assignedTo !== undefined) lead.assignedTo = assignedTo || null;
      if (expectedCloseDate !== undefined) lead.expectedCloseDate = expectedCloseDate;

      const updated = await lead.save();

      if (statusChanged) {
        await Activity.create({
          user: req.user._id,
          userName: req.user.name,
          type: 'STATUS_CHANGE',
          description: `Changed status of "${lead.title}" to ${status}`,
          lead: lead._id,
        });
      }

      return sendSuccess(res, 'Lead updated successfully', updated);
    } else {
      const idx = leads.findIndex((l) => l._id === id || l.id === id);
      if (idx === -1) {
        return sendError(res, 'Lead not found', 404);
      }

      const lead = leads[idx];
      const statusChanged = status && status !== lead.status;

      leads[idx] = {
        ...lead,
        title: title !== undefined ? title : lead.title,
        value: value !== undefined ? Number(value) : lead.value,
        status: status !== undefined ? status : lead.status,
        priority: priority !== undefined ? priority : lead.priority,
        source: source !== undefined ? source : lead.source,
        company: company !== undefined ? company : lead.company,
        contact: contact !== undefined ? contact : lead.contact,
        assignedTo: assignedTo !== undefined ? assignedTo : lead.assignedTo,
        expectedCloseDate: expectedCloseDate !== undefined ? expectedCloseDate : lead.expectedCloseDate,
      };

      if (statusChanged) {
        activities.unshift({
          _id: 'act_' + Date.now(),
          id: 'act_' + Date.now(),
          userName: req.user ? req.user.name : 'Alex Morgan',
          type: 'STATUS_CHANGE',
          description: `Changed status of "${lead.title}" to ${status}`,
          createdAt: new Date().toISOString(),
        });
      }

      return sendSuccess(res, 'Lead updated successfully', leads[idx]);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add note to a lead
// @route   POST /api/leads/:id/notes
// @access  Private
const addLeadNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return sendError(res, 'Note content is required', 400);
    }

    if (getIsConnected()) {
      const lead = await Lead.findById(id);
      if (!lead) {
        return sendError(res, 'Lead not found', 404);
      }

      lead.notes.unshift({
        text,
        author: req.user.name,
      });

      await lead.save();

      await Activity.create({
        user: req.user._id,
        userName: req.user.name,
        type: 'NOTE_ADDED',
        description: `Added a note to lead "${lead.title}"`,
        lead: lead._id,
      });

      return sendSuccess(res, 'Note added successfully', lead.notes);
    } else {
      const idx = leads.findIndex((l) => l._id === id || l.id === id);
      if (idx === -1) {
        return sendError(res, 'Lead not found', 404);
      }

      const newNote = {
        id: 'n_' + Date.now(),
        text,
        author: req.user ? req.user.name : 'Alex Morgan',
        createdAt: new Date().toISOString(),
      };

      leads[idx].notes.unshift(newNote);

      activities.unshift({
        _id: 'act_' + Date.now(),
        id: 'act_' + Date.now(),
        userName: req.user ? req.user.name : 'Alex Morgan',
        type: 'NOTE_ADDED',
        description: `Added a note to lead "${leads[idx].title}"`,
        createdAt: new Date().toISOString(),
      });

      return sendSuccess(res, 'Note added successfully', leads[idx].notes);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const lead = await Lead.findById(id);
      if (!lead) {
        return sendError(res, 'Lead not found', 404);
      }

      await lead.deleteOne();
      return sendSuccess(res, 'Lead deleted successfully');
    } else {
      const idx = leads.findIndex((l) => l._id === id || l.id === id);
      if (idx === -1) {
        return sendError(res, 'Lead not found', 404);
      }

      leads.splice(idx, 1);
      return sendSuccess(res, 'Lead deleted successfully');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  addLeadNote,
  deleteLead,
};
