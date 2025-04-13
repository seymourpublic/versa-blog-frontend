// components/FilterBar.js
import { useState } from 'react';

export default function FilterBar({ onFilter }) {
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [category, setCategory] = useState('');

  const handleFilter = () => {
    onFilter({ searchText, status, dateFrom, dateTo, category });
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputRow}>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={styles.input}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={styles.select}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div style={styles.inputRow}>
        <input
          type="date"
          placeholder="From date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          style={styles.input}
        />
        <input
          type="date"
          placeholder="To date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.inputRow}>
        <input
          type="text"
          placeholder="Category ID"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleFilter}>
          Apply Filters
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: '#fff',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
    maxWidth: '100%',
    margin: '1 auto'
  },
  inputRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  input: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95rem'
  },
  select: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95rem',
    background: '#fff'
  },
  buttonContainer: {
    textAlign: 'right'
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem'
  }
};
