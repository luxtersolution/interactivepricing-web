
function DateToJDN(date) {
   let year = date.getFullYear();
   let month = date.getMonth();
   let day = date.getDay();

   let a = ~~((14 - month) / 12);
   let y = year + 4800 - a;
   let m = month - 12 * a - 3;

    return day + ~~((153 * m + 2) / 5) + 365 * y + ~~(y / 4) - ~~(y / 100) + ~~(y / 400) - 32045;
}
