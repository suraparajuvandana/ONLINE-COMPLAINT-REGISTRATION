import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import feedbackService from '../services/feedbackService';
import { toast } from 'react-toastify';
import '../assets/css/Feedback.css';
import '../assets/css/Forms.css';
import '../assets/css/Buttons.css';

const Feedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await feedbackService.submitFeedback(id, { rating, comment });
      toast.success('Thank you for your feedback!');
      navigate(`/complaints/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h2>Rate Our Service</h2>
      <p>Let us know how we handled your complaint.</p>

      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label>Rating</label>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= rating ? 'filled' : ''}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="comment">Comments (optional)</label>
        <textarea
          id="comment"
          className="form-control"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us more about your experience"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  );
};

export default Feedback;
