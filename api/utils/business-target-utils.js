const monthArray = ['april','may','june','july','august','september','october','november','december','january','february','march']

module.exports = {
    monthConversionToJson:(record)=>{
        for (let i = 1; i <= 12; i++) {
            const columnName = monthArray[i-1];
            if (record.hasOwnProperty(columnName) && record[columnName]) {
                record[columnName] = JSON.stringify(record[columnName]);
            }
        }
    }
}