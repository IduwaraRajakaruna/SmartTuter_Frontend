import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { TeacherClassCard } from '@/app/components/teacher-class-card';
import { mockClasses } from '@/app/lib/mock-data';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export function ManageClasses() {
  const [classes, setClasses] = useState(mockClasses.filter(c => c.teacherId === 't1'));

  const handleEditClass = (classId: string) => {
    // TODO: Navigate to edit class page
    console.log('Edit class:', classId);
    toast.info('Edit class functionality - To be implemented');
  };

  const handleStartSession = (classId: string) => {
    const classData = classes.find(c => c.id === classId);
    if (classData?.zoomLink) {
      window.open(classData.zoomLink, '_blank');
      toast.success('Opening Zoom session...');
    } else {
      toast.error('No Zoom link configured for this class');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-2">Manage Classes</h1>
          <p className="text-muted-foreground">Create and manage your tuition classes</p>
        </div>
        <Link to="/teacher/classes/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Class
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {classes.map((classData) => (
          <TeacherClassCard
            key={classData.id}
            classData={classData}
            onEdit={handleEditClass}
            onStartSession={handleStartSession}
          />
        ))}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven't created any classes yet</p>
          <Link to="/teacher/classes/create">
            <Button>Create Your First Class</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
