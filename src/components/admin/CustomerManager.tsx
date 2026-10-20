import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Car, 
  Phone, 
  Mail, 
  DollarSign, 
  ShoppingBag, 
  X,
  Building,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';

export const CustomerManager: React.FC = () => {
  const { customers, currentCustomer, setCurrentCustomer, registerCustomer, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('todos');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New customer form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Santiago');
  const [taxId, setTaxId] = useState('');
  const [type, setType] = useState<Customer['type']>('Particular');

  const filteredCustomers = customers.filter((c) => {
    if (filterType !== 'todos' && c.type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.taxId.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !taxId) return;

    registerCustomer({
      name,
      email,
      phone: phone || '+56 9 8000 0000',
      address: address || 'Dirección comercial principal',
      city,
      taxId,
      type,
    });

    setIsNewModalOpen(false);
    setName('');
    setEmail('');
    setTaxId('');
  };

  const handleSetCurrentCustomer = (c: Customer) => {
    setCurrentCustomer(c);
    addToast(`Sesión cambiada al cliente: ${c.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Registro y Directorio de Clientes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de cuentas para clientes particulares, talleres mecánicos afiliados y flotas de transporte.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Cliente</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, RUT/DNI o ciudad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="lg:col-span-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-orange-500"
            >
              <option value="todos">Todos los perfiles</option>
              <option value="Particular">Particular</option>
              <option value="Taller Mecánico">Taller Mecánico</option>
              <option value="Flotilla">Flotilla de Transporte</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Cliente & Identificación</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Contacto & Ubicación</th>
                <th className="py-3 px-4">Garaje (Autos)</th>
                <th className="py-3 px-4 text-center">Pedidos</th>
                <th className="py-3 px-4 text-right">Gasto Histórico</th>
                <th className="py-3 px-4 text-right">Sesión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => {
                const isCurrent = currentCustomer.id === cust.id;

                return (
                  <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                    {/* Name & Tax ID */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{cust.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        RUT/DNI: {cust.taxId}
                      </div>
                    </td>

                    {/* Customer Type */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700">{cust.type}</span>
                    </td>

                    {/* Contact & City */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800">{cust.email}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {cust.phone} · {cust.city}
                      </div>
                    </td>

                    {/* Garage */}
                    <td className="py-3 px-4">
                      {cust.garage.length === 0 ? (
                        <span className="text-slate-400 italic">Sin autos</span>
                      ) : (
                        <div className="space-y-0.5">
                          {cust.garage.map((g) => (
                            <div key={g.id} className="text-[11px] text-slate-700 flex items-center gap-1">
                              <Car className="w-3 h-3 text-orange-500" />
                              <span>{g.make} {g.model} ({g.year})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Orders count */}
                    <td className="py-3 px-4 text-center font-bold tabular-nums">
                      {cust.ordersCount}
                    </td>

                    {/* Total spent */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ${cust.totalSpent.toFixed(2)}
                    </td>

                    {/* Switch profile session button */}
                    <td className="py-3 px-4 text-right">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Activo</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetCurrentCustomer(cust)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded transition-colors"
                        >
                          Usar Perfil
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register Customer */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">
                  Registrar Nuevo Cliente
                </h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nombre o Razón Social *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Taller Mecánico Los Andes o Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">RUT o DNI *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. 76.842.119-4"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tipo de Cliente</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                  >
                    <option value="Particular">Particular</option>
                    <option value="Taller Mecánico">Taller Mecánico</option>
                    <option value="Flotilla">Flotilla de Transporte</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="+56 9 8412 3901"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Dirección</label>
                  <input
                    type="text"
                    placeholder="Calle, número o taller"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-md shadow-xs"
                >
                  Crear Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
