import { useState } from 'react';
import api from '../services/api';
import FormField from '../components/FormField';
import useFormState from '../hooks/useFormState';

export default function ProducerRequestPage() {
  const { form, onChange } = useFormState({ companyName: '', contactPerson: '', email: '', phone: '', shortMessage: '', productCategories: '' });
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, productCategories: form.productCategories.split(',').map((x) => x.trim()).filter(Boolean) };
    await api.post('/public/producer-requests', payload);
    setMessage('Request submitted successfully. Our admin team will review it.');
  };

  return (
    <section>
      <h2>Producer Initial Request</h2>
      <form className="card" onSubmit={submit}>
        <FormField label="Company Name" name="companyName" value={form.companyName} onChange={onChange} required />
        <FormField label="Contact Person" name="contactPerson" value={form.contactPerson} onChange={onChange} required />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
        <FormField label="Phone" name="phone" value={form.phone} onChange={onChange} required />
        <FormField label="Product Categories (comma separated)" name="productCategories" value={form.productCategories} onChange={onChange} required />
        <FormField label="Short Message" name="shortMessage" value={form.shortMessage} onChange={onChange} required textarea />
        <button type="submit">Submit Request</button>
      </form>
      {message && <p className="success">{message}</p>}
    </section>
  );
}
