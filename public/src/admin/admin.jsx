import React from "react";
import DataTable, { createTheme } from 'react-data-table-component';

const Approve = () => (
    <button className="btn btn-success p-1 m-1" width="50" type="button">Approve</button>
  );
const Reject = () => (
    <button className="btn btn-danger p-1 m-1" width="50" type="button">Reject</button>
  );
const Upload = () => (
    <input type="file" id="myfile" name="myfile"/>
  );

const data = [
  {
    id: 1,
    roll:108118023,
    CType: 'Bonafide',
    status: 'Pending',
  },
  {
    id: 2,
    roll:108118025,
    CType: 'Bonafide',
    status: 'Pending',
  },
  {
    id: 3,
    roll:108118017,
    CType: 'Bonafide',
    status: 'Pending',
  },
  {
    id: 4,
    roll:108118101,
    CType: 'Transcript',
    status: 'Pending',
  },
];

const customStyles = {
  headRow: {
    style: {
      border: 'none',
    },
  },
  headCells: {
    style: {
      color: '#202124',
      fontSize: '14px',
    },
  },
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: 'rgb(230, 244, 244)',
      borderBottomColor: '#FFFFFF',
      borderRadius: '25px',
      outline: '1px solid #FFFFFF',
    },
  },
  pagination: {
    style: {
      border: 'none',
    },
  },
};

const columns = [
    {
        name: 'S.No',
        selector: 'id',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
    },
    {
        name: 'Roll No.',
        selector: 'roll',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
    },
    {
    name: 'Certificate Type',
    selector: 'CType',
    sortable: true,
    style: {
      color: '#202124',
      fontSize: '14px',
      fontWeight: 500,
    },
    },
  {
    name: 'Status',
    selector: 'status',
    sortable: true,
    style: {
      color: 'rgba(0,0,0,.54)',
    },
  },
  { 
    name: 'Upload Certificate',
    button: false,
    cell: () => <Upload>Certificate Upload</Upload>,
    style: {
      color: 'rgba(0,0,0,.54)',
    },
  },
  {
    button: true,
    cell: () => <Approve>Approve</Approve>,
 
    style: {
      color: 'rgba(0,0,0,.54)',
    }
  },
  {
    button: true,
    cell: () => <Reject>Reject</Reject>,
    style: {
      color: 'rgba(0,0,0,.54)',
    },
  },
  
  
];

const CustomStylesGSheets = () => (
  <DataTable
    title="Certificate Requests"
    columns={columns}
    data={data}
    customStyles={customStyles}
    highlightOnHover
    pointerOnHover
  />
);


export default CustomStylesGSheets;