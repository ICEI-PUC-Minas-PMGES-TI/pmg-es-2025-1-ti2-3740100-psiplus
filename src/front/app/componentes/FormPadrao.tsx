interface FormPadraoProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}

export default function FormPadrao({ children, onSubmit }: FormPadraoProps) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm p-8 rounded bg-transparent rounded shadow-md">
      {children}
    </form>
  );
}
