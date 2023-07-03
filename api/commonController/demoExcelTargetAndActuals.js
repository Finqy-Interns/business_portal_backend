const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const fetchData = require('../utils/fetchData'); // Path to the file containing the fetchData function
const sheetProtection = require('../utils/sheetProtection');
const authenticatedPolicy = require('../middlewares/Authentication')

function setBold(row) {
  row.eachCell(cell => {
    cell.font = { bold: true }
  })
}


//Function for setting Role
function setFrozenRowsAndAddHeaders(sheet, rows) {
  // Set the fixed rows
  sheet.views = [
    {
      state: 'frozen',
      ySplit: 1 // Number of rows to freeze
    }
  ];

  // Add the row headers
  rows.forEach(row => {
    const singleRow = sheet.addRow([row]);
    singleRow.eachCell(cell => {
      cell.font = { bold: true };
    });
  });
}

//Function for Generate Formula
function generateSumFormula(sheetName, startCell, rowCount, startRow) {
  const cellAddresses = [];
  for (let i = startRow; i < rowCount; i++) {
    const rowOffset = i * 8;
    const cellAddress = `${startCell.column}${startCell.row + rowOffset}`;
    cellAddresses.push(`${sheetName}!${cellAddress}`);
  }
  //formula
  const formula = `SUM(${cellAddresses.join(',')})`;
  return { formula, date1904: false };
}


//Function for AutoFit
function autoFitSheet(sheet) {
  sheet.eachRow((row) => {
    row.height = 14; // Autofit row height
  });

  sheet.columns.forEach((column) => {
    column.width = 14; // Autofit column width
  });
}

//Function for DataValidation
function applyDataValidation(worksheet) {
  // Set the range from column B to M (2nd to 13th column)
  const startColumn = 'B';
  const endColumn = 'M';

  // Set the range of cells where you want to enforce numeric input
  const startRow = 2; // Starting row (e.g., 2 for row 2)
  const endRow = 100; // Ending row (e.g., 10 for row 10)

  for (let row = startRow; row <= endRow; row++) {
    for (let colCode = startColumn.charCodeAt(0); colCode <= endColumn.charCodeAt(0); colCode++) {
      const column = String.fromCharCode(colCode);
      const cell = worksheet.getCell(`${column}${row}`);

      cell.dataValidation = {
        type: 'whole',
        operator: 'between',
        formula1: 0,
        formula2: 999999999,
        showErrorMessage: true,
        errorTitle: 'Invalid Input',
        error: 'Please enter only numeric value.',
      };
    }
  }
}

// API For Download Demo File based on Product Id and Role 
/*
Input - ProductId Role(JWt Token)
Output - Demo Excel File based on The product Id we call function fetch data and this wil check if product contain subproduct,channel and then we can have product sheet,subproduct sheet, channel sheet based on conditions.
there will be 4 scenario
1.Only Product exist.
2.Product and Subproduct.
3.Product then inside it Subproduct and inside subproduct Channel will have.
4.Product can have Channel directly no subproduct in middle.

So we are checking this cases and based on this cases we are deciding which sheet to be protected.


*/

