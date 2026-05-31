import { useEffect, useMemo, useState } from 'react';
import { FileText, Video, Link as LinkIcon, Search, BookOpen, Trash2 } from 'lucide-react';
import { StatCard } from '@/app/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { EmptyState } from '@/app/components/empty-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { toast } from 'sonner';
import type { StudyMaterial } from '@/services/materialsService';
import { listMaterials, deleteMaterial } from '@/services/materialsService';

export function AdminContentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await listMaterials();
        setMaterials(data);
      } catch (e: any) {
        toast.error(e?.message || 'Failed to load materials');
      }
    })();
  }, []);

  const pdfCount = useMemo(() => materials.filter((m) => m.type === 'pdf').length, [materials]);
  const videoCount = useMemo(() => materials.filter((m) => m.type === 'video').length, [materials]);
  const linkCount = useMemo(() => materials.filter((m) => m.type === 'link').length, [materials]);

  const filteredMaterials = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return materials;

    return materials.filter((m) => {
      const haystack = [m.title, m.classId, m.type, m.url].join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }, [materials, searchTerm]);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'video':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'link':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getClassTitle = (classId: string) => {
    // Classes are stored only in frontend localStorage.
    // Admin page needs to map classId -> class title for display.
    // Fallback to classId if class data isn't available.
    try {
      const raw = localStorage.getItem('smarttuter.classes');
      if (!raw) return classId;
      const classes = JSON.parse(raw) as Array<{ id: string; title: string }>;
      return classes.find((c) => c.id === classId)?.title || classId;
    } catch {
      return classId;
    }
  };

  const handleDelete = async (materialId: string) => {
    try {
      await deleteMaterial(materialId);
      setMaterials((prev) => prev.filter((m) => m.id !== materialId));
      toast.success('Material deleted');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Content Monitoring</h1>
        <p className="text-muted-foreground">Track uploaded study materials across the platform</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Materials"
          value={materials.length}
          icon={BookOpen}
          description="All uploads"
          color="blue"
        />
        <StatCard title="PDF Resources" value={pdfCount} icon={FileText} description="Documents" color="cyan" />
        <StatCard
          title="Video Lessons"
          value={videoCount}
          icon={Video}
          description="Recorded sessions"
          color="purple"
        />
        <StatCard
          title="External Links"
          value={linkCount}
          icon={LinkIcon}
          description="Shared resources"
          color="green"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Study Materials</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, class, type"
                value={searchTerm}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredMaterials.length === 0 ? (
            <EmptyState message="No study materials match your search" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.title}</TableCell>
                    <TableCell>{getClassTitle(material.classId)}</TableCell>
                    <TableCell>
                      <Badge className={getTypeBadge(material.type)}>{material.type}</Badge>
                    </TableCell>
                    <TableCell>{material.uploadedDate}</TableCell>
                    <TableCell>{material.size ?? '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(material.url, '_blank', 'noopener,noreferrer')}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(material.id)}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

