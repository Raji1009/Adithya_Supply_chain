import { useState } from 'react';
import api from '../services/api';
import FormField from '../components/FormField';
import useFormState from '../hooks/useFormState';

export default function ManufacturerRequestPage() {
  const { form, onChange } = useFormState({ companyName: '', contactPerson: '', email: '', phone: '', itemsRequired: '', quantity: '', specifications: '', expectedDeliveryDate: '', location: '', budget: '', remarks: '' });
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/public/manufacturer-requests', {
      ...form,
      itemsRequired: form.itemsRequired.split(',').map((x) => x.trim()).filter(Boolean),
      budget: form.budget ? Number(form.budget) : undefined
    });
    setMessage('Requirement submitted successfully. Admin will follow up.');
  };

  return (
    <section>
      <h2>Manufacturer Requirement Form</h2>
      <form className="card" onSubmit={submit}>
        <FormField label="Company Name" name="companyName" value={form.companyName} onChange={onChange} required />
        <FormField label="Contact Person" name="contactPerson" value={form.contactPerson} onChange={onChange} required />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
        <FormField label="Phone" name="phone" value={form.phone} onChange={onChange} required />
        <FormField label="Items Required (comma separated)" name="itemsRequired" value={form.itemsRequired} onChange={onChange} required />
        <FormField label="Quantity" name="quantity" value={form.quantity} onChange={onChange} required />
        <FormField label="Specifications" name="specifications" value={form.specifications} onChange={onChange} required textarea />
        <FormField label="Expected Delivery Date" name="expectedDeliveryDate" type="date" value={form.expectedDeliveryDate} onChange={onChange} required />
        <FormField label="Location" name="location" value={form.location} onChange={onChange} required />
        <FormField label="Budget" name="budget" type="number" value={form.budget} onChange={onChange} />
        <FormField label="Remarks" name="remarks" value={form.remarks} onChange={onChange} textarea />
        <button type="submit">Submit Requirement</button>
      </form>
      {message && <p className="success">{message}</p>}
    </section>
  );
}
