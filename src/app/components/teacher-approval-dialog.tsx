import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { TeacherApproval } from '@/app/lib/teacher-approvals';

interface TeacherApprovalDialogProps {
  teacher: TeacherApproval | null;
  action: 'approve' | 'reject' | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (teacherId: string, action: 'approve' | 'reject', reason?: string) => void;
}

export function TeacherApprovalDialog({ teacher, action, isOpen, onClose, onConfirm }: TeacherApprovalDialogProps) {
  const [reason, setReason] = useState('');

  if (!teacher || !action) return null;

  const handleConfirm = () => {
    onConfirm(teacher.id, action, reason);
    setReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === 'approve' ? 'Approve Teacher' : 'Reject Teacher'}
          </DialogTitle>
          <DialogDescription>
            {action === 'approve' 
              ? `Approve ${teacher.name} as a teacher on the platform?`
              : `Reject ${teacher.name}'s application?`
            }
          </DialogDescription>
        </DialogHeader>

        {action === 'approve' && (
          <div className="py-4">
            <div className="space-y-2 bg-accent/50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="font-medium">{teacher.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Subject</span>
                <span className="font-medium">{teacher.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Qualification</span>
                <span className="font-medium">{teacher.qualification}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Experience</span>
                <span className="font-medium">{teacher.experience} years</span>
              </div>
            </div>
          </div>
        )}

        {action === 'reject' && (
          <div className="py-4 space-y-2">
            <Label htmlFor="reason">Rejection Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Provide a reason for rejection..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              This reason will be sent to the applicant via email.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className={action === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
