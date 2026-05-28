import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { FormField } from '@/app/components/form-field';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { GraduationCap } from 'lucide-react';

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<'student' | 'teacher'>(
    (searchParams.get('role') as any) || 'student'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (role === 'teacher' && (!subject || !qualification || !experience)) {
      setError('Please fill in all teacher details');
      return;
    }

    // Mock registration - no backend call
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Registration success
    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TuitionHub</span>
          </Link>
          <h1 className="text-3xl mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join our learning community today</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Registration</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label>I am registering as a:</Label>
                <RadioGroup value={role} onValueChange={(v) => setRole(v as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="cursor-pointer">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher" className="cursor-pointer">Teacher</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  id="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={setName}
                  required
                />
                <FormField
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={setEmail}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={setPassword}
                  required
                />
                <FormField
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  required
                />
              </div>

              {role === 'teacher' && (
                <>
                  <div className="border-t pt-4">
                    <h3 className="text-sm mb-4">Teacher Information</h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          id="subject"
                          label="Subject"
                          placeholder="e.g., Mathematics"
                          value={subject}
                          onChange={setSubject}
                          required
                        />
                        <FormField
                          id="experience"
                          label="Years of Experience"
                          type="number"
                          placeholder="e.g., 5"
                          value={experience}
                          onChange={setExperience}
                          required
                        />
                      </div>
                      <FormField
                        id="qualification"
                        label="Qualification"
                        placeholder="e.g., MSc in Mathematics"
                        value={qualification}
                        onChange={setQualification}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>
                    Registration successful! Redirecting to login...
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={success}>
                {success ? 'Registration Successful!' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline ml-1">
              Login here
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
