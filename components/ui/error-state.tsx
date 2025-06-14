import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Bir hata oluştu",
  message = "Sayfa yüklenirken bir sorun yaşandı. Lütfen tekrar deneyin.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[400px] text-center ${className}`}
    >
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tekrar Dene
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "Henüz içerik yok",
  message = "Burada gösterilecek bir şey bulunamadı.",
  icon: Icon,
  action,
}: {
  title?: string;
  message?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
      {Icon && <Icon className="w-16 h-16 text-gray-600 mb-4" />}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md">{message}</p>
      {action}
    </div>
  );
}
