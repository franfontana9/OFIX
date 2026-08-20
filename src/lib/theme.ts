const KEY = "ofix-theme";

export function initTheme() {
  const saved = localStorage.getItem(KEY);
  const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
}

export function isDark() {
  return document.documentElement.classList.contains("dark");
}

export function toggleTheme() {
  const dark = !isDark();
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem(KEY, dark ? "dark" : "light");
  return dark;
}
