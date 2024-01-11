// General functions

export function getDateStr(date: Date) {
  return date.toISOString().split('T')[0];
}

export function substring(str: string, start: number, end: number) {
  if (str) {
    return str.substring(start, end);
  }
  return '';
}

export function getWeek(date: Date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000)
    + onejan.getDay() + 1) / 7);
}

export function isToday(date: Date) {
  const today = new Date();
  return date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear();
}

export function isOdd(number: number) {
  return !(number % 2 == 0);
}

export function isEven(number: number) {
  return number % 2 == 0;
}

export function compareString(a: string, b: string) {
  return (a > b) ? 1 : 0;
}

export function prettyfy(value: any, maxLength: number) {

  if (!value) {
      return '-';
  }

  if (typeof value == "string") {
      const regExDate = /^\d{4}-\d{2}-\d{2}$/;
      if (value.slice(0, 10).match(regExDate)) {
          return value.slice(0, 10);
      }

      if (value.includes(':')) {
          return value;
      }

      const number = parseFloat(value);
      if (!isNaN(number)) {
          return number;
      }

      if (maxLength) {
          return value.slice(0, maxLength);
      }
  }

  return value;
}