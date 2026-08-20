import React from "react";

interface State {
  error: Error | null;
}

// Evita la pantalla en blanco: captura errores de render y muestra un mensaje.
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("OFIX ErrorBoundary:", error, info);
  }

  reset = () => {
    localStorage.removeItem("ofix-data");
    localStorage.removeItem("ofix-token");
    window.location.href = "/";
  };

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
          <h1 className="text-2xl font-bold text-destructive">Ups, algo salió mal</h1>
          <p className="max-w-md text-muted-foreground">
            Ocurrió un error al mostrar esta pantalla. Podés reiniciar los datos de demo y volver al inicio.
          </p>
          <pre className="max-w-lg overflow-auto rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
            {this.state.error.message}
          </pre>
          <button onClick={this.reset} className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">
            Reiniciar y volver al inicio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
