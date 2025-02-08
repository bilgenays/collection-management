'use client';

import { useState, useEffect } from 'react';
import { 
  Drawer, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
  OutlinedInput
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface SimpleFilter {
  value: string;
  valueName: string;
}

export interface FilterValues {
  stockStatus?: string;
  year?: string;
  productCode?: string;
  minStock?: string;
  maxStock?: string;
  allSizesInStock?: boolean;
}

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterValues) => void;
  filters: SimpleFilter[];
  selectedFilters?: SimpleFilter[];
}

export default function FilterDrawer({ 
  open, 
  onClose, 
  onApplyFilters, 
  filters = [],
  selectedFilters = [] 
}: FilterDrawerProps) {
  const [selectedStockStatus, setSelectedStockStatus] = useState(() => {
    return selectedFilters.find(f => f.value)?.value || '';
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    return selectedFilters.find(f => f.value)?.value || '';
  });

  const [minStock, setMinStock] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [productCode, setProductCode] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [allSizesInStock, setAllSizesInStock] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<string[]>(['Yıl: 2024']);

  useEffect(() => {
    if (selectedFilters.length > 0) {
      selectedFilters.forEach(filter => {
        if (filter.value) {
          setSelectedStockStatus(filter.value);
          setSelectedYear(filter.value);
        }
      });

      const appliedFilterTexts = selectedFilters.map(filter => 
        `${filter.valueName || filter.value}`
      );
      setAppliedFilters(appliedFilterTexts);
    }
  }, [selectedFilters]);

  const handleApplyFilters = () => {
    const filterData = {
      stockStatus: selectedStockStatus || undefined,
      year: selectedYear || undefined,
      productCode: productCode || undefined,
      minStock: minStock || undefined,
      maxStock: maxStock || undefined,
      allSizesInStock: allSizesInStock || undefined,
    };

    const cleanedFilters = Object.fromEntries(
      Object.entries(filterData).filter(([_, value]) => value !== undefined)
    );

    onApplyFilters(cleanedFilters);
    
    const newAppliedFilters = Object.entries(cleanedFilters)
      .map(([key, value]) => {
        switch(key) {
          case 'stockStatus':
            return `Stok: ${value === 'inStock' ? 'Stokta' : 'Stokta Değil'}`;
          case 'year':
            return `Yıl: ${value}`;
          case 'productCode':
            return `Ürün Kodu: ${value}`;
          case 'minStock':
            return `Min Stok: ${value}`;
          case 'maxStock':
            return `Max Stok: ${value}`;
          case 'allSizesInStock':
            return 'Tüm Bedenlerde Stok Var';
          default:
            return null;
        }
      })
      .filter(Boolean);

    setAppliedFilters(newAppliedFilters);
  };

  const handleClearFilters = () => {
    setSelectedYear('');
    setSelectedStockStatus('');
    setMinStock('');
    setMaxStock('');
    setProductCode('');
    setSortOrder('');
    setAllSizesInStock(false);
    setAppliedFilters([]);
  };

  const removeFilter = (filter: string) => {
    setAppliedFilters(prev => prev.filter(f => f !== filter));
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { 
          width: '100%',
          height: 'auto',
          maxHeight: '90vh',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '24px'
        }
      }}
    >
      <div className="flex justify-end mb-6">
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className="text-sm font-medium">Filtreler</div>
          <div className="text-sm font-medium">Stok</div>
          <div className="text-sm font-medium">Ürün Kodu</div>
          <div className="text-sm font-medium">Sıralamalar</div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <FormControl fullWidth size="small">
            <InputLabel>Stok Durumu</InputLabel>
            <Select
              value={selectedStockStatus}
              onChange={(e) => setSelectedStockStatus(e.target.value)}
              label="Stok Durumu"
            >
              {filters.map(filter => (
                <MenuItem key={filter.value} value={filter.value}>
                  {filter.valueName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Yıl</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Yıl"
            >
              {filters
                .filter(f => f.value === 'year')
                .map(filter => (
                  <MenuItem key={filter.value} value={filter.value}>
                    {filter.valueName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <OutlinedInput
            fullWidth
            size="small"
            placeholder="Seçiniz"
            sx={{ 
              fontSize: '14px',
              color: '#666'
            }}
          />

          <FormControl fullWidth size="small">
            <Select
              value={sortOrder}
              displayEmpty
              renderValue={(value) => {
                if (!value) {
                  return <span style={{ color: '#666' }}>Seçiniz</span>;
                }
                return value;
              }}
              sx={{ 
                '& .MuiSelect-select': { 
                  color: '#666',
                  fontSize: '14px'
                }
              }}
            >
              <MenuItem value="" disabled>Seçiniz</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <FormControl fullWidth size="small">
          <Select
            value=""
            displayEmpty
            renderValue={(value) => {
              if (!value) {
                return <span style={{ color: '#666' }}>Lütfen filtre seçiniz</span>;
              }
              return value;
            }}
            sx={{ 
              '& .MuiSelect-select': { 
                color: '#666',
                fontSize: '14px'
              }
            }}
          >
            <MenuItem value="" disabled>Lütfen filtre seçiniz</MenuItem>
          </Select>
        </FormControl>

        <OutlinedInput
          fullWidth
          size="small"
          placeholder="Minimum Stok"
          sx={{ 
            fontSize: '14px',
            color: '#666'
          }}
        />

        <OutlinedInput
          fullWidth
          size="small"
          placeholder="Maksimum Stok"
          sx={{ 
            fontSize: '14px',
            color: '#666'
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              size="small"
              sx={{
                color: '#666',
                '&.Mui-checked': {
                  color: '#000',
                },
              }}
            />
          }
          label={
            <span style={{ fontSize: '14px', color: '#666' }}>
              Tüm Bedenlerinde Stok Olanlar
            </span>
          }
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-1 mb-2">
          <span className="text-sm">Uygulanan Kriterler</span>
          <InfoOutlinedIcon fontSize="small" sx={{ color: '#666' }} />
        </div>
        <div className="border rounded min-h-[100px] p-3">
          {appliedFilters.map((filter) => (
            <div 
              key={filter} 
              className="inline-flex items-center bg-gray-100 rounded mr-2 mb-2 px-2 py-1"
            >
              <span className="text-sm">{filter}</span>
              <IconButton 
                size="small" 
                onClick={() => removeFilter(filter)}
                sx={{ padding: '2px', marginLeft: '4px' }}
              >
                <CloseIcon sx={{ fontSize: '14px' }} />
              </IconButton>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="contained"
          onClick={handleClearFilters}
          sx={{
            backgroundColor: '#000',
            '&:hover': {
              backgroundColor: '#333',
            },
            textTransform: 'none',
            fontSize: '14px',
            width: '200px'
          }}
        >
          Seçimi Temizle
        </Button>
        <Button
          variant="outlined"
          onClick={handleApplyFilters}
          sx={{
            borderColor: '#000',
            color: '#000',
            '&:hover': {
              borderColor: '#333',
              backgroundColor: 'transparent',
            },
            textTransform: 'none',
            fontSize: '14px',
            width: '200px'
          }}
        >
          Ara
        </Button>
      </div>
    </Drawer>
  );
} 