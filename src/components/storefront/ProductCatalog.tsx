import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Check, 
  AlertCircle, 
  Eye, 
  CheckCircle2, 
  X,
  Disc,
  Wrench,
  Fuel,
  Cpu,
  Zap,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';

const CATEGORIES: { id: ProductCategory | 'todas'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'todas', label: 'Todo el Catálogo', icon: Wrench },
  { id: 'frenos', label: 'Frenos & Discos', icon: Disc },
  { id: 'suspension', label: 'Suspensión & Amortiguadores', icon: Wrench },
  { id: 'motor', label: 'Motor, Filtros & Aceites', icon: Fuel },
  { id: 'transmision', label: 'Embrague & Transmisión', icon: Cpu },
  { id: 'electrico', label: 'Baterías & Eléctrico', icon: Zap },
  { id: 'iluminacion', label: 'Iluminación LED', icon: Lightbulb },
];

export const ProductCatalog: React.FC = () => {
  const { 
    products, 
    addToCart, 
    setInspectingProduct, 
    selectedVehicle, 
    clearVehicleFilter 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todas'>('todas');
  const [selectedBrand, setSelectedBrand] = useState<string>('todas');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating'>('relevance');

  // Available brands derived from current products
  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort();
  }, [products]);

  // Compatibility checking helper
  const isCompatibleWithSelectedVehicle = (product: Product): boolean => {
    if (!selectedVehicle || !selectedVehicle.make) return true;

    return product.compatibleVehicles.some((compat) => {
      const makeMatch = compat.make.toLowerCase() === selectedVehicle.make.toLowerCase();
      if (!makeMatch) return false;

      // If user selected model, check model
      if (selectedVehicle.model) {
        const modelMatch = compat.model.toLowerCase().includes(selectedVehicle.model.toLowerCase()) ||
          selectedVehicle.model.toLowerCase().includes(compat.model.toLowerCase());
        if (!modelMatch) return false;
      }

      // If user selected year, check year array
      if (selectedVehicle.year) {
        const yearMatch = compat.years.includes(selectedVehicle.year);
        if (!yearMatch) return false;
      }

      return true;
    });
  };

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'todas' && p.category !== selectedCategory) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'todas' && p.brand !== selectedBrand) {
          return false;
        }

        // Origin filter
        if (selectedOrigin !== 'todas' && p.origin !== selectedOrigin) {
          return false;
        }

        // Search query (name, sku, oemReference)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.oemReference.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Vehicle compatibility filter if active
        if (selectedVehicle && selectedVehicle.make) {
          return isCompatibleWithSelectedVehicle(p);
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPercent ? a.price * (1 - a.discountPercent / 100) : a.price;
        const priceB = b.discountPercent ? b.price * (1 - b.discountPercent / 100) : b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Relevance: featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedBrand, selectedOrigin, searchQuery, sortBy, selectedVehicle]);

  // Helper for product icon based on category
  const renderCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case 'frenos':
        return <Disc className="w-16 h-16 text-slate-500 group-hover:text-orange-500 transition-colors" />;
      case 'suspension':
        return <Wrench className="w-16 h-16 text-slate-500 group-hover:text-orange-500 transition-colors" />;
      case 'motor':
        return <Fuel className="w-16 h-16 text-slate-500 group-hover:text-orange-500 transition-colors" />;
      case 'transmision':
        return <Cpu className="w-16 h-16 text-slate-500 group-hover:text-orange-500 transition-colors" />;
      case 'electrico':
        return <Zap className="w-16 h-16 text-slate-500 group-hover:text-orange-500 transition-colors" />;
      case 'iluminacion':
        return <Lightbulb className="w-16 h-16 text-slate-500 group-hover:text-orange-500 transition-colors" />;
      default:
        return <Sparkles className="w-16 h-16 text-slate-500 group-hover:text-orange-500 transition-colors" />;
    }
  };

  return (
    <section id="catalogo-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Category Tabs Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Catálogo de Componentes Automotrices
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Selecciona una categoría o utiliza los filtros para ubicar números de parte exactos.
            </p>
          </div>

          {/* Active vehicle compatibility callout banner */}
          {selectedVehicle && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Filtrando repuestos compatibles con:{' '}
                <strong>
                  {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.year || ''}
                </strong>
              </span>
              <button
                onClick={clearVehicleFilter}
                className="text-emerald-700 hover:text-emerald-900 p-0.5 rounded ml-2"
                title="Mostrar todos los vehículos"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Interactive category buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-400' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Toolbar: Search, Brand, Origin, Sort */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-8 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          {/* Search box */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por repuesto, SKU (ej. BRM-P8304) o código OEM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Brand select */}
          <div className="lg:col-span-2">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-orange-500"
            >
              <option value="todas">Todas las marcas</option>
              {uniqueBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Origin select */}
          <div className="lg:col-span-2">
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-orange-500"
            >
              <option value="todas">Cualquier tipo</option>
              <option value="OEM Original">OEM Original</option>
              <option value="Aftermarket Certificado">Aftermarket Certificado</option>
              <option value="Performance Racing">Performance Racing</option>
            </select>
          </div>

          {/* Sort order select */}
          <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-orange-500"
            >
              <option value="relevance">Ordenar: Destacados primero</option>
              <option value="price-asc">Precio: Menor a mayor</option>
              <option value="price-desc">Precio: Mayor a menor</option>
              <option value="rating">Mejor calificación</option>
            </select>
          </div>

        </div>

        {/* Results count & reset quick action */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Mostrando <strong>{filteredProducts.length}</strong> de {products.length} productos disponibles
          </span>
          {(selectedCategory !== 'todas' || selectedBrand !== 'todas' || selectedOrigin !== 'todas' || searchQuery || selectedVehicle) && (
            <button
              onClick={() => {
                setSelectedCategory('todas');
                setSelectedBrand('todas');
                setSelectedOrigin('todas');
                setSearchQuery('');
                clearVehicleFilter();
              }}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Restablecer todos los filtros
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron repuestos</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            No existen repuestos que cumplan con los filtros actuales
            {selectedVehicle ? ` para ${selectedVehicle.make} ${selectedVehicle.model}` : ''}.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('todas');
              setSelectedBrand('todas');
              setSelectedOrigin('todas');
              setSearchQuery('');
              clearVehicleFilter();
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors"
          >
            Ver todo el catálogo general
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const finalPrice = product.discountPercent
              ? product.price * (1 - product.discountPercent / 100)
              : product.price;

            const isLowStock = product.stock <= product.minStockAlert && product.stock > 0;
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col justify-between hover:border-slate-400 hover:shadow-md transition-all group"
              >
                <div>
                  {/* Visual Header / Real Product Photo with dark technical background */}
                  <div className="relative h-52 bg-slate-950 flex flex-col items-center justify-center border-b border-slate-200 overflow-hidden">
                    {/* Real product photo if available */}
                    {product.imageUrl ? (
                      <div className="w-full h-full overflow-hidden bg-slate-900">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          width="720"
                          height="540"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <>
                        <div 
                          className="absolute inset-0 opacity-15 pointer-events-none"
                          style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
                            backgroundSize: '16px 16px',
                          }}
                        />
                        <div className="relative z-10 transition-transform group-hover:scale-105 duration-200 p-4">
                          {renderCategoryIcon(product.category)}
                        </div>
                      </>
                    )}

                    {/* Quick view button overlay */}
                    <button
                      onClick={() => setInspectingProduct(product)}
                      className="absolute bottom-3 right-3 z-20 px-2.5 py-1 bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] font-medium rounded flex items-center gap-1 backdrop-blur-xs border border-slate-700 transition-colors shadow-sm"
                    >
                      <Eye className="w-3 h-3 text-orange-400" />
                      <span>Ficha Técnica</span>
                    </button>

                    {/* Discount tag if applicable */}
                    {product.discountPercent ? (
                      <span className="absolute top-3 left-3 z-20 bg-orange-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm tabular-nums">
                        -{product.discountPercent}% OFF
                      </span>
                    ) : null}

                    {/* Warranty indicator */}
                    <span className="absolute top-3 right-3 z-20 text-[10px] text-slate-400 font-mono">
                      Garantía: {product.warrantyMonths}m
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    {/* Unboxed Metadata (Zero-pill rule: unboxed text with ·) */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="text-orange-600 font-bold uppercase">{product.brand}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{product.origin}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[11px] text-slate-400">{product.sku}</span>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => setInspectingProduct(product)}
                      className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 hover:text-orange-600 cursor-pointer transition-colors"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Vehicle Compatibility Note */}
                    <div className="pt-1">
                      {selectedVehicle ? (
                        <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Calce exacto verificado</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-500 truncate">
                          Compat: {product.compatibleVehicles.map((v) => `${v.make} ${v.model}`).slice(0, 2).join(', ')}...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Add to Cart */}
                <div className="p-4 pt-2 border-t border-slate-100 mt-2 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-lg font-bold text-slate-900 tabular-nums">
                        ${finalPrice.toFixed(2)}
                      </div>
                      {product.discountPercent ? (
                        <div className="text-xs text-slate-400 line-through tabular-nums -mt-0.5">
                          ${product.price.toFixed(2)}
                        </div>
                      ) : null}
                    </div>

                    <div className="text-right">
                      {isOutOfStock ? (
                        <span className="text-xs font-semibold text-rose-600">Agotado</span>
                      ) : isLowStock ? (
                        <span className="text-xs font-semibold text-amber-600">
                          ¡Últimas {product.stock} un.!
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium">
                          {product.stock} disponibles
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    disabled={isOutOfStock}
                    className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 group-hover:bg-orange-600 group-hover:hover:bg-orange-500"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{isOutOfStock ? 'Sin Existencias' : 'Agregar al Carrito'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
