import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { mockStudyMaterials, mockClasses } from '@/app/lib/mock-data';
import { FileText, Video, Link as LinkIcon, Download, ExternalLink } from 'lucide-react';
import { EmptyState } from '@/app/components/empty-state';
import { toast } from 'sonner';

export function StudentMaterialsPage() {
  // Mock: Get materials for student's enrolled classes (c1, c2)
  const enrolledClassIds = ['c1', 'c2'];
  const materials = mockStudyMaterials.filter(m => enrolledClassIds.includes(m.classId));

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

  const handleDownload = (material: any) => {
    if (material.type === 'link') {
      window.open(material.url, '_blank');
      toast.success('Opening link...');
    } else {
      // Mock download - in real app this would download from backend
      toast.success(`Downloading ${material.title}...`);
      console.log('Download:', material.url);
    }
  };

  // Group materials by class
  const materialsByClass = enrolledClassIds.map(classId => {
    const classInfo = mockClasses.find(c => c.id === classId);
    const classMaterials = materials.filter(m => m.classId === classId);
    return { classInfo, materials: classMaterials };
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Study Materials</h1>
        <p className="text-muted-foreground">Access learning resources for your enrolled classes</p>
      </div>

      {materialsByClass.map(({ classInfo, materials: classMaterials }) => (
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleDownload(material)}
                    >
                      {material.type === 'link' ? (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          Open
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      )}
                    </Button>
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

      {materials.length === 0 && (
        <EmptyState message="No study materials available yet. Your teachers will upload resources soon." />
      )}
    </div>
  );
}
