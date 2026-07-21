const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Contact = require('../models/Contact');
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');
const { connectDB } = require('../config/db');

const seedData = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log('Database not connected. Skipping MongoDB seed operation.');
      process.exit(0);
    }

    // Clear collections
    await User.deleteMany();
    await Company.deleteMany();
    await Contact.deleteMany();
    await Lead.deleteMany();
    await Activity.deleteMany();

    console.log('Cleared existing MongoDB collections.');

    // Create Admin User
    const adminUser = await User.create({
      name: 'Alex Morgan',
      email: 'admin@leadflow.ai',
      password: 'password123',
      role: 'Admin',
      title: 'VP of Global Sales',
      phone: '+1 (555) 019-2834',
    });

    const salesUser1 = await User.create({
      name: 'Sarah Chen',
      email: 'sarah.chen@leadflow.ai',
      password: 'password123',
      role: 'Sales',
      title: 'Senior Enterprise AE',
      phone: '+1 (555) 014-9921',
    });

    const salesUser2 = await User.create({
      name: 'Marcus Vance',
      email: 'marcus.vance@leadflow.ai',
      password: 'password123',
      role: 'Sales',
      title: 'Account Executive',
      phone: '+1 (555) 017-4482',
    });

    console.log('Created Seed Users.');

    // Create Companies
    const company1 = await Company.create({
      name: 'Acme Global Tech',
      industry: 'Enterprise Software',
      employees: 450,
      revenue: 12500000,
      website: 'https://acmeglobaltech.com',
      email: 'contact@acmeglobaltech.com',
      phone: '+1 (800) 555-0199',
      address: '100 Technology Way, San Francisco, CA',
      createdBy: adminUser._id,
    });

    const company2 = await Company.create({
      name: 'Apex Financial Services',
      industry: 'Fintech & Banking',
      employees: 1200,
      revenue: 45000000,
      website: 'https://apexfinancial.com',
      email: 'info@apexfinancial.com',
      phone: '+1 (888) 555-0144',
      address: '25 Wall Street, New York, NY',
      createdBy: adminUser._id,
    });

    const company3 = await Company.create({
      name: 'Starlight BioHealth',
      industry: 'Healthcare & Biotech',
      employees: 180,
      revenue: 8200000,
      website: 'https://starlightbio.com',
      email: 'partners@starlightbio.com',
      phone: '+1 (800) 555-0177',
      address: '450 Innovation Blvd, Boston, MA',
      createdBy: adminUser._id,
    });

    console.log('Created Seed Companies.');

    // Create Contacts
    const contact1 = await Contact.create({
      firstName: 'David',
      lastName: 'Miller',
      email: 'david.miller@acmeglobaltech.com',
      phone: '+1 (555) 234-5678',
      designation: 'Chief Technology Officer',
      company: company1._id,
      notes: 'Key decision maker for Q3 infrastructure overhaul.',
      createdBy: adminUser._id,
    });

    const contact2 = await Contact.create({
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'elena.r@apexfinancial.com',
      phone: '+1 (555) 876-5432',
      designation: 'VP of Operations',
      company: company2._id,
      notes: 'Interested in AI CRM compliance features.',
      createdBy: adminUser._id,
    });

    console.log('Created Seed Contacts.');

    // Create Leads
    const lead1 = await Lead.create({
      title: 'Enterprise AI Suite Expansion',
      value: 85000,
      status: 'Proposal',
      priority: 'High',
      source: 'LinkedIn',
      company: company1._id,
      contact: contact1._id,
      assignedTo: salesUser1._id,
      notes: [
        {
          text: 'Sent customized proposal for 120 user licenses with premium SLA support.',
          author: 'Sarah Chen',
        },
      ],
      expectedCloseDate: new Date('2026-08-15'),
      createdBy: adminUser._id,
    });

    const lead2 = await Lead.create({
      title: 'Fintech Compliance Workflow Integration',
      value: 120000,
      status: 'Qualified',
      priority: 'Urgent',
      source: 'Referral',
      company: company2._id,
      contact: contact2._id,
      assignedTo: salesUser1._id,
      notes: [
        {
          text: 'Completed SOC2 security compliance review.',
          author: 'Sarah Chen',
        },
      ],
      expectedCloseDate: new Date('2026-08-30'),
      createdBy: adminUser._id,
    });

    console.log('Created Seed Leads.');

    // Create Activities
    await Activity.create({
      user: salesUser1._id,
      userName: salesUser1.name,
      type: 'STATUS_CHANGE',
      description: 'Updated lead "Enterprise AI Suite Expansion" status to Proposal',
      lead: lead1._id,
    });

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
