const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
      default: 'Team Member',
    },
    type: {
      type: String,
      enum: [
        'LEAD_CREATED',
        'LEAD_UPDATED',
        'STATUS_CHANGE',
        'NOTE_ADDED',
        'COMPANY_ADDED',
        'CONTACT_ADDED',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Activity', activitySchema);
