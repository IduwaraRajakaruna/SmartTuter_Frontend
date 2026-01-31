interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
