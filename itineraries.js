// Dummy data
const visitedDestinations = ["Delhi", "Agra", "Jaipur"];
const currentDestination = "Udaipur";
const currentDay = 4;
const todayPlan = [
  "Check-in at hotel",
  "Visit City Palace",
  "Boat ride on Lake Pichola",
  "Dinner at Ambrai Restaurant"
];

// Inject data into HTML
document.getElementById("visited").innerText = visitedDestinations.join(", ");
document.getElementById("current").innerText = currentDestination;
document.getElementById("day").innerText = `Day ${currentDay}`;

const planList = document.getElementById("plan-list");
todayPlan.forEach(item => {
  const li = document.createElement("li");
  li.innerText = item;
  planList.appendChild(li);
});
