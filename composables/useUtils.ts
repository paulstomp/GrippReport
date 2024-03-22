// Query

export async function query(query: string) {
  const { data } = await useAsyncData(
      query, // use query as key
      () => $fetch('/api/mysql/query', {
          headers: useRequestHeaders(['cookie']),
          method: 'POST',
          body: JSON.stringify({ query: query })
      }));
  return data.value;
}

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

export function getDateSeries(date: Date, weeks: number) {
  let dateIndex = new Date(date);
  var result: Date[] = [];
  dateIndex.setDate(dateIndex.getDate() - (dateIndex.getDay() + 7) % 7); // Previous Monday

  for(let i = 0; i < weeks * 7; i++) {
    dateIndex.setDate(dateIndex.getDate() + 1);
    if(dateIndex.getDay() >= 1 && dateIndex.getDay() <= 5) { // Only working days
      result.push(new Date(dateIndex));
    }
  }
  return result;
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

export function prettyfyNumber(value: number) {
  return (!value || value == 0 ) ? '-' : Math.round(value * 10) / 10;
}

export function prettyfy(value: any, maxLength?: number) {

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

export function bg(date: Date) {
  const week = getWeek(date);
  return {
    "bg-amber-200": isToday(date),
    "bg-indigo-50": isEven(week) && !isToday(date),
    "bg-indigo-100": isOdd(week) && !isToday(date),
    "text-center": true,
    "p-0": true
  }
}
