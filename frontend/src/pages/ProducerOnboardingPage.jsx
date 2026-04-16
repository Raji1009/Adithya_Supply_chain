import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import FormField from '../components/FormField';
import useFormState from '../hooks/useFormState';

export default function ProducerOnboardingPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState('Validating token...');
  const { form, onChange } = useFormState({ companyName: '', gstin: '', contactPerson: '', email: '', phone: '', address: '', products: '', capacity: '', certifications: '', location: '', remarks: '' });

  useEffect(() => {
    if (!token) return setMessage('Missing token');
    api.get(`/producers/onboarding/validate?token=${token}`).then(() => {
      setValid(true); setMessage('');
    }).catch(() => setMessage('Invalid or expired link.'));
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/producers/onboarding/complete', {
      ...form,
      token,
      products: form.products.split(',').map((x) => x.trim()).filter(Boolean),
      certifications: form.certifications.split(',').map((x) => x.trim()).filter(Boolean)
    });
    setMessage('Onboarding completed successfully.');
  };

  if (!valid) return <p>{message}</p>;

  return (
    <section>
      <h2>Producer Detailed Onboarding</h2>
      <form className="card" onSubmit={submit}>
        {['companyName','gstin','contactPerson','email','phone','address','capacity','location'].map((name) => (
          <FormField key={name} label={name} name={name} value={form[name]} onChange={onChange} required type={name === 'email' ? 'email' : 'text'} />
        ))}
        <FormField label="Products (comma separated)" name="products" value={form.products} onChange={onChange} required />
        <FormField label="Certifications (comma separated)" name="certifications" value={form.certifications} onChange={onChange} />
        <FormField label="Remarks" name="remarks" value={form.remarks} onChange={onChange} textarea />
        <button type="submit">Complete Onboarding</button>
      </form>
      {message && <p className="success">{message}</p>}
    </section>
  );
}
