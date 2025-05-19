import Button from '@/components/button';
import Input from '@/components/input';
import Label from '@/components/label';
import { useAuth } from '@/context/authContext';
import AuthLayout from '@/layouts/authLayout';
import React, { useState } from 'react';

const Register: React.FC = () => {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(name, email, password, passwordConfirmation);
            window.location.href = '/';
        } catch {
            setError('Invalid credentials, please try again.');
        }
    };

    return (
        <AuthLayout title="Register" description="Sign in to your account">
            <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Password confirmation</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            placeholder="Password confirmation"
                        />
                    </div>

                    {error && <div className="text-red-500">{error}</div>}

                    <Button className="w-full" size={'lg'}>
                        Register
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
