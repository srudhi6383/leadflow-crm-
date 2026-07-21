import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Search,
  Building2,
  Globe,
  Mail,
  Phone,
  Users,
  DollarSign,
  Download,
  Edit,
  Trash2,
  ExternalLink,
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
import { companyService } from '../services/companyService';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import { useToast } from '../contexts/ToastContext';
import { formatCurrency } from '../utils/formatters';
import { downloadCsvBlob } from '../utils/exportCsv';

export const Companies = () => {
  const toast = useToast();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [industryFilter, setIndustryFilter] = useState('');

  const { page, setPage, limit, totalPages, totalItems, updatePaginationMeta } = usePagination(1, 10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await companyService.getCompanies({
        search: debouncedSearch,
        industry: industryFilter,
        page,
        limit,
      });

      if (res.success) {
        setCompanies(res.data || []);
        if (res.pagination) updatePaginationMeta(res.pagination);
      }
    } catch (err) {
      toast.error('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [debouncedSearch, industryFilter, page]);

  const handleOpenAdd = () => {
    setEditingCompany(null);
    reset({
      name: '',
      industry: 'Enterprise Software',
      employees: 100,
      revenue: 5000000,
      website: '',
      email: '',
      phone: '',
      address: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp) => {
    setEditingCompany(comp);
    reset({
      name: comp.name,
      industry: comp.industry,
      employees: comp.employees,
      revenue: comp.revenue,
      website: comp.website,
      email: comp.email,
      phone: comp.phone,
      address: comp.address,
    });
    setIsModalOpen(true);
  };

  const onSubmitForm = async (formData) => {
    setActionLoading(true);
    try {
      if (editingCompany) {
        await companyService.updateCompany(editingCompany._id || editingCompany.id, formData);
        toast.success('Company updated successfully');
      } else {
        await companyService.createCompany(formData);
        toast.success('Company created successfully');
      }
      setIsModalOpen(false);
      fetchCompanies();
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
      await companyService.deleteCompany(deletingId);
      toast.success('Company deleted successfully');
      setDeletingId(null);
      fetchCompanies();
    } catch (err) {
      toast.error('Failed to delete company');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await companyService.exportCsv({ search: debouncedSearch });
      downloadCsvBlob(blob, `LeadFlow_Companies_${Date.now()}.csv`);
      toast.success('Exported companies to CSV');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const columns = [
    {
      title: 'Company Name',
      key: 'name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 block">{val}</span>
            {row.website && (
              <a
                href={row.website.startsWith('http') ? row.website : `https://${row.website}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-primary-600 dark:text-primary-400 hover:underline"
              >
                {row.website.replace(/^https?:\/\//, '')} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Industry Sector',
      key: 'industry',
      render: (val) => <Badge variant="primary">{val}</Badge>,
    },
    {
      title: 'Company Size',
      key: 'employees',
      render: (val) => (
        <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          {val} employees
        </span>
      ),
    },
    {
      title: 'Annual Revenue',
      key: 'revenue',
      render: (val) => <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(val)}</span>,
    },
    {
      title: 'Contact Information',
      key: 'email',
      render: (_, row) => (
        <div className="text-xs space-y-0.5">
          {row.email && (
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Mail className="w-3 h-3" /> {row.email}
            </div>
          )}
          {row.phone && (
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Phone className="w-3 h-3" /> {row.phone}
            </div>
          )}
        </div>
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Enterprise Accounts</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Target company directory, annual revenue statistics, and organizational profiles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Download} onClick={handleExportCsv}>
            Export CSV
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
            Add Company
          </Button>
        </div>
      </div>

      {/* Search & Industry Filter */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-soft flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <Input
            icon={Search}
            placeholder="Search company name or industry sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            options={[
              { value: '', label: 'All Industries' },
              { value: 'Enterprise Software', label: 'Enterprise Software' },
              { value: 'Fintech & Banking', label: 'Fintech & Banking' },
              { value: 'Healthcare & Biotech', label: 'Healthcare & Biotech' },
              { value: 'Cloud Infrastructure', label: 'Cloud Infrastructure' },
              { value: 'E-commerce & Retail', label: 'E-commerce & Retail' },
            ]}
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : companies.length === 0 ? (
        <EmptyState
          title="No companies found"
          description="Add your first target enterprise account to start tracking."
          actionLabel="Add New Company"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-soft">
          <Table columns={columns} data={companies} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Add / Edit Company Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCompany ? 'Edit Company Profile' : 'Add Target Company'}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <Input
            label="Company Name"
            placeholder="Acme Global Inc."
            error={errors.name?.message}
            {...register('name', { required: 'Company name is required' })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Industry Sector"
              options={[
                { value: 'Enterprise Software', label: 'Enterprise Software' },
                { value: 'Fintech & Banking', label: 'Fintech & Banking' },
                { value: 'Healthcare & Biotech', label: 'Healthcare & Biotech' },
                { value: 'Cloud Infrastructure', label: 'Cloud Infrastructure' },
                { value: 'E-commerce & Retail', label: 'E-commerce & Retail' },
              ]}
              {...register('industry')}
            />

            <Input
              label="Employee Count"
              type="number"
              placeholder="250"
              {...register('employees')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Estimated Annual Revenue ($)"
              type="number"
              placeholder="15000000"
              {...register('revenue')}
            />

            <Input
              label="Website URL"
              placeholder="https://company.com"
              {...register('website')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              placeholder="contact@company.com"
              {...register('email')}
            />

            <Input
              label="Phone Number"
              placeholder="+1 (800) 555-0199"
              {...register('phone')}
            />
          </div>

          <Input
            label="Office Address"
            placeholder="100 Tech Plaza, San Francisco, CA"
            {...register('address')}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={actionLoading}>
              {editingCompany ? 'Save Changes' : 'Create Company'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Company"
        message="Are you sure you want to remove this company from the directory?"
        loading={actionLoading}
      />
    </div>
  );
};
