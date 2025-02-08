import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collectionsService } from '@/lib/services/api';
import type { Collection, GetProductsRequest, ProductData, GetAllCollectionsResponse } from '@/lib/types/api';

interface CollectionsState {
  collections: Collection[];
  currentProducts: ProductData[];
  loading: boolean;
  error: string | null;
  meta: {
    page: number;
    pageSize: number;
    totalProduct: number;
  } | null;
}

const initialState: CollectionsState = {
  collections: [],
  currentProducts: [],
  loading: false,
  error: null,
  meta: null,
};

export const fetchCollections = createAsyncThunk<GetAllCollectionsResponse>(
  'collections/fetchAll',
  async () => {
    const response = await collectionsService.getAll();
    return response;
  }
);

export const fetchProducts = createAsyncThunk(
  'collections/fetchProducts',
  async ({ collectionId, request }: { collectionId: number; request: GetProductsRequest }) => {
    const response = await collectionsService.getProducts(collectionId, request);
    return response.data;
  }
);

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload.data;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Bir hata oluştu';
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProducts = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export default collectionsSlice.reducer;