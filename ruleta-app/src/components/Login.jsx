 import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Login({ setAuth }) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Ruta a la que se redirigirá después del login, por defecto /admin
  const from = location.state?.from?.pathname || '/admin';

  const handleLogin = (e) => {
    e.preventDefault();

    const inputHash = btoa(`${usuario}:${clave}`);
    const expectedHash = import.meta.env.VITE_AUTH_HASH;

    if (inputHash === expectedHash) {
      setAuth(true);
      navigate(from, { replace: true }); // redirige a la ruta original
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h4>Ingreso a panel administrador</h4>
      <form
        onSubmit={handleLogin}
        className="mt-3"
        style={{ maxWidth: '300px', margin: '0 auto' }}
      >
        <input
          className="form-control mb-2"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />
        {error && <div className="alert alert-danger">{error}</div>}
        <button className="btn btn-primary w-100" type="submit">
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default Login;
