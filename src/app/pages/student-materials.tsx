import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { mockStudyMaterials, mockClasses } from '@/app/lib/mock-data';
import { FileText, Video, Link as LinkIcon, Download, ExternalLink } from 'lucide-react';
import { EmptyState } from '@/app/components/empty-state';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/auth-context';
import { getStoredClasses } from '@/app/lib/classes-storage';
import { getStoredPayments, seedPayments } from '@/app/lib/payments-storage';
import { listMaterials } from '@/services/materialsService';
import type { StudyMaterial } from '@/app/lib/mock-data';

export function StudentMaterialsPage() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const studentId = user?.id ?? 's1';

  const availableClasses = useMemo(() => {
    const storedClasses = getStoredClasses();
    return storedClasses.length > 0 ? storedClasses : mockClasses;
  }, []);

  const enrolledClassIds = useMemo(() => {
    seedPayments();
    return Array.from(new Set(
      getStoredPayments()
        .filter(payment => payment.studentId === studentId && payment.status === 'completed')
        .map(payment => payment.classId),
    ));
  }, [studentId]);

  useEffect(() => {
    const loadMaterials = async () => {
      setIsLoading(true);

      try {
        const uploadedMaterials = await listMaterials();
        setMaterials(uploadedMaterials);
      } catch (error) {
        console.warn('Falling back to seeded materials', error);
        setMaterials(mockStudyMaterials);
      } finally {
        setIsLoading(false);
      }
    };

    loadMaterials();
  }, []);

  const visibleMaterials = useMemo(() => {
    return materials.filter(material => enrolledClassIds.includes(material.classId));
  }, [materials, enrolledClassIds]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'link':
        return <LinkIcon className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'video':
        return 'bg-secondary/15 text-primary border-secondary/30';
      case 'link':
        return 'bg-accent/15 text-accent border-accent/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleViewMaterial = (material: StudyMaterial) => {
    window.open(material.url, '_blank', 'noopener,noreferrer');
    toast.success(`Opening ${material.title}...`);
  };

  const handleDownload = (material: StudyMaterial) => {
    if (material.type === 'link') {
      handleViewMaterial(material);
      return;
    }

    const link = document.createElement('a');
    link.href = material.url;
    link.download = material.title.replace(/\s+/g, '-').toLowerCase();
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${material.title}...`);
  };

  // Group materials by class
  const materialsByClass = enrolledClassIds.map(classId => {
    const classInfo = availableClasses.find(c => c.id === classId);
    const classMaterials = visibleMaterials.filter(m => m.classId === classId);
    return { classInfo, materials: classMaterials };
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Study Materials</h1>
        <p className="text-muted-foreground">Access learning resources for your enrolled classes</p>
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading materials...</div>
      )}

      {!isLoading && materialsByClass.map(({ classInfo, materials: classMaterials }) => (
        <Card key={classInfo?.id}>
          <CardHeader>
            <CardTitle>{classInfo?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {classMaterials.length > 0 ? (
              <div className="space-y-3">
                {classMaterials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg ${getTypeColor(material.type)} flex items-center justify-center`}>
                        {getTypeIcon(material.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{material.title}</h3>
                          <Badge className={getTypeColor(material.type)}>
                            {material.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Uploaded: {material.uploadedDate}
                          {material.size && ` • Size: ${material.size}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleViewMaterial(material)}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </Button>
                      {material.type !== 'link' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleDownload(material)}
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No materials available for this class yet
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {!isLoading && visibleMaterials.length === 0 && (
        <EmptyState message="No study materials available for your paid classes yet." />
      )}
    </div>
  );
}
