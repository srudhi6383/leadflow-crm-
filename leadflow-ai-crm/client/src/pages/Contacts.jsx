import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Search,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Download,
  Edit,
  Trash2,
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
import { contactService } from '../services/contactService';
import { companyService } from '../services/companyService';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import { useToast } from '../contexts/ToastContext';
import { downloadCsvBlob } from '../utils/exportCsv';

export const Contacts = () => {
  const toast = useToast();
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [companyFilter, setCompanyFilter] = useState('');

  const { page, setPage, limit, totalPages, totalItems, updatePaginationMeta } = usePagination(1, 10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await contactService.getContacts({
        search: debouncedSearch,
        company: companyFilter,
        page,
        limit,
      });

      if (res.success) {
        setContacts(res.data || []);
        if (res.pagination) updatePaginationMeta(res.pagination);
      }
    } catch (err) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await companyService.getCompanies({ limit: 100 });
      if (res.success) setCompanies(res.data || []);
    } catch (err) {
      console.warn('Could not load company dropdown');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [debouncedSearch, companyFilter, page]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleOpenAdd = () => {
    setEditingContact(null);
    reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      designation: '',
      company: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cnt) => {
    setEditingContact(cnt);
    reset({
      firstName: cnt.firstName,
      lastName: cnt.lastName,
      email: cnt.email,
      phone: cnt.phone,
      designation: cnt.designation,
      company: cnt.company?._id || cnt.company?.id || cnt.company || '',
      notes: cnt.notes,
    });
    setIsModalOpen(true);
  };

  const onSubmitForm = async (formData) => {
    setActionLoading(true);
    try {
      if (editingContact) {
        await contactService.updateContact(editingContact._id || editingContact.id, formData);
        toast.success('Contact updated successfully');
      } else {
        await contactService.createContact(formData);
        toast.success('Contact created successfully');
      }
      setIsModalOpen(false);
      fetchContacts();
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
      await contactService.deleteContact(deletingId);
      toast.success('Contact deleted successfully');
      setDeletingId(null);
      fetchContacts();
    } catch (err) {
      toast.error('Failed to delete contact');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await contactService.exportCsv({ search: debouncedSearch });
      downloadCsvBlob(blob, `LeadFlow_Contacts_${Date.now()}.csv`);
      toast.success('Exported contacts to CSV');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const columns = [
    {
      title: 'Contact Name',
      key: 'firstName',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0">
            {row.firstName[0]}
            {row.lastName[0]}
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 block">
              {row.firstName} {row.lastName}
            </span>
            <span className="text-[11px] text-slate-400">{row.designation || 'No Designation'}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Email Address',
      key: 'email',
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          {val}
        </span>
      ),
    },
    {
      title: 'Phone Number',
      key: 'phone',
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          {val || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Associated Company',
      key: 'company',
      render: (val) => (
        <span className="inline-flex items-center gap-1 text-xs">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <Badge variant="primary">{val?.name || 'Unassigned'}</Badge>
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingId(row._id || row.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Client Contacts</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Directory of key business decision makers, executive buyers, and procurement leads
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Download} onClick={handleExportCsv}>
            Export CSV
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
            Add Contact
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-soft flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <Input
            icon={Search}
            placeholder="Search contact by name, email, or job designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-56">
          <Select
            options={[
              { value: '', label: 'All Companies' },
              ...companies.map((c) => ({ value: c._id || c.id, label: c.name })),
            ]}
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : contacts.length === 0 ? (
        <EmptyState
          title="No contacts found"
          description="Create your first client contact or adjust search parameters."
          actionLabel="Add New Contact"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-soft">
          <Table columns={columns} data={contacts} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Add / Edit Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingContact ? 'Edit Contact Person' : 'Add New Contact Person'}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="David"
              error={errors.firstName?.message}
              {...register('firstName', { required: 'First name is required' })}
            />

            <Input
              label="Last Name"
              placeholder="Miller"
              error={errors.lastName?.message}
              {...register('lastName', { required: 'Last name is required' })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="david.miller@acmeglobaltech.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' },
              })}
            />

            <Input
              label="Phone Number"
              placeholder="+1 (555) 234-5678"
              {...register('phone')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Job Designation / Title"
              placeholder="Chief Technology Officer"
              {...register('designation')}
            />

            <Select
              label="Associated Enterprise Account"
              options={[
                { value: '', label: '-- Select Company --' },
                ...companies.map((c) => ({ value: c._id || c.id, label: c.name })),
              ]}
              {...register('company')}
            />
          </div>

          <Input
            label="Internal Notes"
            placeholder="Key decision maker for Q3 software upgrade..."
            {...register('notes')}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={actionLoading}>
              {editingContact ? 'Save Changes' : 'Create Contact'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Contact"
        message="Are you sure you want to remove this contact person from the directory?"
        loading={actionLoading}
      />
    </div>
  );
};
