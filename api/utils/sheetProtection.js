function sheetProtection(worksheet) {
    worksheet.sheetProtection = {
      sheet: true,
      formatCells: false,
      formatColumns: false,
      formatRows: false,
      insertColumns: false,
      insertRows: false,
      insertHyperlinks: false,
      deleteColumns: false,
      deleteRows: false,
      selectLockedCells: true,
      sort: false,
      autoFilter: false,
      pivotTables: false,
    };
  }
  
module.exports = sheetProtection;