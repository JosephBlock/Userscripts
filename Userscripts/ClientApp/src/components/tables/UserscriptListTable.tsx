import { useEffect, useState } from "react";
import React from "react";
import { useTable } from "react-table";
import BTable from 'react-bootstrap/Table';

const UserscriptListTable = (props: any) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        },
        []);

    const columns: any = React.useMemo(() => [
            {
                Header: 'Script',
                accessor: 'scriptName'
            }, {
                Header: "Description",
                accessor: "description"
            }
        ],
        []);

    const tableInstance = useTable({ columns: columns, data: props.data })
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance
    return (
        <BTable {...getTableProps()} className={"striped bordered hover"}>
            <thead>
            { // Loop over the header rows
                headerGroups.map(headerGroup => (
                    // Apply the header row props
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        { // Loop over the headers in each row
                            headerGroup.headers.map(column => (
                                // Apply the header cell props
                                <th {...column.getHeaderProps()}>
                                    { // Render the header
                                        column.render('Header')}
                                </th>
                            ))}
                    </tr>
                ))}
            </thead>
            { /* Apply the table body props */
            }
            <tbody {...getTableBodyProps()}>
            { // Loop over the table rows
                rows.map(row => {
                    // Prepare the row for display
                    prepareRow(row);
                    const link = document.createElement("a");
                    var original:any = row.original;
                    link.href = "/userscript/" + original.scriptId;
                    const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
                    return (
                        // Apply the row props
                        <tr {...row.getRowProps()} onClick={() => {

                        }}>
                            { // Loop over the rows cells
                                row.cells.map(cell => {
                                    // Apply the cell props
                                    console.log(cell)
                                    return (
                                        <td {...cell.getCellProps()}>
                                            <a href={returnUrl}>{cell.value}</a>
                                        </td>
                                    )
                                })}
                        </tr>
                    )
                })}
            </tbody>
        </BTable>
    );
};

export default UserscriptListTable;