async function test() {
  const res = await fetch("http://localhost:5000/api/analyze/guest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: "My boss is an absolute idiot and I hate working at this stupid company.",
      platform: "LinkedIn",
    }),
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test().catch(console.error);
