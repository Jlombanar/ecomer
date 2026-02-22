function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    enlaces: [
      { name: 'Inicio', href: '#inicio' },
      { name: 'Productos', href: '#productos' },
      { name: 'Carrito', href: '#carrito' }
    ],
    atencion: [
      { name: 'Contacto', href: '#contacto' },
      { name: 'Envíos', href: '#envios' },
      { name: 'Devoluciones', href: '#devoluciones' }
    ],
    legal: [
      { name: 'Términos', href: '#terminos' },
      { name: 'Privacidad', href: '#privacidad' },
      { name: 'Cookies', href: '#cookies' }
    ]
  };

  return (
    <footer id="contacto" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold">TechStore Pro</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Tu tienda de tecnología de confianza con los mejores productos y precios.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.enlaces.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Atención */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Atención</h3>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.atencion.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} TechStore Pro. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;