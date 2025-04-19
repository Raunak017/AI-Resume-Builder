export function parseMonthYearString(input: string) {
  if (typeof input !== "string") {
    throw new Error("Input must be a string.");
  }

  const regex = /^(0[1-9]|1[0-2])\s(\d{4})$/; // Matches MM YYYY format
  const match = input.trim().match(regex);

  if (!match) {
    throw new Error('Invalid format. Expected "MM YYYY", e.g., "04 2025".');
  }

  const [_, monthStr, yearStr] = match;
  const month = parseInt(monthStr, 10) - 1; // JS months are 0-based
  const year = parseInt(yearStr, 10);

  const date = new Date(year, month, 1);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date.");
  }

  return date;
}

export function formatToMonthYear(dateStr: string) {
  let date: Date;
  try {
    date = new Date(dateStr);
  } catch {
    throw new Error("Invalid date string");
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${month} ${year}`;
}
