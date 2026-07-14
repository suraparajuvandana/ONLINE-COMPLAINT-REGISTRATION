import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { toast } from 'react-toastify';
import '../assets/css/Profile.css';
import '../assets/css/Forms.css';
import '../assets/css/Buttons.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated successfully.');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    setSaving(true);
    try {
      await authService.changePassword(passwordForm);
      toast.success('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-card">
      <h2>{user?.name}</h2>
      <p>{user?.role?.toUpperCase()}</p>

      <div className="profile-info">
        {editing ? (
          <>
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                className="form-control"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="info-row">
              <span>Email</span>
              <span>{user?.email}</span>
            </div>
            <div className="info-row">
              <span>Phone</span>
              <span>{user?.phone || '—'}</span>
            </div>
            <button className="btn btn-outline btn-block" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        )}

        <hr style={{ margin: '24px 0' }} />

        <h3>Change Password</h3>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            className="form-control"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            className="form-control"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <button className="btn btn-primary btn-block" onClick={handlePasswordSave} disabled={saving}>
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
