import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css' // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css' // Optional Theme applied to the Data Grid
import { useState, useEffect, useMemo } from 'react'

export default function App() {
  const CustomButtonComponent = (props) => {
    return <button onClick={() => window.alert('clicked')}>Push Me!</button>
  }
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([])

  // Fetch data & update rowData state
  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/space-mission-data.json') // Fetch data from server
      .then((result) => result.json()) // Convert to JSON
      .then((rowData) => setRowData(rowData)) // Update state of `rowData`
  }, [])

  // Custom Cell Renderer (Display flags based on cell value)
  const CompanyLogoRenderer = (props) => {
    const value = props.data.company
    return (
      <span
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center'
        }}
      >
        {value && (
          <img
            alt={`${value} Flag`}
            src={`https://www.ag-grid.com/example-assets/space-company-logos/${value.toLowerCase()}.png`}
            style={{
              display: 'block',
              width: '25px',
              height: 'auto',
              maxHeight: '50%',
              marginRight: '12px',
              filter: 'brightness(1.1)'
            }}
          />
        )}
        <p
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}
        >
          {value}
        </p>
      </span>
    )
  }

  const SuccessfullIconRenderer = (props) => {
    console.log(props.value)
    return (
      <span width="100%" height="100%">
        {props.value ? '✅' : '❌'}
      </span>
    )
  }

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    {
      field: 'mission',
      cellRenderer: CompanyLogoRenderer,
      checkboxSelection: true
    },
    { field: 'company' },
    { field: 'location' },
    {
      field: 'date',
      valueFormatter: (params) => {
        const date = new Date(params.value)
        return date.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    },
    {
      field: 'price',
      valueFormatter: (params) => {
        return '£' + params.value.toLocaleString()
      }
    },
    { field: 'successful', cellRenderer: SuccessfullIconRenderer },
    { field: 'rocket' }
  ])

  const defaultColDef = useMemo(
    () => ({
      filter: true, // Enable filtering on all columns
      editable: true
    }),
    []
  )

  return (
    <div
      className="ag-theme-quartz" // applying the Data Grid theme
      style={{ height: 500 }} // the Data Grid will fill the size of the parent container
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        rowSelection="multiple"
        pagination={true}
        paginationPageSize={20}
        paginationPageSizeSelector={[20, 50, 100]}
        defaultColDef={defaultColDef}
        onCellValueChanged={(event) =>
          console.log(`New Cell Value: ${event.value}`)
        }
        onSelectionChanged={(event) => console.log(event)}
      />
    </div>
  )
}
