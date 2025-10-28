import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// /**
//  * useExportToExcel - reusable hook for exporting data to Excel
//  * @returns {function} exportToExcel - call with (data, fileName)
//  */


export function useExportExcelData() {
  const exportToExcel = (data, fileName = "data.xlsx") => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("⚠️ No data to export to Excel");
      return;
    }

    try {
      // 1️⃣ Convert JSON → worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);

      // 2️⃣ Create workbook and append sheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // 3️⃣ Generate Excel buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // 4️⃣ Create Blob and trigger download
      const blob = new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
      saveAs(blob, fileName);

      console.log(`✅ Exported ${data.length} rows to ${fileName}`);
    } catch (err) {
      console.error("❌ Error exporting to Excel:", err);
    }
  };

  return { exportToExcel };
}
