import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  pageSize?: number;
  onRowClick?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  height?: number;
}

const DataTable: React.FC<DataTableProps> = ({
  rows,
  columns,
  loading = false,
  pageSize = 10,
  onRowClick,
  onEdit,
  onDelete,
  height = 400,
}) => {
  const actionColumns: GridColDef[] = onEdit || onDelete
    ? [
        {
          field: 'actions',
          headerName: 'Actions',
          width: 120,
          sortable: false,
          renderCell: (params: GridRenderCellParams) => (
            <Box>
              {onEdit && (
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(params.row); }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(params.row); }}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ),
        },
      ]
    : [];

  const allColumns = [...columns, ...actionColumns];

  return (
    <Box sx={{ width: '100%', height }}>
      <DataGrid
        rows={rows}
        columns={allColumns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { pageSize },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        onRowClick={(params) => onRowClick?.(params.row)}
        disableRowSelectionOnClick
        sx={{ backgroundColor: 'background.paper' }}
      />
    </Box>
  );
};

export default DataTable;