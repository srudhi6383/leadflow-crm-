import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Send,
  MessageSquare,
  Building2,
  User,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { TableSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { leadService } from '../services/leadService';
import { companyService } from '../services/companyService';
import { contactService } from '../services/contactService';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import { useToast } from '../contexts/ToastContext';
import { formatCurrency, formatDate, getStatusBadgeStyle, getPriorityBadgeStyle } from '../utils/formatters';
import { downloadCsvBlob } from '../utils/exportCsv';

export const Leads = () => {
  const toast = useToast();

  const [leads, setLeads] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  // Pagination hook
  const { page, setPage, limit, totalPages, totalItems, updatePaginationMeta } = usePagination(1, 10);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Note input state for view modal
  const [noteText, setNoteText] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await leadService.getLeads({
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        source: sourceFilter,
        page,
        limit,
      });

      if (res.success) {
        setLeads(res.data || []);
        if (res.pagination) {
          updatePaginationMeta(res.pagination);
        }
      }
    } catch (err) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [compRes, cntRes] = await Promise.all([
        companyService.getCompanies({ limit: 100 }),
        contactService.getContacts({ limit: 100 }),
      ]);
      if (compRes.success) setCompanies(compRes.data || []);
      if (cntRes.success) setContacts(cntRes.data || []);
    } catch (err) {
      console.warn('Could not load company/contact dropdowns');
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [debouncedSearch, statusFilter, priorityFilter, sourceFilter, page]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleOpenAdd = () => {
    setEditingLead(null);
    reset({
      title: '',
      value: '',
      status: 'New',
      priority: 'Medium',
      source: 'Website',
      company: '',
      contact: '',
      notes: '',
      expectedCloseDate: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lead) => {
    setEditingLead(lead);
    reset({
      title: lead.title,
      value: lead.value,
      status: lead.status,
      priority: lead.priority,
      source: lead.source,
      company: lead.company?._id || lead.company?.id || lead.company || '',
      contact: lead.contact?._id || lead.contact?.id || lead.contact || '',
      expectedCloseDate: lead.expectedCloseDate ? new Date(lead.expectedCloseDate).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const onSubmitForm = async (formData) => {
    setActionLoading(true);
    try {
      if (editingLead) {
        await leadService.updateLead(editingLead._id || editingLead.id, formData);
        toast.success('Lead updated successfully');
      } else {
        await leadService.createLead(formData);
        toast.success('Lead created successfully');
      }
      setIsModalOpen(false);
      fetchLeads();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setActionLoading(true);
    try {
      await leadService.deleteLead(deletingId);
      toast.success('Lead deleted successfully');
      setDeletingId(null);
      fetchLeads();
    } catch (err) {
      toast.error('Failed to delete lead');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim() || !viewingLead) return;

    try {
      const res = await leadService.addNote(viewingLead._id || viewingLead.id, noteText);
      if (res.success) {
        toast.success('Note added');
        setViewingLead({ ...viewingLead, notes: res.data });
        setNoteText('');
        fetchLeads();
      }
    } catch (err) {
      toast.error('Could not add note');
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await leadService.exportCsv({
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
      });
      downloadCsvBlob(blob, `LeadFlow_Leads_${Date.now()}.csv`);
      toast.success('Leads exported as CSV');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const columns = [
    {
      title: 'Opportunity Name',
      key: 'title',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 hover:text-primary-600 block">
            {val}
          </span>
          <span className="text-[11px] text-slate-400">Source: {row.source}</span>
        </div>
      ),
    },
    {
      title: 'Est. Value',
      key: 'value',
      sortable: true,
      render: (val) => <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(val)}</span>,
    },
    {
      title: 'Company',
      key: 'company',
      render: (val) => (
        <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          {val?.name || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(val)}`}>
          {val}
        </span>
      ),
    },
    {
      title: 'Priority',
      key: 'priority',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded-md text-[11px] ${getPriorityBadgeStyle(val)}`}>
          {val}
        </span>
      ),
    },
    {
      title: 'Close Date',
      key: 'expectedCloseDate',
      render: (val) => <span className="text-xs text-slate-500">{formatDate(val)}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewingLead(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="View Details & Notes"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Edit Lead"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingId(row._id || row.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Delete Lead"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Leads & Deals Pipeline</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage sales opportunities, track statuses, and record deal activity notes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Download} onClick={handleExportCsv}>
            Export CSV
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
            Add Opportunity
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-soft flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <Input
            icon={Search}
            placeholder="Search leads by title or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="w-36">
            <Select
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'New', label: 'New' },
                { value: 'Contacted', label: 'Contacted' },
                { value: 'Qualified', label: 'Qualified' },
                { value: 'Proposal', label: 'Proposal' },
                { value: 'Won', label: 'Won' },
                { value: 'Lost', label: 'Lost' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>

          <div className="w-36">
            <Select
              options={[
                { value: '', label: 'All Priorities' },
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
                { value: 'Urgent', label: 'Urgent' },
              ]}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Data */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : leads.length === 0 ? (
        <EmptyState
          title="No leads found"
          description="Create a new lead opportunity or adjust filter parameters."
          actionLabel="Add Lead Opportunity"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-soft">
          <Table columns={columns} data={leads} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Add / Edit Lead Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLead ? 'Edit Lead Opportunity' : 'Add New Lead Opportunity'}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <Input
            label="Opportunity Title"
            placeholder="Enterprise Suite License"
            error={errors.title?.message}
            {...register('title', { required: 'Lead title is required' })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Estimated Deal Value ($)"
              type="number"
              placeholder="75000"
              {...register('value')}
            />

            <Input
              label="Expected Close Date"
              type="date"
              {...register('expectedCloseDate')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Status"
              options={[
                { value: 'New', label: 'New' },
                { value: 'Contacted', label: 'Contacted' },
                { value: 'Qualified', label: 'Qualified' },
                { value: 'Proposal', label: 'Proposal' },
                { value: 'Won', label: 'Won' },
                { value: 'Lost', label: 'Lost' },
              ]}
              {...register('status')}
            />

            <Select
              label="Priority"
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
                { value: 'Urgent', label: 'Urgent' },
              ]}
              {...register('priority')}
            />

            <Select
              label="Lead Source"
              options={[
                { value: 'Website', label: 'Website' },
                { value: 'Referral', label: 'Referral' },
                { value: 'LinkedIn', label: 'LinkedIn' },
                { value: 'Cold Call', label: 'Cold Call' },
                { value: 'Email', label: 'Email' },
                { value: 'Other', label: 'Other' },
              ]}
              {...register('source')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Associated Company"
              options={[
                { value: '', label: '-- Select Company --' },
                ...companies.map((c) => ({ value: c._id || c.id, label: c.name })),
              ]}
              {...register('company')}
            />

            <Select
              label="Primary Contact"
              options={[
                { value: '', label: '-- Select Contact --' },
                ...contacts.map((cnt) => ({
                  value: cnt._id || cnt.id,
                  label: `${cnt.firstName} ${cnt.lastName}`,
                })),
              ]}
              {...register('contact')}
            />
          </div>

          {!editingLead && (
            <Input
              label="Initial Deal Note"
              placeholder="Key requirements discussed..."
              {...register('notes')}
            />
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={actionLoading}>
              {editingLead ? 'Save Changes' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Lead Details & Notes Drawer Modal */}
      {viewingLead && (
        <Modal
          isOpen={!!viewingLead}
          onClose={() => setViewingLead(null)}
          title={`Lead Details: ${viewingLead.title}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Deal Value</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(viewingLead.value)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(viewingLead.status)}`}>
                  {viewingLead.status}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Priority</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {viewingLead.priority}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Account</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {viewingLead.company?.name || 'N/A'}
                </span>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-600" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Activity Notes Thread ({viewingLead.notes?.length || 0})
                </h4>
              </div>

              {/* Add note input */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <Input
                  placeholder="Type a new activity update or note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="py-2"
                />
                <Button type="submit" variant="primary" icon={Send} size="sm">
                  Post
                </Button>
              </form>

              {/* Notes List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {(viewingLead.notes || []).map((note, i) => (
                  <div key={note.id || i} className="p-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{note.author}</span>
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Opportunity"
        message="Are you sure you want to permanently remove this lead from the pipeline?"
        loading={actionLoading}
      />
    </div>
  );
};
