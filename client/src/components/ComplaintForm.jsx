import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import '../assets/css/ComplaintForm.css';
import '../assets/css/Forms.css';
import '../assets/css/Buttons.css';

const categories = ['Billing', 'Technical', 'Service Quality', 'Delivery', 'Other'];

const ComplaintForm = () => {
  const [form, setForm] = useState({ title: '', category: categories[0], description: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { createComplaint } = useComplaints();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';
    else if (form.description.trim().length < 10)
      newErrors.description = 'Please provide at least 10 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const complaint = await createComplaint(form);
      navigate(`/complaints/${complaint._id}`);
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Failed to submit complaint.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="complaint-form" onSubmit={handleSubmit}>
      <h2>Submit a Complaint</h2>

      {errors.form && <p className="form-error">{errors.form}</p>}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className="form-control"
          value={form.title}
          onChange={handleChange}
          placeholder="Brief summary of your issue"
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          className="form-control"
          value={form.category}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe your complaint in detail"
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </div>
    </form>
  );
};

export default ComplaintForm;
