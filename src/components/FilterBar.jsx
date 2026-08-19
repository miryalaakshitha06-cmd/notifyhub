import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterBar({ filters, setFilters, categories = [], priorities = [], departments = [], years = [] }) {
  return (
    <div
      className="filter-bar glass-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        flexWrap: 'wrap',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
        <Filter size={16} />
        <span>Filters:</span>
      </div>

      {categories.length > 0 && (
        <select
          className="form-select"
          value={filters.category || 'ALL'}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          style={{ width: 'auto', fontSize: '0.85rem' }}
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}

      {priorities.length > 0 && (
        <select
          className="form-select"
          value={filters.priority || 'ALL'}
          onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
          style={{ width: 'auto', fontSize: '0.85rem' }}
        >
          <option value="ALL">All Priorities</option>
          {priorities.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      )}

      {departments.length > 0 && (
        <select
          className="form-select"
          value={filters.department || 'ALL'}
          onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}
          style={{ width: 'auto', fontSize: '0.85rem' }}
        >
          <option value="ALL">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      )}

      {years.length > 0 && (
        <select
          className="form-select"
          value={filters.year || 'ALL'}
          onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}
          style={{ width: 'auto', fontSize: '0.85rem' }}
        >
          <option value="ALL">All Academic Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      )}

      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setFilters({ category: 'ALL', priority: 'ALL', department: 'ALL', year: 'ALL' })}
        style={{ marginLeft: 'auto', fontSize: '0.8rem' }}
      >
        Reset Filters
      </button>
    </div>
  );
}
