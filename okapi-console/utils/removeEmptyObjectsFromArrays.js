export const removeEmpty = (data) => {
  for (var entry in data) {
    if (Object.prototype.toString.call(data[entry]) === '[object Array]') {
      if (data[entry].length) {
        var i = data[entry].length;
        while (i--) {
          if (Object.prototype.toString.call(data[entry][i]) === '[object Null]') {
            data[entry].splice(i,1);
          } else if (isEmptyObject(data[entry][i])) {
            data[entry].splice(i,1);
          } else if (Object.prototype.toString.call(data[entry][i]) === '[object Object]') {
             removeEmpty(data[entry][i]);
          }
        }
      }
    } else if (Object.prototype.toString.call(data[entry]) === '[object Object]') {
      removeEmpty(data[entry]);
    }
  }
}

const isEmptyObject = (obj) => {
  for (var prop in obj)
    if (Object.prototype.toString.call(obj[prop]) !== '[object Undefined]')
      if (obj[prop] && obj[prop].length > 0) return false;
  return true;
}
