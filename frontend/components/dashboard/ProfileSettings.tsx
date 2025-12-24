'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { Save, Lock, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProfileSettings({ user, onUpdateUser }: { user: any, onUpdateUser: (u: any) => void }) {
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoadingPassword(true);
        setMessage(null);
        try {
            await api.put('/user/password', passwordForm);
            setMessage({ type: 'success', text: 'Password changed successfully.' });
            setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
        } catch (error: any) {
            // specific validation error for current_password
            const msg = error.response?.data?.errors?.current_password?.[0]
                || error.response?.data?.message
                || 'Failed to change password.';
            setMessage({
                type: 'error',
                text: msg
            });
        } finally {
            setIsLoadingPassword(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <div className="max-w-2xl">
                {/* Change Password */}
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-slate-900 dark:text-white" />
                        Change Password
                    </h2>
                    <form onSubmit={handlePasswordChange} className="space-y-5 flex-1 flex flex-col">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
                            <input
                                type="password"
                                required
                                value={passwordForm.current_password}
                                onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                value={passwordForm.new_password}
                                onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                value={passwordForm.new_password_confirmation}
                                onChange={e => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all text-sm"
                            />
                        </div>
                        <div className="flex-1"></div>
                        <button
                            type="submit"
                            disabled={isLoadingPassword}
                            className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-auto"
                        >
                            {isLoadingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
