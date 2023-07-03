function getCurrentFY() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (currentMonth >= 4) {
        financialYear = currentYear + 1;
    }

    return financialYear;

}

module.exports = getCurrentFY