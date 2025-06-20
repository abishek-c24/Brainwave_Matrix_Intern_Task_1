const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const addBtn = document.getElementById("add");
const incomeDisplay = document.getElementById("total-income");
const expenseDisplay = document.getElementById("total-expense");
const balanceDisplay = document.getElementById("balance");
const transactionList = document.getElementById("transaction-list");
const toggleBtn = document.getElementById("toggle-mode");
const exportBtn = document.getElementById("export");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateTotals() {
  let income = 0,
    expense = 0;
  transactions.forEach((item) => {
    if (item.type === "income") income += item.amount;
    else expense += item.amount;
  });
  incomeDisplay.textContent = income;
  expenseDisplay.textContent = expense;
  balanceDisplay.textContent = income - expense;
  updateChart(income, expense);
}

function renderTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.description} - ₹${item.amount} (${item.type})
      <button onclick="deleteTransaction(${index})">❌</button>
    `;
    transactionList.appendChild(li);
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateTotals();
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  renderTransactions();
}

addBtn.addEventListener("click", () => {
  const desc = description.value.trim();
  const amt = parseFloat(amount.value);
  const ttype = type.value;

  if (!desc || isNaN(amt) || amt <= 0) return alert("Enter valid data!");

  transactions.push({ description: desc, amount: amt, type: ttype });
  description.value = "";
  amount.value = "";
  renderTransactions();
});

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

exportBtn.addEventListener("click", () => {
  let csv = "Description,Amount,Type\n";
  transactions.forEach((t) => {
    csv += `${t.description},${t.amount},${t.type}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
});

let chart;
function updateChart(income, expense) {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "Transactions",
          data: [income, expense],
          backgroundColor: ["#28a745", "#dc3545"],
        },
      ],
    },
  });
}


renderTransactions();