router.get('/:product_id/:status', authenticatedPolicy(), (req, res) => {
  const {product_id:productId, status} = req.params;
  const { username, role } = req.user;

  // Calling the Function FetchData which fetch product,subproduct,channels based on product Id
  fetchData(productId, (error, data) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server errors' });
    }

    // Assuming you have retrieved the data for product, subproduct, and channel

    const productExists = data.product.length > 0;
    const subproductExists = data.subproducts.length > 0;
    const channelExists = data.channels.length > 0;

    //Defining variable
    let isProductEditable = false;
    let isSubproductEditable = false;
    let isChannelEditable = false;

    // 4 cases - setting variable based on which it will decide to make sheet editable or non-editable 
    if (productExists && subproductExists && channelExists) {
      isChannelEditable = true;
    } else if (productExists && subproductExists) {
      isSubproductEditable = true;
    } else if (productExists && channelExists) {

      isChannelEditable = true;

    }
    else if (productExists) {
      isProductEditable = true;
    }


    //Created Workbook using ExcelJs
    const workbook = new ExcelJS.Workbook();


    var headers;
    var startColumn;
    var endColumn;

    //If user is Business
    if (status == 'actual') {

      // Get the current date
      const currentDate = new Date();

      // Get the current month and year
      const currentMonth = currentDate.getMonth();

      // Calculate the previous month
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

      // Get the name of the previous month
      const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      const previousMonthName = months[previousMonth];

      // Use the previousMonthName in your code to set the headers dynamically
      headers = [previousMonthName];

      //Defining column for iterating
      startColumn = 'B';
      endColumn = 'B';
    }

    //If User is Finance
    if (status == 'target') {
      headers = ['april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december','january', 'february', 'march'];
      startColumn = 'B';
      endColumn = 'M';
    }
    // Function to add data validation rule to each cell in a worksheet

    // Case 1: Product, Subproduct, and Channel
    if (data.subproducts.length > 0) {

      const channelCount = data.subproducts.map(sp => {
        return sp.channels.length > 0
      })

      const subProductChannels = {}
      const subProductList = []
      const subProductChannelList = []
      const subProductChannelsArray = []

      for (var i = 0; i < data.subproducts.length; i++) {
        const id = data.subproducts[i].sp_id;
        const name = data.subproducts[i].sp_name;
        subProductChannelList.push(data.subproducts[i].channels)
        subProductChannels[id] = data.subproducts[i].channels;
        data.subproducts[i].channels.map(c => {
          subProductList.push(name)
          subProductChannelsArray.push(c.c_name)
        })
      }

      if (channelCount.includes(true)) {

        const productSheet = workbook.addWorksheet('Product');
        const subproductSheet = workbook.addWorksheet('Subproducts');

        // Populate the product sheet

        const product = data.product.name;

        // productSheet.addRow([product]);
        productHeaders = [product, ...headers];
        const rowHeader = productSheet.addRow(productHeaders);
        setBold(rowHeader)

        const rows = ['Count (Nos.)', 'Volume(₹)', 'Payin(₹)', 'Payout(₹)', 'Retention(₹)'];
        setFrozenRowsAndAddHeaders(productSheet, rows);

        // Set the sheet as non-editable if isProductEditable is false
        if (!isProductEditable) {
          sheetProtection(productSheet);
        }

        autoFitSheet(productSheet)

        applyDataValidation(productSheet);

        const subproductSheetName = 'Subproducts';

        if (!isSubproductEditable) {
          sheetProtection(subproductSheet);
        }

        for (i = 0; i < data.subproducts.length; i++) {
          const subproduct = data.subproducts[i].sp_name;
          subproductSheet.addRow([data.product.name]);
          var subProductHeaders = [subproduct, ...headers]
          const rowHeader = subproductSheet.addRow(subProductHeaders);
          setBold(rowHeader)
          setFrozenRowsAndAddHeaders(subproductSheet, rows);
          subproductSheet.addRow([]);
          autoFitSheet(subproductSheet)
        }

        // const startColumn = 'B';
        // const endColumn = 'M';

        for (let i = startColumn.charCodeAt(0); i <= endColumn.charCodeAt(0); i++) {
          const currentColumn = String.fromCharCode(i);

          //Calculate and set the sum formula for B3 to B6
          for (let k = 0; k < 5; k++) {
            const startCell = { column: currentColumn, row: 3 + k };
            const productStartCell = { column: currentColumn, row: 2 + k };
            const rowCount = data.subproducts.length;
            const sumFormula = generateSumFormula(subproductSheetName, startCell, rowCount, 0);
            const cell = productSheet.getCell(`${currentColumn}${productStartCell.row}`);
            cell.value = sumFormula;
          }
        }

        applyDataValidation(subproductSheet);

        const channelSheet = workbook.addWorksheet('Channels');

        for (j = 0; j < subProductChannelsArray.length; j++) {

          const channel = subProductChannelsArray[j];

          channelSheet.addRow([subProductList[j]]);
          channelHeaders = [channel, ...headers]
          const rowHeader = channelSheet.addRow(channelHeaders)
          setBold(rowHeader)
          setFrozenRowsAndAddHeaders(channelSheet, rows);

          channelSheet.addRow([]);

          autoFitSheet(channelSheet)

        }

        const channelSheetName = 'Channels';
        const startColumnc = 'B';
        const endColumnc = 'M';

        // for Every subproduct
        var number = 0
        var channelcccount = 0
        // Start row for displaying the formulas
        var startRow = 3;
        for (var k = 0; k < data.subproducts.length; k++) {
          const id = data.subproducts[k].sp_id;
          var channelList = subProductChannels[id.toString()]
          channelcccount = channelcccount + channelList.length;
          for (let i = startColumnc.charCodeAt(0); i <= endColumnc.charCodeAt(0); i++) {
            const currentColumn = String.fromCharCode(i);
            //for Rows Count, Volume, Pay in, Pay out, retention
            for (let k = 0; k < 5; k++) {
              const startCell = { column: currentColumn, row: 3 + k };
              const sheetStartCell = { column: currentColumn, row: startRow + k };
              const sumFormula = generateSumFormula(channelSheetName, startCell, channelcccount, number);
              const cell = subproductSheet.getCell(`${currentColumn}${sheetStartCell.row}`);
              cell.value = sumFormula;
            }
          }
          startRow += 8;
          number += channelList.length
        }
        applyDataValidation(channelSheet);
      }

    }

    // Case 2: Product and Channel
    if (data.channels.length > 0) {



      const productSheet = workbook.addWorksheet('Product');
      const channelSheet = workbook.addWorksheet('Channels');

      // Populate the product sheet
      const product = data.product.name;

      productHeaders = [product, ...headers];
      const rowHeader = productSheet.addRow(productHeaders);
      setBold(rowHeader)


      const rows = ['Count (Nos.)', 'Volume(₹)', 'Payin(₹)', 'Payout(₹)', 'Retention(₹)'];
      setFrozenRowsAndAddHeaders(productSheet, rows);

      if (!isProductEditable) {
        sheetProtection(productSheet);
      }

      autoFitSheet(productSheet);
      applyDataValidation(productSheet)



      const channelSheetName = 'Channels';
      // const startColumn = 'B';
      // const endColumn = 'M';

      for (let i = startColumn.charCodeAt(0); i <= endColumn.charCodeAt(0); i++) {
        const currentColumn = String.fromCharCode(i);

        //Calculate and set the sum formula for B3 to B6
        for (let k = 0; k < 5; k++) {
          const startCell = { column: currentColumn, row: 3 + k };
          const productStartCell = { column: currentColumn, row: 2 + k };
          const rowCount = data.channels.length;
          const sumFormula = generateSumFormula(channelSheetName, startCell, rowCount, 0);
          const cell = productSheet.getCell(`${currentColumn}${productStartCell.row}`);
          cell.value = sumFormula;
        }
      }


      for (i = 0; i < data.channels.length; i++) {
        const channel = data.channels[i].c_name;

        // channelSheet.addRow([channel]);
        // channelSheet.addRow(headers);

        channelSheet.addRow([data.product.name]);
        var channelsheetHeaders = [channel, ...headers]
        const rowHeader = channelSheet.addRow(channelsheetHeaders);
        setBold(rowHeader)

        setFrozenRowsAndAddHeaders(channelSheet, rows);

        channelSheet.addRow([]);

        autoFitSheet(channelSheet);

      }
      applyDataValidation(channelSheet);

    }

    // Case 3: Product and Subproduct
    if (data.subproducts.length > 0) {

      const channelCount = data.subproducts.map(sp => {
        return sp.channels.length > 0
      })

      if (!channelCount.includes(true)) {
        const productSheet = workbook.addWorksheet('Product');
        const subproductSheet = workbook.addWorksheet('Subproducts');

        // Populate the product sheet

        const product = data.product.name;
        var productHeaders = [product, ...headers];
        const headerRow = productSheet.addRow(productHeaders);
        setBold(headerRow)

        const rows = ['Count (Nos.)', 'Volume(₹)', 'Payin(₹)', 'Payout(₹)', 'Retention(₹)'];
        setFrozenRowsAndAddHeaders(productSheet, rows);

        // Set the sheet as non-editable if isProductEditable is false
        if (!isProductEditable) {
          sheetProtection(productSheet);
        }

        autoFitSheet(productSheet)
        applyDataValidation(productSheet);


        const subproductSheetName = 'Subproducts';

        for (i = 0; i < data.subproducts.length; i++) {
          const subproduct = data.subproducts[i].sp_name;
          const nameRow = subproductSheet.addRow([data.product.name]);
          setBold(nameRow)
          var subProductHeaders = [subproduct, ...headers]
          const headerRow = subproductSheet.addRow(subProductHeaders);
          setBold(headerRow)
          setFrozenRowsAndAddHeaders(subproductSheet, rows);
          subproductSheet.addRow([]);
          autoFitSheet(subproductSheet)
        }

        // const startColumn = 'B';
        // const endColumn = 'M';

        for (let i = startColumn.charCodeAt(0); i <= endColumn.charCodeAt(0); i++) {
          const currentColumn = String.fromCharCode(i);

          //Calculate and set the sum formula for B3 to B6
          for (let k = 0; k < 5; k++) {
            const startCell = { column: currentColumn, row: 3 + k };
            const sheetStartCell = { column: currentColumn, row: 2 + k };
            const rowCount = data.subproducts.length;
            const sumFormula = generateSumFormula(subproductSheetName, startCell, rowCount, 0);
            const cell = productSheet.getCell(`${currentColumn}${sheetStartCell.row}`);
            cell.value = sumFormula;
          }
        }
        applyDataValidation(subproductSheet);

      }

    }

    // Case 4: Product only
    if (data.channels.length == 0 && data.subproducts.length == 0) {

      const productSheet = workbook.addWorksheet('Product');

      const product = data.product.name;

      // productSheet.addRow([product]);

      productHeaders = [product, ...headers];
      const rowHeader = productSheet.addRow(productHeaders);
      setBold(rowHeader)

      const rows = ['Count (Nos.)', 'Volume(₹)', 'Payin(₹)', 'Payout(₹)', 'Retention(₹)'];
      setFrozenRowsAndAddHeaders(productSheet, rows);
      autoFitSheet(productSheet)
      applyDataValidation(productSheet);

    }


    // Set up data validation for numeric input for the entire workbook
    //applyNumericInputValidation(workbook);


    // Saving excel in local folder
    // const filePath = './api/commonController/hierarchy.xlsx';
    // workbook.xlsx.writeFile(filePath)
    //   .then(() => {
    //     console.log(`Demo Excel file saved at: ${filePath}`);
    //     res.json({ success: true });
    //   })
    //   .catch((error) => {
    //     console.error('Error generating the demo Excel file:', error);
    //     res.status(500).json({ error: 'Internal server error' });
    //   });


    // Set the appropriate headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="hierarchy.xlsx"');

    // Write the workbook to response stream
    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      })
      .catch((error) => {
        console.error('Error generating the Excel file:', error);
        res.status(500).json({ error: 'Internal server error' });
      });


  });
});

module.exports = router;


