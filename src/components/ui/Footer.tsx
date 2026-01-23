
export function Footer() {
    return (
        <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 border-t border-medical-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-medical-600">
              © 2025 Medly. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-medical-600">
              <a href="#" className="hover:text-primary-600 transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
}