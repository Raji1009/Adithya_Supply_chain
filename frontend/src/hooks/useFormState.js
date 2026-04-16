import { useState } from 'react';

export default function useFormState(initial) {
  const [form, setForm] = useState(initial);
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  return { form, setForm, onChange };
}
