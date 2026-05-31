import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { TeacherClassCard } from '@/app/components/teacher-class-card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/auth-context';
import { getTeacherClasses } from '@/app/lib/classes-storage';

export function ManageClasses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState(() => getTeacherClasses(user?.id));

  useEffect(() => {
    setClasses(getTeacherClasses(user?.id));
  }, [user?.id]);

  const handleEditClass = (classId: string) => {
    navigate(`/teacher/classes/create?edit=${classId}`);
  };

  const handleStartSession = (classId: string) => {
    const classData = classes.find(c => c.id === classId);
    const zoomLink = classData?.zoomLink;
    if (zoomLink) {
      window.open(zoomLink, '_blank');
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
