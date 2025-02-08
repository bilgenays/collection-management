'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collectionsService } from '@/lib/services/api';
import { Collection } from '@/lib/types/api';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '@/lib/hooks/useSession';
import { Tooltip } from '@mui/material';

export default function CollectionsPage() {
  const session = useAuth();
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false
  });

  const fetchCollections = async () => {
    try {
      const response = await collectionsService.getAll();
      setCollections(response.data);
      setPagination({
        page: 1,
        pageSize: response.data.length,
        totalCount: response.data.length,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false
      });
    } catch (error) {
      console.error('Koleksiyonlar yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchCollections();
    }
  }, [session]);

  const handleEditConstants = (collectionId: number) => {
    router.push(`/collections/${collectionId}/edit`);
  };

  const formatProductConditions = (collection: Collection) => {
    return (
      <div className="flex flex-wrap gap-2">
        {collection.filters.filters.map((filter, index) => (
          <div key={`${filter.value}-${index}`} className="bg-gray-100 px-2 py-1 rounded-md">
            {filter.valueName || filter.value}
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="p-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-500">Yükleniyor...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün Koşulları
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satış Kanalı
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {collections.map((collection) => (
                <tr key={collection.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Koleksiyon - {collection.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatProductConditions(collection)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Satış Kanalı - {collection.salesChannelId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Tooltip title="Sabitleri Düzenle">
                      <button
                        onClick={() => handleEditConstants(collection.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <EditIcon className="w-4 h-4 mr-2" />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
