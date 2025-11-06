'use client'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export function useExportToExcel() {
  /**
   * Exports given JSON data to an Excel (.xlsx) file
   * @param {Array} data - JSON array to export
   * @param {string} fileName - Output filename (default: 'data.xlsx')
   */
  const exportToExcel = (data, fileName = 'data.xlsx') => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No data available to export.')
      return
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
      saveAs(blob, fileName)
    } catch (error) {
      console.error('Error exporting Excel file:', error)
    }
  }

  return { exportToExcel }
}
