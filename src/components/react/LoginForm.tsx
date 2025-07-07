import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase.js';
import TurnstileWidget from './TurnstileWidget.jsx';

export default function LoginForm({ user, onAuthChange }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [turnstileToken, setTurnstileToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!turnstileToken) return;

        setLoading(true);
        try {
            // Verify turnstile
            const verifyResponse = await fetch('/api/verify-turnstile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: turnstileToken })
            });

            const { success } = await verifyResponse.json();
            if (!success) throw new Error('Security verification failed');

            // Login with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            onAuthChange(userCredential.user);
        } catch (error) {
            alert('Login failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold">Welcome back!</h3>
                        <p className="text-slate-600">{user.email}</p>
                    </div>
                    <button
                        onClick={() => signOut(auth)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Admin Login</h3>
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                />

                <TurnstileWidget
                    onVerify={setTurnstileToken}
                    onError={() => setTurnstileToken(null)}
                />

                <button
                    type="submit"
                    disabled={loading || !turnstileToken}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}