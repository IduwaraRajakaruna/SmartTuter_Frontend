import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';

interface StudentProfileFormProps {
  name: string;
  email: string;
  phone: string;
  onSave: (payload: { name: string; phone: string }) => void;
}

export function StudentProfileForm({ name, email, phone, onSave }: StudentProfileFormProps) {
  const [formName, setFormName] = useState(name);
  const [formPhone, setFormPhone] = useState(phone);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({ name: formName.trim(), phone: formPhone.trim() });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="student-name">Full name</Label>
              <Input
                id="student-name"
                value={formName}
                onChange={(event) => setFormName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-email">Email</Label>
              <Input id="student-email" value={email} readOnly />
              <p className="text-xs text-muted-foreground">Contact support to change your email.</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="student-phone">Phone number</Label>
            <Input
              id="student-phone"
              value={formPhone}
              onChange={(event) => setFormPhone(event.target.value)}
              placeholder="Add your phone number"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="cta">Save changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
