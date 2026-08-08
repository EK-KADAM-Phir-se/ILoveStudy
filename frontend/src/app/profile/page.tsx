"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProfile, updateProfile, EXAM_OPTIONS, type UserProfile } from '../../lib/profileApi';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    age: '',
    school: '',
    targetExam: 'JEE Mains',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          fullName: data.fullName,
          age: data.age != null ? String(data.age) : '',
          school: data.school || '',
          targetExam: data.targetExam || 'JEE Mains',
        });
      })
      .catch(() => {
        setProfile({
          id: '',
          email: localStorage.getItem('userEmail') || '',
          fullName: localStorage.getItem('displayName') || 'Student',
          targetExam: 'JEE Mains',
          age: null,
          school: '',
          avatarUrl: null,
        });
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('backendToken');
    localStorage.removeItem('displayName');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const updated = await updateProfile({
        fullName: form.fullName,
        age: form.age === '' ? null : parseInt(form.age, 10),
        school: form.school,
        targetExam: form.targetExam,
      });
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-col items-center text-center">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Profile avatar"
                className="h-24 w-24 rounded-full object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold uppercase text-white shadow-sm">
                {(profile?.fullName || 'S').charAt(0)}
              </div>
            )}
            <div className="mt-5">
              <h1 className="text-2xl font-semibold text-slate-900">{profile?.fullName || 'Student'}</h1>
              <p className="mt-2 text-sm text-slate-500">{profile?.email || 'No email linked'}</p>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <div className="rounded-[1.5rem] bg-slate-50 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Exam focus</h2>
              <p className="mt-3 text-lg font-semibold text-slate-900">{profile?.targetExam || 'JEE Mains'}</p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-50 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Age</h2>
              <p className="mt-3 text-lg font-semibold text-slate-900">{profile?.age ?? 'Not set'}</p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-50 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">School</h2>
              <p className="mt-3 text-lg font-semibold text-slate-900">{profile?.school || 'Not set'}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-slate-50"
            >
              Log Out
            </button>
            <button
              onClick={() => router.push('/pages/dashboard')}
              className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Back to Dashboard
            </button>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Profile settings</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">{isEditing ? 'Edit details' : 'Profile summary'}</h2>
            </div>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {isEditing ? 'Editing' : 'Read only'}
            </span>
          </div>

          {error && (
            <div className="mt-6 rounded-[1.5rem] bg-rose-50 px-5 py-4 text-sm text-rose-600 ring-1 ring-rose-200">
              {error}
            </div>
          )}

          {isEditing ? (
            <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Full name</span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="mt-2 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Age</span>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="mt-2 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Exam preparing for</span>
                <select
                  value={form.targetExam}
                  onChange={(e) => setForm({ ...form, targetExam: e.target.value })}
                  className="mt-2 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                >
                  {EXAM_OPTIONS.map((exam) => (
                    <option key={exam} value={exam}>{exam}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">School / College</span>
                <input
                  type="text"
                  value={form.school}
                  onChange={(e) => setForm({ ...form, school: e.target.value })}
                  className="mt-2 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-[1.75rem] bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center justify-center rounded-[1.75rem] border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.5rem] bg-slate-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Name</h3>
                <p className="mt-3 text-lg font-semibold text-slate-900">{profile?.fullName || 'Not available'}</p>
              </article>
              <article className="rounded-[1.5rem] bg-slate-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Age</h3>
                <p className="mt-3 text-lg font-semibold text-slate-900">{profile?.age ?? 'Not set'}</p>
              </article>
              <article className="rounded-[1.5rem] bg-slate-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Exam</h3>
                <p className="mt-3 text-lg font-semibold text-slate-900">{profile?.targetExam || 'Not set'}</p>
              </article>
              <article className="rounded-[1.5rem] bg-slate-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">School</h3>
                <p className="mt-3 text-lg font-semibold text-slate-900">{profile?.school || 'Not set'}</p>
              </article>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
