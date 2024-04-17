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
} from "@/components/ui/alert-dialog"

type AlertDialogButtonProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  onConfirm: () => void;
}

// Component setup for a customizable alert dialog with confirm and cancel options.
// Props include title, description, onConfirm handler, and children (trigger component).
export default function AlertDialogButton({ children, title, description, onConfirm }: AlertDialogButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* AlertDialogTrigger wraps the child element that will trigger the dialog;
        typically a button or similar clickable element. */}
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* The AlertDialogAction component triggers the onConfirm function passed as a prop,
          executing the desired action on user confirmation. */}
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}