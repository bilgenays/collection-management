'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useSession';
import { collectionsService } from '@/lib/services/api';
import { ProductData } from '@/lib/types/api';
import FilterListIcon from '@mui/icons-material/FilterList';
import Image from 'next/image';
import axios from 'axios';
import FilterDrawer from '@/components/FilterDrawer';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCollectionStore } from '@/lib/store/useCollectionStore';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { FilterValues } from '@/components/FilterDrawer';

interface Filter {
  id: string;
  title: string;
  value: string;
  valueName: string;
  currency: string | null;
  comparisonType: number;
}

export default function EditCollectionPage() {
  const session = useAuth();
  const router = useRouter();
  const params = useParams();
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedConstant, setSelectedConstant] = useState<string | null>(null);
  const [collectionFilters, setCollectionFilters] = useState<Filter[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);
  const [viewMode, setViewMode] = useState<'small' | 'medium' | 'large'>('medium');

  const {
    products,
    constants,
    addedProducts,
    currentPage,
    setProducts,
    setConstants,
    addToConstants,
    removeFromConstants,
    addToAddedProducts,
    removeFromAddedProducts,
    setCurrentPage,
    setAddedProducts,
    resetStore,
  } = useCollectionStore();

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const constantKeys = new Set(
      constants.map(constant => `${constant.productCode}-${constant.colorCode}`)
    );
    setAddedProducts(constantKeys);
  }, [constants, setAddedProducts]);

  useEffect(() => {
    resetStore();
  }, [params.id, resetStore]);

  useEffect(() => {
    if (!session?.accessToken) {
      router.replace('/login');
      return;
    }

    const fetchCollection = async () => {
      try {
        setIsApiLoading(true);
        setError(null);
        const response = await collectionsService.getProducts(Number(params.id), {
          page: 1,
          pageSize: 36,
          additionalFilters: [],
        });

        setProducts(response.data.data || []);
        if (constants.length === 0) {
          setConstants([]);
        }

        if (currentPage === 0) {
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Koleksiyon yüklenirken hata oluştu:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            setError('Bu koleksiyona erişim yetkiniz yok');
          } else if (error.response?.status === 401) {
            router.replace('/login');
          } else {
            setError('Koleksiyon yüklenirken bir hata oluştu');
          }
        }
      } finally {
        setIsApiLoading(false);
      }
    };

    fetchCollection();
  }, [
    params.id, 
    session, 
    router, 
    setProducts, 
    setConstants, 
    setCurrentPage,
    constants.length,
    currentPage,
  ]);

  useEffect(() => {
    const fetchCollectionFilters = async () => {
      try {
        const response = await collectionsService.getAll();
        const currentCollection = response.data?.find(c => c.id === Number(params.id));
        if (currentCollection?.filters?.filters) {
          setCollectionFilters(currentCollection.filters.filters.map(filter => ({
            id: filter.value,
            title: filter.valueName,
            value: filter.value,
            valueName: filter.valueName,
            currency: null,
            comparisonType: 0
          })));
          setSelectedFilters(currentCollection.filters.filters.map(filter => ({
            id: filter.value,
            title: filter.valueName,
            value: filter.value,
            valueName: filter.valueName,
            currency: null,
            comparisonType: 0
          })));
        }
      } catch (error) {
        console.error('Koleksiyon filtreleri yüklenirken hata oluştu:', error);
      }
    };

    fetchCollectionFilters();
  }, [params.id]);

  const handleDragStart = (e: React.DragEvent, product: ProductData) => {
    e.dataTransfer.setData('product', JSON.stringify(product));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const product = JSON.parse(e.dataTransfer.getData('product')) as ProductData;
      addToConstants(product);
      addToAddedProducts(`${product.productCode}-${product.colorCode}`);
    } catch (error) {
      console.error('Drop işlemi sırasında hata:', error);
    }
  };

  const handleSave = () => {
    Swal.fire({
      title: 'Başarılı!',
      text: 'Değişiklikler kaydedildi.',
      icon: 'success',
      confirmButtonColor: '#000',
      confirmButtonText: 'Tamam'
    });
  };

  const handleApplyFilters = async (filters: FilterValues) => {
    try {
      setIsApiLoading(true);
      const response = await collectionsService.getProducts(Number(params.id), {
        page: 1,
        pageSize: 36,
        additionalFilters: [
          ...Object.entries(filters).map(([key, value]) => ({
            id: key,
            value: String(value),
            comparisonType: 0
          })),
        ].filter(Boolean),
      });
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Filtreleme sırasında hata oluştu:', error);
    } finally {
      setIsApiLoading(false);
    }
  };

  const paginatedConstants = constants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(constants.length / ITEMS_PER_PAGE);

  const handleConstantClick = (productKey: string) => {
    setSelectedConstant(productKey);
  };

  const handleDeleteConstant = (constant: ProductData) => {
    const productKey = `${constant.productCode}-${constant.colorCode}`;
    
    Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu ürün sabitlerden çıkarılacaktır.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Evet, çıkar',
      cancelButtonText: 'Vazgeç'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          removeFromConstants(productKey);
          removeFromAddedProducts(productKey);
          setSelectedConstant(null);

          Swal.fire({
            title: 'Başarılı!',
            text: 'Ürün sabitlerden başarıyla çıkarıldı.',
            icon: 'success',
            confirmButtonColor: '#000',
            confirmButtonText: 'Tamam'
          });
        } catch (error) {
          console.error('Çıkarma işlemi sırasında hata oluştu:', error);
          Swal.fire({
            title: 'Hata!',
            text: 'Ürün çıkarılırken bir hata oluştu.',
            icon: 'error',
            confirmButtonColor: '#000',
            confirmButtonText: 'Tamam'
          });
        }
      }
    });
  };

  const getGridStyles = () => {
    switch (viewMode) {
      case 'small':
        return {
          gridCols: 'grid-cols-4',
          containerClass: 'h-[180px]',
          imageClass: 'h-[100px]'
        };
      case 'large':
        return {
          gridCols: 'grid-cols-2',
          containerClass: 'h-[300px]',
          imageClass: 'h-[200px]'
        };
      default:
        return {
          gridCols: 'grid-cols-3',
          containerClass: 'h-[220px]',
          imageClass: 'h-[140px]'
        };
    }
  };

  const gridStyles = getGridStyles();

  if (isApiLoading && products.length === 0) {
    return <div className="flex justify-center items-center h-full">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-150px)]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2 w-full border-2 border-gray-200 rounded-md p-2">
          <div className="flex items-center gap-2">
            {collectionFilters.map((filter, index) => (
              <span 
                key={index} 
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {filter.valueName || filter.value}
              </span>
            ))}
          </div>
        </div>
        <button 
          onClick={() => setIsFilterDrawerOpen(true)}
          className="flex items-center gap-2 ml-4 px-4 py-2 border-2 border-gray-200 rounded-md hover:bg-gray-50"
        >
          <span className="text-sm font-medium">Filtreler</span>
          <FilterListIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex gap-6 flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <h2 className="text-lg font-medium mb-4 font-poppins">Koleksiyon Ürünleri</h2>
          <div className="overflow-y-auto pr-2 flex-1">
            <div className="grid grid-cols-3 gap-4">
              {products.map((product) => {
                const productKey = `${product.productCode}-${product.colorCode}`;
                const isAdded = addedProducts.has(productKey);

                return (
                  <div
                    key={productKey}
                    draggable={!isAdded}
                    onDragStart={(e) => handleDragStart(e, product)}
                    className={`relative border rounded-lg p-4 bg-white shadow-sm 
                      ${!isAdded ? 'cursor-move hover:shadow-md' : ''} 
                      transition-all duration-300`}
                  >
                    <div className="relative aspect-square mb-2">
                      <Image
                        src={product.imageUrl}
                        alt={product.productCode}
                        fill
                        className={`object-cover rounded ${isAdded ? 'blur-sm' : ''}`}
                      />
                    </div>
                    <div className="text-sm font-medium">{product.productCode}</div>
                    <div className="text-xs text-gray-500">Renk: {product.colorCode}</div>
                    {product.outOfStock && (
                      <div className="text-xs text-red-500 mt-1">Stokta Yok</div>
                    )}
                    
                    {isAdded && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg 
                        flex items-center justify-center text-white font-medium">
                        EKLENDİ
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium font-poppins">Sabitler</h2>
            <div className="flex items-center gap-1 border rounded-md">
              <button
                onClick={() => setViewMode('small')}
                className={`p-1.5 ${viewMode === 'small' ? 'bg-gray-100' : ''}`}
                title="Küçük Görünüm"
              >
                <ViewModuleIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('medium')}
                className={`p-1.5 ${viewMode === 'medium' ? 'bg-gray-100' : ''}`}
                title="Orta Görünüm"
              >
                <GridViewIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('large')}
                className={`p-1.5 ${viewMode === 'large' ? 'bg-gray-100' : ''}`}
                title="Büyük Görünüm"
              >
                <ViewListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div 
            className="flex-1 border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className={`grid ${gridStyles.gridCols} gap-4 mb-4 overflow-y-auto flex-1 h-[600px] min-h-[600px]`}>
              {paginatedConstants.length === 0 ? (
                <div className="col-span-full flex items-center justify-center h-full text-gray-400 text-sm">
                  Buraya ürün sürükleyip bırakın
                </div>
              ) : (
                paginatedConstants.map((constant) => {
                  const constantKey = `${constant.productCode}-${constant.colorCode}`;
                  const isSelected = selectedConstant === constantKey;

                  return (
                    <div
                      key={constantKey}
                      onClick={() => handleConstantClick(constantKey)}
                      className={`relative border rounded-lg p-4 bg-white shadow-sm cursor-pointer
                        transition-all duration-300 ${isSelected ? 'ring-2 ring-black' : ''}
                        ${gridStyles.containerClass} flex flex-col`}
                    >
                      <div className={`relative w-full ${gridStyles.imageClass} mb-2`}>
                        <Image
                          src={constant.imageUrl}
                          alt={constant.productCode}
                          fill
                          className={`object-cover rounded ${isSelected ? 'blur-sm' : ''}`}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-end">
                        <div className="text-sm font-medium truncate">{constant.productCode}</div>
                        <div className="text-xs text-gray-500 truncate">Renk: {constant.colorCode}</div>
                      </div>

                        {isSelected && (
                          <div 
                            className="absolute inset-0 bg-black bg-opacity-70 rounded-lg 
                              flex items-center justify-center text-white"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConstant(constant);
                              }}
                              className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                              <DeleteIcon className="w-6 h-6" />
                            </button>
                          </div>
                        )}
                    </div>
                  );
                })
              )}
            </div>

            {constants.length > ITEMS_PER_PAGE && (
              <div className="pt-4 flex justify-center gap-2 border-t">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <span className="px-3 py-1">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 flex justify-end gap-4">
        <button 
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-poppins"
          onClick={() => window.history.back()}
        >
          Vazgeç
        </button>
        <button 
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 font-poppins"
          onClick={handleSave}
        >
          Kaydet
        </button>
      </div>

      <FilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApplyFilters={handleApplyFilters}
        filters={collectionFilters}
        selectedFilters={selectedFilters}
      />
    </div>
  );
}