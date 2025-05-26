export const formatDate = (date) => {
  const day = date.getDate();
  const suffix = ["th", "st", "nd", "rd"][
    day % 10 <= 3 && ![11, 12, 13].includes(day) ? day % 10 : 0
  ];
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${day}${suffix} ${month}, ${year}`;
}

export const toSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
