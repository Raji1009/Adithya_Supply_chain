import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import FormField from '../components/FormField';
import StatusBadge from '../components/StatusBadge';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('adminToken', res.data.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return <section><h2>Admin Login</h2><form className="card" onSubmit={submit}>
    <FormField label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
    <FormField label="Password" name="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
    <button type="submit">Login</button>{error && <p className="error">{error}</p>}
  </form></section>;
}

const AdminShell = ({ title, children }) => <section><div className="admin-head"><h2>{title}</h2><Link to="/admin/dashboard">Dashboard</Link></div>{children}</section>;

export function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  useEffect(() => { api.get('/dashboard/summary').then((res) => setSummary(res.data.data)); }, []);
  if (!summary) return <p>Loading dashboard...</p>;
  const cards = Object.entries(summary);
  return <AdminShell title="Admin Dashboard"><div className="grid">{cards.map(([k, v]) => <div key={k} className="card"><h3>{k}</h3><p className="metric">{v}</p></div>)}</div>
    <div className="admin-links"><Link to="/admin/producer-requests">Producer Requests</Link><Link to="/admin/approved-producers">Approved Producers</Link><Link to="/admin/manufacturer-requests">Manufacturer Requests</Link></div>
  </AdminShell>;
}

export function PendingProducerRequestsPage() {
  const [rows, setRows] = useState([]);
  const load = () => api.get('/producers/pending').then((res) => setRows(res.data.data));
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/producers/requests/${id}/status`, { status });
    load();
  };

  return <AdminShell title="Pending Producer Requests"><table><thead><tr><th>Company</th><th>Categories</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r._id}><td>{r.companyName}</td><td>{r.productCategories.join(', ')}</td><td><StatusBadge status={r.status} /></td><td><button onClick={() => updateStatus(r._id, 'approved')}>Approve</button><button onClick={() => updateStatus(r._id, 'rejected')} className="muted">Reject</button></td></tr>)}</tbody></table></AdminShell>;
}

export function ApprovedProducersPage() {
  const [rows, setRows] = useState([]); const [q, setQ] = useState('');
  useEffect(() => { api.get(`/producers/approved?q=${encodeURIComponent(q)}`).then((res) => setRows(res.data.data)); }, [q]);
  return <AdminShell title="Approved Producers"><input placeholder="Search company/product/location" value={q} onChange={(e) => setQ(e.target.value)} /><table><thead><tr><th>Company</th><th>Products</th><th>Location</th><th>Certifications</th></tr></thead><tbody>{rows.map((r) => <tr key={r._id}><td>{r.companyName}</td><td>{r.products.join(', ')}</td><td>{r.location}</td><td>{r.certifications.join(', ')}</td></tr>)}</tbody></table></AdminShell>;
}

export function ManufacturerRequestsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { api.get('/manufacturer-requests').then((res) => setRows(res.data.data)); }, []);
  return <AdminShell title="Manufacturer Requests"><table><thead><tr><th>Company</th><th>Items</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map((r) => <tr key={r._id}><td>{r.companyName}</td><td>{r.itemsRequired.join(', ')}</td><td><StatusBadge status={r.status} /></td><td><Link to={`/admin/matching/${r._id}`}>View Matches</Link></td></tr>)}</tbody></table></AdminShell>;
}

export function MatchingPage({ requestId }) {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState([]);
  useEffect(() => { api.get(`/manufacturer-requests/${requestId}/matches`).then((res) => setData(res.data.data)); }, [requestId]);

  const toggle = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const sendRequests = async () => {
    await api.post('/quotations/send', {
      manufacturerRequestId: requestId,
      producerIds: selected,
      itemsRequested: data.manufacturerRequest.itemsRequired
    });
    alert('Quotation requests sent.');
  };

  if (!data) return <p>Loading matches...</p>;
  return <AdminShell title="Matching Producers"><table><thead><tr><th>Select</th><th>Producer</th><th>Matched Items</th><th>Score</th></tr></thead><tbody>{data.matches.map((m) => <tr key={m.producer._id}><td><input type="checkbox" onChange={() => toggle(m.producer._id)} /></td><td>{m.producer.companyName}</td><td>{m.matchedItems.join(', ')}</td><td>{m.score}</td></tr>)}</tbody></table><button disabled={!selected.length} onClick={sendRequests}>Send Quotation Requests</button><Link to={`/admin/quotations/${requestId}`}>Open Comparison</Link></AdminShell>;
}

export function QuotationComparisonPage({ requestId }) {
  const [rows, setRows] = useState([]);
  useEffect(() => { api.get(`/quotations/comparison/${requestId}`).then((res) => setRows(res.data.data)); }, [requestId]);

  const bestOverallId = useMemo(() => rows.find((r) => r.isBestOverall)?.quotationId, [rows]);

  return <AdminShell title="Quotation Comparison"><table><thead><tr><th>Producer</th><th>Price</th><th>Delivery Days</th><th>Certifications</th><th>Location</th><th>Remarks</th><th>Highlights</th></tr></thead><tbody>{rows.map((r) => <tr key={r.quotationId} className={r.quotationId === bestOverallId ? 'row-highlight' : ''}><td>{r.producerName}</td><td>{r.price}</td><td>{r.deliveryTimeline}</td><td>{r.certifications.join(', ')}</td><td>{r.location}</td><td>{r.remarks}</td><td>{r.isLowestQuote ? 'Lowest Quote ' : ''}{r.isBestDelivery ? 'Best Delivery ' : ''}{r.isBestOverall ? 'Best Overall' : ''}</td></tr>)}</tbody></table></AdminShell>;
}
