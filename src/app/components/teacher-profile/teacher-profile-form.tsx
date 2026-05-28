import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';

interface TeacherProfileFormProps {
  name: string;
  email: string;
  subject: string;
  qualification: string;
  experience: number;
  bio: string;
  hourlyRate: string;
  zoomLink: string;
  onSave: (payload: {
    name: string;
    subject: string;
    qualification: string;
    experience: number;
    bio: string;
    hourlyRate: string;
    zoomLink: string;
  }) => void;
}

export function TeacherProfileForm({
  name,
  email,
  subject,
  qualification,
  experience,
  bio,
  hourlyRate,
  zoomLink,
  onSave,
}: TeacherProfileFormProps) {
  const [formData, setFormData] = useState({
    name,
    subject,
    qualification,
    experience: experience.toString(),
    bio,
    hourlyRate,
    zoomLink,
  });

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({
      name: formData.name.trim(),
      subject: formData.subject.trim(),
      qualification: formData.qualification.trim(),
      experience: Number(formData.experience) || 0,
      bio: formData.bio.trim(),
      hourlyRate: formData.hourlyRate.trim(),
      zoomLink: formData.zoomLink.trim(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="teacher-name">Full name</Label>
              <Input
                id="teacher-name"
                value={formData.name}
                onChange={(event) => handleChange('name', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-email">Email</Label>
              <Input id="teacher-email" value={email} readOnly />
              <p className="text-xs text-muted-foreground">Contact support to update email.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-subject">Primary subject</Label>
              <Input
                id="teacher-subject"
                value={formData.subject}
                onChange={(event) => handleChange('subject', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-qualification">Qualification</Label>
              <Input
                id="teacher-qualification"
                value={formData.qualification}
                onChange={(event) => handleChange('qualification', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-experience">Years of experience</Label>
              <Input
                id="teacher-experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={(event) => handleChange('experience', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-rate">Hourly rate (Rs)</Label>
              <Input
                id="teacher-rate"
                value={formData.hourlyRate}
                onChange={(event) => handleChange('hourlyRate', event.target.value)}
                placeholder="e.g., 800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher-bio">Professional bio</Label>
            <Textarea
              id="teacher-bio"
              value={formData.bio}
              onChange={(event) => handleChange('bio', event.target.value)}
              placeholder="Share your teaching philosophy, specialties, and achievements."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher-zoom">Preferred Zoom link</Label>
            <Input
              id="teacher-zoom"
              value={formData.zoomLink}
              onChange={(event) => handleChange('zoomLink', event.target.value)}
              placeholder="https://zoom.us/j/..."
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
