import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  MousePointer, 
  Users, 
  Percent, 
  Play, 
  Pause, 
  Tag, 
  Lightbulb, 
  X,
  Target,
  Layers,
  ArrowUpRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Campaign, CampaignChannel, PromoCoupon } from '../../types';

export const MarketingManager: React.FC = () => {
  const { 
    campaigns, 
    addCampaign, 
    toggleCampaignStatus, 
    coupons, 
    addCoupon 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'campaigns' | 'coupons' | 'strategy'>('campaigns');
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [isNewCouponModalOpen, setIsNewCouponModalOpen] = useState(false);

  // New campaign form state
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<CampaignChannel>('Google Ads');
  const [objective, setObjective] = useState<Campaign['objective']>('Conversiones / Ventas');
  const [budget, setBudget] = useState<number>(500);
  const [targetSegment, setTargetSegment] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('2026-11-30');
  const [promoCode, setPromoCode] = useState('PRO10');
  const [adHeadline, setAdHeadline] = useState('');
  const [adBody, setAdBody] = useState('');

  // New coupon form state
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number>(15);
  const [couponMinPurchase, setCouponMinPurchase] = useState<number>(60);
  const [couponExpiry, setCouponExpiry] = useState('2026-12-31');

  // Aggregated Marketing KPIs
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const globalROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCPA = totalConversions > 0 ? totalSpend / totalConversions : 0;

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !adHeadline) return;

    addCampaign({
      name,
      channel,
      objective,
      targetSegment: targetSegment || 'Dueños de vehículos y talleres automotrices de la zona',
      budget: Number(budget),
      startDate,
      endDate,
      status: 'Activa',
      promoCode: promoCode ? promoCode.toUpperCase() : undefined,
      adCopyHeadline: adHeadline,
      adCopyBody: adBody || 'Componentes certificados con garantía y despacho rápido en AutoRepuestos Pro.',
    });

    setIsNewCampaignModalOpen(false);
    setName('');
    setAdHeadline('');
    setAdBody('');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    addCoupon({
      code: couponCode.trim().toUpperCase(),
      discountPercent: Number(couponDiscount),
      minPurchase: Number(couponMinPurchase),
      expiryDate: couponExpiry,
      isActive: true,
      timesUsed: 0,
    });

    setIsNewCouponModalOpen(false);
    setCouponCode('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Módulo de Marketing Digital & Publicidad
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión integral de pauta en Google Ads, Meta Ads, WhatsApp y analíticas de ROAS automotriz.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewCouponModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md border border-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Tag className="w-3.5 h-3.5 text-slate-600" />
            <span>Crear Cupón</span>
          </button>
          <button
            onClick={() => setIsNewCampaignModalOpen(true)}
            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Lanzar Campaña</span>
          </button>
        </div>
      </div>

      {/* 5 Marketing Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Inversión Publicitaria */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>Inversión Pauta</span>
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-1.5">
            ${totalSpend.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Presupuesto: ${campaigns.reduce((a, b) => a + b.budget, 0).toFixed(0)}
          </div>
        </div>

        {/* Ingresos Generados */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>Ventas Atribuidas</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600 font-mono tabular-nums mt-1.5">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
            +${(totalRevenue - totalSpend).toFixed(2)} beneficio neto
          </div>
        </div>

        {/* Global ROAS */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>ROAS Global</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-1.5">
            {globalROAS.toFixed(2)}x
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Por cada $1 se generan ${globalROAS.toFixed(2)}
          </div>
        </div>

        {/* Conversiones & CPA */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>Conversiones (CPA)</span>
            <Users className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-1.5">
            {totalConversions}{' '}
            <span className="text-xs font-normal text-slate-500">
              (${avgCPA.toFixed(1)}/cpa)
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {totalClicks} clics cualificados
          </div>
        </div>

        {/* CTR & Alcance */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs col-span-2 lg:col-span-1">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>CTR Promedio</span>
            <MousePointer className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-1.5">
            {avgCTR.toFixed(2)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {totalImpressions.toLocaleString()} impresiones
          </div>
        </div>
      </div>

      {/* Sub-tabs: Campaigns / Coupons / Strategy */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'campaigns'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Campañas Publicitarias ({campaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'coupons'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Cupones & Promociones ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('strategy')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'strategy'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Estrategias de Optimización Automotriz
        </button>
      </div>

      {/* Tab 1: Campaigns Table */}
      {activeTab === 'campaigns' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Campaña & Canal</th>
                  <th className="py-3 px-4">Objetivo & Segmento</th>
                  <th className="py-3 px-4 text-right">Invertido / Presup.</th>
                  <th className="py-3 px-4 text-right">Ingresos</th>
                  <th className="py-3 px-4 text-right">ROAS</th>
                  <th className="py-3 px-4 text-center">Clics / Conv.</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((camp) => {
                  const roas = camp.spend > 0 ? camp.revenue / camp.spend : 0;
                  const isActive = camp.status === 'Activa';

                  return (
                    <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                      {/* Name & Channel */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 line-clamp-1">{camp.name}</div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-semibold text-orange-600">{camp.channel}</span>
                          {camp.promoCode && (
                            <>
                              <span>·</span>
                              <span className="font-mono bg-slate-100 px-1 rounded">{camp.promoCode}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Objective */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-slate-800">{camp.objective}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {camp.targetSegment}
                        </div>
                      </td>

                      {/* Spend / Budget */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        <div className="font-bold text-slate-900">${camp.spend.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-400">de ${camp.budget.toFixed(2)}</div>
                      </td>

                      {/* Revenue */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                        ${camp.revenue.toFixed(2)}
                      </td>

                      {/* ROAS */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        <span className="font-bold text-slate-900 text-sm">{roas.toFixed(2)}x</span>
                      </td>

                      {/* Clicks / Conversions */}
                      <td className="py-3 px-4 text-center font-mono tabular-nums">
                        <span className="font-bold text-slate-900">{camp.conversions}</span>
                        <span className="text-[10px] text-slate-400 ml-1">({camp.clicks} clics)</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {camp.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => toggleCampaignStatus(camp.id)}
                          className={`p-1.5 rounded transition-colors ${
                            isActive
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={isActive ? 'Pausar campaña' : 'Activar campaña'}
                        >
                          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Promo Coupons */}
      {activeTab === 'coupons' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Códigos de Descuento Vigentes
            </span>
            <span className="text-xs text-slate-500">
              Utilizados por los clientes en el carrito de compras
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Código Cupón</th>
                  <th className="py-3 px-4 text-center">Descuento</th>
                  <th className="py-3 px-4 text-right">Compra Mínima</th>
                  <th className="py-3 px-4">Vencimiento</th>
                  <th className="py-3 px-4 text-center">Veces Usado</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {coupons.map((c) => (
                  <tr key={c.code} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-orange-600 text-sm">
                      {c.code}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">
                      {c.discountPercent}% OFF
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-700">
                      ${c.minPurchase.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-600">
                      {c.expiryDate}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900 tabular-nums">
                      {c.timesUsed} pedidos
                    </td>
                    <td className="py-3 px-4 text-center font-sans">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Activo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Automotive Marketing Strategic Guidelines */}
      {activeTab === 'strategy' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-orange-600">
              <Target className="w-5 h-5" />
              <h4 className="font-bold text-slate-900 text-sm">Google Search Ads de Alta Intención</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Los clientes que buscan códigos exactos como <strong>"Pastillas Brembo Hilux"</strong> o <strong>"Amortiguadores Monroe Cruze"</strong> tienen una tasa de conversión superior al <strong>14.2%</strong>. Mantén concordancia exacta de palabras clave con el modelo de vehículo.
            </p>
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
              Recomendación: Asignar al menos el 50% del presupuesto a pauta de búsqueda técnica.
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600">
              <Users className="w-5 h-5" />
              <h4 className="font-bold text-slate-900 text-sm">WhatsApp Business para Talleres</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Los mecánicos valoran la rapidez de respuesta más que los descuentos. El canal directo por WhatsApp con cupón <strong>TALLERPRO</strong> y entrega en 2 horas genera un ROAS promedio de <strong>44x</strong> con recurrencia semanal.
            </p>
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
              Recomendación: Enviar catálogo quincenal de aceites, filtros y distribución los días lunes a las 08:30 AM.
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <Sparkles className="w-5 h-5" />
              <h4 className="font-bold text-slate-900 text-sm">Estacionalidad Automotriz</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              En épocas previas a vacaciones y feriados largos aumenta en un <strong>+65%</strong> la demanda de discos de freno, líquidos DOT4 y kits de amortiguación. Lanza campañas preventivas 3 semanas antes del inicio de temporada.
            </p>
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
              Recomendación: Programar campaña "Viaje Seguro: Frenos y Suspensión Verificados".
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Campaign */}
      {isNewCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">
                  Lanzar Nueva Campaña Publicitaria
                </h3>
              </div>
              <button
                onClick={() => setIsNewCampaignModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Nombre de la Campaña *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Google Ads: Frenos Brembo y Bosch Alta Exigencia"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-orange-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Canal Publicitario</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-orange-500 text-slate-900"
                  >
                    <option value="Google Ads">Google Ads (Search & Shopping)</option>
                    <option value="Meta Ads">Meta Ads (Facebook & Instagram)</option>
                    <option value="WhatsApp Business">WhatsApp Business Broadcast</option>
                    <option value="Email Marketing">Email Marketing Automation</option>
                    <option value="TikTok Ads">TikTok Ads (Video técnico)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Objetivo de Marketing</label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-orange-500 text-slate-900"
                  >
                    <option value="Conversiones / Ventas">Conversiones / Ventas</option>
                    <option value="Tráfico a Catálogo">Tráfico a Catálogo</option>
                    <option value="Retargeting de Carrito">Retargeting de Carrito</option>
                    <option value="Clientes de Taller">Clientes de Taller</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Presupuesto Asignado ($)</label>
                  <input
                    type="number"
                    min={10}
                    required
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Cupón Asociado</label>
                  <select
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono uppercase"
                  >
                    <option value="">Sin cupón específico</option>
                    {coupons.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.discountPercent}% OFF)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Público / Segmento Objetivo</label>
                  <input
                    type="text"
                    placeholder="ej. Propietarios de Toyota y Chevrolet que buscan frenos cerámicos"
                    value={targetSegment}
                    onChange={(e) => setTargetSegment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Fecha Término</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Titular del Anuncio Publicitario *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Pastillas y Discos Brembo Originales | Envío Gratis en 24h"
                    value={adHeadline}
                    onChange={(e) => setAdHeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-medium text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Cuerpo / Copy del Anuncio</label>
                  <textarea
                    rows={2}
                    placeholder="ej. Frenada precisa sin ruidos ni vibraciones. Catálogo compatible con tu modelo."
                    value={adBody}
                    onChange={(e) => setAdBody(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              {adHeadline && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Vista Previa del Anuncio ({channel})
                  </span>
                  <div className="text-blue-700 font-medium text-sm hover:underline cursor-pointer">
                    {adHeadline}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-mono">
                    https://www.autorepuestospro.com/catalogo
                  </div>
                  <p className="text-slate-600 text-xs">
                    {adBody || 'Componentes de precisión garantizados.'}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewCampaignModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-md shadow-xs"
                >
                  Publicar Campaña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Coupon */}
      {isNewCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">
                  Crear Nuevo Cupón Promocional
                </h3>
              </div>
              <button
                onClick={() => setIsNewCouponModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Código del Cupón *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. FRENO25, OTOÑO15"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono uppercase font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">% de Descuento *</label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  required
                  value={couponDiscount}
                  onChange={(e) => setCouponDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Compra Mínima ($) *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={couponMinPurchase}
                  onChange={(e) => setCouponMinPurchase(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Fecha de Expiración</label>
                <input
                  type="date"
                  required
                  value={couponExpiry}
                  onChange={(e) => setCouponExpiry(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewCouponModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-md shadow-xs"
                >
                  Guardar Cupón
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
