// componente: FormPadrao.tsx
interface FormPadraoProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export default function FormPadrao({
                                     children,
                                     onSubmit,
                                     className = "max-w-sm", // valor padrão
                                   }: FormPadraoProps) {
  return (
      <form
          onSubmit={onSubmit}
          className={`w-full p-8 rounded bg-transparent ${className}`}
      >
        {children}
      </form>
  );
}
