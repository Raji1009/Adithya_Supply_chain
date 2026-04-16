import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import FormField from '../components/FormField';
import useFormState from '../hooks/useFormState';

export default function QuotationSubmitPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { form, onChange } = useFormState({ price: '', deliveryTimeline: '', certifications: '', remarks: '' });
  const [details, setDetails] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    api.get(`/quotations/request-by-token?token=${token}`).then((res) => setDetails(res.data.data)).catch(() => setMessage('Invalid link'));
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/quotations/submit', {
      token,
      price: Number(form.price),
      deliveryTimeline: Number(form.deliveryTimeline),
      certifications: form.certifications.split(',').map((x) => x.trim()).filter(Boolean),
      remarks: form.remarks
    });
    setMessage('Quotation submitted successfully.');
  };

  if (!details) return <p>{message || 'Loading quotation request...'}</p>;

  return (
    <section>
      <h2>Quotation Submission</h2>
      <p><strong>Items Requested:</strong> {details.itemsRequested.join(', ')}</p>
      <form className="card" onSubmit={submit}>
        <FormField label="Quoted Price" name="price" type="number" value={form.price} onChange={onChange} required />
        <FormField label="Delivery Timeline (days)" name="deliveryTimeline" type="number" value={form.deliveryTimeline} onChange={onChange} required />
        <FormField label="Certifications" name="certifications" value={form.certifications} onChange={onChange} />
        <FormField label="Remarks" name="remarks" value={form.remarks} onChange={onChange} textarea />
        <button type="submit">Submit Quote</button>
      </form>
      {message && <p className="success">{message}</p>}
    </section>
  );
}
