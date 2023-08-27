import React, { useState } from 'react';
import MaterialTable from 'material-table';

export default function TableViewComponent(props) {

  const [columns ] = useState(props.columns);
  const [data, setData] = useState(props.data);
  return (
    <MaterialTable
      title=""
      size="small" 
      options={{
        padding: 'dense',
        pageSize: 20,
        addRowPosition: 'first'
      }}
      columns={columns}
      data={data}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve) => {
            setTimeout(() => {
              setData([...data, newData]);
              props.onAdd(newData);
              resolve();
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...data];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              setData(dataUpdate);
              props.onEdit(newData);
              resolve();
            }, 600)
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              const dataDelete = [...data];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              setData([...dataDelete]);
              props.onDelete(oldData)
              resolve();
            }, 600);
          }),
      }}
    />
  );
}