import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { mockStudyMaterials, mockClasses } from '@/app/lib/mock-data';
import { Upload, FileText, Video, Link as LinkIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog';

export function StudyMaterialsPage() {
  const teacherClasses = mockClasses.filter(c => c.teacherId === 't1');
  const [materials, setMaterials] = useState(mockStudyMaterials);
  const [isUploading, setIsUploading] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    classId: '',
    title: '',
    type: 'pdf' as 'pdf' | 'video' | 'link',
    file: null as File | null,
    url: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.classId || !uploadForm.title) {
      toast.error('Please select a class and enter a title');
      return;
    }

    if (uploadForm.type !== 'link' && !uploadForm.file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (uploadForm.type === 'link' && !uploadForm.url) {
      toast.error('Please enter a URL');
      return;
    }

    setIsUploading(true);

    try {
      // Mock upload - in real app this would upload to backend/storage
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newMaterial = {
        id: `m${materials.length + 1}`,
        classId: uploadForm.classId,
        title: uploadForm.title,
        type: uploadForm.type,
        url: uploadForm.type === 'link' ? uploadForm.url : `/materials/${uploadForm.file?.name}`,
        uploadedDate: new Date().toISOString().split('T')[0],
        size: uploadForm.file ? `${(uploadForm.file.size / 1024 / 1024).toFixed(1)} MB` : undefined,
      };

      setMaterials(prev => [...prev, newMaterial]);
      toast.success('Material uploaded successfully!');
      
      // Reset form
      setUploadForm({
        classId: '',
        title: '',
        type: 'pdf',
        file: null,
        url: '',
      });
    } catch (error) {
      toast.error('Failed to upload material');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (materialId: string) => {
    setMaterials(prev => prev.filter(m => m.id !== materialId));
    toast.success('Material deleted successfully');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'link':
        return <LinkIcon className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Study Materials</h1>
        <p className="text-muted-foreground">Upload and manage learning resources for your classes</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New Material
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Select Class *</Label>
              <Select value={uploadForm.classId} onValueChange={(val) => setUploadForm(prev => ({ ...prev, classId: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent>
                  {teacherClasses.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Material Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Week 1 Lecture Notes"
                value={uploadForm.title}
                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select value={uploadForm.type} onValueChange={(val: any) => setUploadForm(prev => ({ ...prev, type: val }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="link">External Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {uploadForm.type === 'link' ? (
            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://..."
                value={uploadForm.url}
                onChange={(e) => setUploadForm(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="file">Select File *</Label>
              <Input
                id="file"
                type="file"
                accept={uploadForm.type === 'pdf' ? '.pdf' : 'video/*'}
                onChange={handleFileChange}
              />
              {uploadForm.file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {uploadForm.file.name} ({(uploadForm.file.size / 1024 / 1024).toFixed(1)} MB)
                </p>
              )}
            </div>
          )}

          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Material'}
          </Button>
        </CardContent>
      </Card>

      {/* Materials List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {materials.map((material) => {
              const classInfo = mockClasses.find(c => c.id === material.classId);
              return (
                <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(material.type)}
                      <h3 className="font-medium">{material.title}</h3>
                      <Badge className={getTypeColor(material.type)}>
                        {material.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Class: {classInfo?.title} • Uploaded: {material.uploadedDate}
                      {material.size && ` • Size: ${material.size}`}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Material</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{material.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(material.id)} className="bg-red-600 hover:bg-red-700">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
          </div>

          {materials.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No study materials uploaded yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
