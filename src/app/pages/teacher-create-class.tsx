import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { FormField } from '@/app/components/form-field';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/auth-context';
import { getClassById, upsertClass } from '@/app/lib/classes-storage';
import { Class } from '@/app/lib/mock-data';

export function CreateClass() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const classId = searchParams.get('edit');

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    schedule: '',
    price: '',
    maxStudents: '',
    startDate: '',
    endDate: '',
    zoomLink: user?.zoomLink ?? '',
  });

  useEffect(() => {
    if (!classId) return;
    const storedClass = getClassById(classId);
    if (!storedClass) return;
    if (user?.id && storedClass.teacherId !== user.id) return;

    setFormData({
      title: storedClass.title,
      subject: storedClass.subject,
      description: storedClass.description,
      schedule: storedClass.schedule,
      price: storedClass.price.toString(),
      maxStudents: storedClass.maxStudents.toString(),
      startDate: storedClass.startDate,
      endDate: storedClass.endDate,
      zoomLink: storedClass.zoomLink,
    });
    setIsEditing(true);
  }, [classId, user?.id]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.title || !formData.subject || !formData.description || !formData.schedule || !formData.price || !formData.maxStudents || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      setLoading(false);
      return;
    }

    if (parseInt(formData.maxStudents) <= 0) {
      setError('Max students must be greater than 0');
      setLoading(false);
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('End date must be after start date');
      setLoading(false);
      return;
    }

    try {
      const nextClass: Class = {
        id: classId ?? `c-${Date.now()}`,
        title: formData.title,
        subject: formData.subject,
        teacherId: user?.id ?? 'teacher',
        teacherName: user?.name ?? 'Teacher',
        description: formData.description,
        schedule: formData.schedule,
        zoomLink: formData.zoomLink,
        price: Number(formData.price),
        studentsEnrolled: 0,
        maxStudents: Number(formData.maxStudents),
        status: 'upcoming',
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      upsertClass(nextClass);

      toast.success(isEditing ? 'Class updated successfully!' : 'Class created successfully!');
      navigate('/teacher/classes');
    } catch (err) {
      setError('Failed to create class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">{isEditing ? 'Edit Class' : 'Create New Class'}</h1>
        <p className="text-muted-foreground">
          {isEditing
            ? 'Update the details for your class'
            : 'Fill in the details to create a new tuition class'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Information</CardTitle>
          <CardDescription>Provide complete details about your class</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                id="title"
                label="Class Title"
                placeholder="e.g., Advanced Calculus - Complete Course"
                value={formData.title}
                onChange={(val) => handleChange('title', val)}
                required
              />
              <FormField
                id="subject"
                label="Subject"
                placeholder="e.g., Mathematics"
                value={formData.subject}
                onChange={(val) => handleChange('subject', val)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the class content and objectives"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                id="schedule"
                label="Schedule"
                placeholder="e.g., Mon, Wed, Fri - 6:00 PM to 7:30 PM"
                value={formData.schedule}
                onChange={(val) => handleChange('schedule', val)}
                required
              />
              <FormField
                id="zoomLink"
                label="Zoom Meeting Link"
                placeholder="https://zoom.us/j/..."
                value={formData.zoomLink}
                onChange={(val) => handleChange('zoomLink', val)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                id="price"
                label="Price (Rs)"
                type="number"
                placeholder="5000"
                value={formData.price}
                onChange={(val) => handleChange('price', val)}
                required
              />
              <FormField
                id="maxStudents"
                label="Maximum Students"
                type="number"
                placeholder="30"
                value={formData.maxStudents}
                onChange={(val) => handleChange('maxStudents', val)}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/teacher/classes')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {isEditing ? (loading ? 'Saving...' : 'Save') : (loading ? 'Creating...' : 'Create Class')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
