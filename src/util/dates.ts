const weekNames = {
  "1": "Mon",
  "2": "Tue",
  "3": "Wed",
  "4": "Thu",
  "5": "Fri",
  "6": "Sat",
  "7": "Sun",
};

const monthNames = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

export function getCurDate() {
  return new Date().toISOString().split("T")[0];
}

export function getCurLongDate() {
  return `${getCurDate()} ${getHourMinuteSeconds()}`;
}

export function getCurFullDate() {
  return new Date().toISOString();
}

function getHourMinuteSeconds() {
  const date = new Date();
  return `${date.getUTCHours().toString().padStart(2, "0")}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")}`;
}

function thDate(dayOfMonth: string) {
  switch (dayOfMonth) {
    case "11":
    case "12":
    case "13":
      return "th";
  }

  try {
    const lastNum = dayOfMonth.charAt(dayOfMonth.length - 1);
    switch (lastNum) {
      case "1":
        return "st";
      case "2":
        return "nd";
      case "3":
        return "rd";
      default:
        return "th";
    }
  } catch (e) {
    return "";
  }
}

export function convertDateToHuman(date: string, withYear: boolean = true) {
  const [year, month, day] = date.split("-");
  return `${monthNames[month as keyof typeof monthNames]} ${
    Number(day) + thDate(day)
  }${withYear ? `, ${year}` : ""}`;
}
