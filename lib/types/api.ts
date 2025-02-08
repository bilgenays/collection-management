  interface LoginRequest {  
    username: string;
    password: string;
  }
  
  interface RefreshTokenRequest {
    refreshToken: string;
  }
  
  interface AuthResponse {
    status: number;
    message: string;
    data: {
      id: string;
      accessToken: string;
      expiresIn: number;
      refreshExpiresIn: number;
      refreshToken: string;
      tokenType: string;
    };
  }
  
  interface Collection {
    id: number;
    name: string;
    products: Product[];
    constants: Constant[];
    filters: {
      filters: Filter[];
    };
    salesChannelId: number;
  }
  

  interface GetProductsRequest {
    additionalFilters: {
      id: string;
      value: string;
      comparisonType: number;
    }[];
    page: number;
    pageSize: number;
  }
  
  interface ProductData {
    productCode: string;
    colorCode: string;
    name: string | null;
    outOfStock: boolean;
    isSaleB2B: boolean;
    imageUrl: string;
  }
  
  interface Filter {
    id: string;
    title: string;
    value: string;
    valueName: string;
    currency: string | null;
    comparisonType: number;
  }
  
  interface GetProductsResponse {
    status: number;
    message: string;
    data: {
      meta: {
        page: number;
        pageSize: number;
        totalProduct: number;
      };
      data: ProductData[];
      filters: {
        filters: Filter[];
      };
    };
  }
  
  interface ApiError {
    status: number;
    message: string | null;
    data?: unknown;
  }
  
  export interface Product {
    id: number;
    name: string;
    sku: string;
    imageUrl: string;
  }
  
  export interface Constant {
    id: number;
    name: string;
    sku: string;
    imageUrl: string;
  }
  
  interface GetAllCollectionsResponse {
    status: number;
    message: string;
    data: Collection[];
  }
  
  interface CollectionResponse {
    data: Collection[];
    meta: {
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  }
  
  export type {
    LoginRequest,
    RefreshTokenRequest,
    AuthResponse,
    Collection,
    GetProductsRequest,
    GetProductsResponse,
    ProductData,
    ApiError,
    GetAllCollectionsResponse,
    CollectionResponse,
    Filter
  };