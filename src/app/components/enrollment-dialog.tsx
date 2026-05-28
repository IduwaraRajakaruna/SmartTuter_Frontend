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
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Class } from '@/app/lib/mock-data';
import { CreditCard, Wallet, Building2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface EnrollmentDialogProps {
  classData: Class | null;
  isOpen: boolean;
  onClose: () => void;
  onEnrollSuccess: () => void;
}

export function EnrollmentDialog({ classData, isOpen, onClose, onEnrollSuccess }: EnrollmentDialogProps) {
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!classData) return null;

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setStep('processing');

    try {
      // Mock payment processing - in real app this would call payment gateway
      await new Promise(resolve => setTimeout(resolve, 2000));

      setStep('success');
      toast.success('Enrollment successful!');
      
      // Notify parent component
      setTimeout(() => {
        onEnrollSuccess();
        handleClose();
      }, 2000);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('payment');
    setPaymentMethod('card');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle>Enroll in Class</DialogTitle>
              <DialogDescription>
                Complete payment to enroll in {classData.title}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="bg-accent/50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Class</span>
                  <span className="font-medium">{classData.title}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Teacher</span>
                  <span className="font-medium">{classData.teacherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Amount</span>
                  <span className="text-lg font-bold">Rs {classData.price}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Select Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-4 h-4" />
                      Credit / Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="w-4 h-4" />
                      UPI
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Building2 className="w-4 h-4" />
                      Net Banking
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleConfirmPayment}>
                Pay Rs {classData.price}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'processing' && (
          <div className="py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <h3 className="text-lg font-medium">Processing Payment...</h3>
              <p className="text-sm text-muted-foreground">Please wait while we process your payment</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium">Enrollment Successful!</h3>
              <p className="text-sm text-muted-foreground text-center">
                You have been enrolled in {classData.title}. Check your email for class details.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
