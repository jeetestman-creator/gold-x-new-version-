async function check() {
  const res = await fetch("/api/health");
  const data = await res.json();

  document.getElementById("result").innerText = data.status;
}
