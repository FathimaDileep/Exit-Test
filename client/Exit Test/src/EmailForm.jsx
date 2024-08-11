import React, { useState } from 'react';
import './App.css';

function EmailForm() {
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            setOtpSent(true);
            setAlert({ type: 'success', message: 'OTP sent to your email!' });
        } else {
            setAlert({ type: 'error', message: 'Failed to send OTP.' });
        }
    };
    return (
        <div className="container">
            <h2>OTP Verification</h2>
            {alert && (
                <div className={`alert alert-${alert.type}`}>
                    {alert.message}
                </div>
            )}
            {!otpSent ? (
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <OTPForm email={email} />
            )}
        </div>
    );
}

function OTPForm({ email }) {
    const [otp, setOtp] = useState('');
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });

        if (response.ok) {
            window.location.href = '/welcome';
        } else {
            setAlert({ type: 'error', message: 'Invalid OTP' });
        }
    };
    return (
        <div className="container">
            <h2>Verify OTP</h2>
            {alert && (
                <div className={`alert alert-${alert.type}`}>
                    {alert.message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <label>Enter OTP:</label>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default EmailForm
