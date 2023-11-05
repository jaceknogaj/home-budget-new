const incomeForm = document.getElementById("incomeForm");
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const incomeList = document.getElementById("incomeList");
const totalExpenseText = document.getElementById("totalExpense");
const totalIncomeText = document.getElementById("totalIncome");
const modal = document.getElementById("modal");
const editForm = document.getElementById("editForm");
const editName = document.getElementById("editName");
const editAmount = document.getElementById("editAmount");
const editSaveBtn = document.getElementById("editSave");
const editCancelBtn = document.getElementById("editCancel");
const errorMsg = document.getElementById("errorMsg");
const balanceMsg = document.getElementById("balanceMsg");

const incomeData = [];
const expenseData = [];
let editingIndex = -1;
let editingType = "";

incomeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("incomeName").value;
  const amount = parseFloat(document.getElementById("incomeAmount").value);

  if (name && !isNaN(amount) && amount > 0) {
    incomeData.push({ name, amount: amount.toFixed(2) });
    updateBudgetList();
    document.getElementById("incomeName").value = "";
    document.getElementById("incomeAmount").value = "";
    calculateBalance();
  } else {
    errorMsg.textContent =
      "Wprowadź poprawne dane (kwota musi być większa od 0).";
  }
});

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("expenseName").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);

  if (name && !isNaN(amount) && amount > 0) {
    expenseData.push({ name, amount: amount.toFixed(2) });
    updateBudgetList();
    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";
    calculateBalance();
  } else {
    errorMsg.textContent =
      "Wprowadź poprawne dane (kwota musi być większa od 0).";
  }
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newName = editName.value;
  const newAmount = parseFloat(editAmount.value);

  if (newName && !isNaN(newAmount) && newAmount > 0) {
    if (editingType === "income") {
      incomeData[editingIndex].name = newName;
      incomeData[editingIndex].amount = newAmount.toFixed(2);
    } else if (editingType === "expense") {
      expenseData[editingIndex].name = newName;
      expenseData[editingIndex].amount = newAmount.toFixed(2);
    }

    updateBudgetList();
    calculateBalance();

    modal.style.display = "none";
    document.getElementById("editName").value = "";
    document.getElementById("editAmount").value = "";
  }
});

function updateBudgetList() {
  expenseList.innerHTML = "";
  incomeList.innerHTML = "";

  for (let i = 0; i < incomeData.length; i++) {
    const item = incomeData[i];
    const li = createListItem(item, i, "income");
    incomeList.appendChild(li);
  }

  for (let i = 0; i < expenseData.length; i++) {
    const item = expenseData[i];
    const li = createListItem(item, i, "expense");
    expenseList.appendChild(li);
  }

  calculateTotalIncome();
  calculateTotalExpense();
}

function createListItem(item, index, type) {
  const li = document.createElement("li");

  const divTextList = document.createElement("div");
  divTextList.className = "textList";

  const divTextLeft = document.createElement("div");
  divTextLeft.className = "textLeft";
  divTextLeft.textContent = item.name + ":";

  const divTextRight = document.createElement("div");
  divTextRight.className = "textRight";
  divTextRight.textContent = item.amount + " PLN";

  divTextList.appendChild(divTextLeft);
  divTextList.appendChild(divTextRight);
  li.appendChild(divTextList);

  const editBtn = document.createElement("button");
  editBtn.className = "btn editBtn";
  editBtn.textContent = "Edytuj";
  editBtn.addEventListener("click", () => {
    openEditModal(index, type);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn deleteBtn";
  deleteBtn.textContent = "Usuń";
  deleteBtn.addEventListener("click", () => {
    deleteBudgetItem(index, type);
  });

  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  return li;
}

function openEditModal(index, type) {
  const item = type === "expense" ? expenseData[index] : incomeData[index];
  editName.value = item.name;
  editAmount.value = parseFloat(item.amount);
  editingIndex = index;
  editingType = type;
  modal.style.display = "block";
}

function handleEditCancel() {
  modal.style.display = "none";
  document.getElementById("editName").value = "";
  document.getElementById("editAmount").value = "";
}

editSaveBtn.addEventListener("click", () => {
  const newName = editName.value;
  const newAmount = parseFloat(editAmount.value);

  if (newName && !isNaN(newAmount) && newAmount > 0) {
    if (editingType === "income") {
      incomeData[editingIndex].name = newName;
      incomeData[editingIndex].amount = newAmount.toFixed(2);
    } else if (editingType === "expense") {
      expenseData[editingIndex].name = newName;
      expenseData[editingIndex].amount = newAmount.toFixed(2);
    }

    updateBudgetList();
    calculateBalance();

    modal.style.display = "none";
    document.getElementById("editName").value = "";
    document.getElementById("editAmount").value = "";
  } else {
    errorMsg.textContent = "Wprowadź poprawne dane.";
  }
});

editCancelBtn.addEventListener("click", handleEditCancel);

function deleteBudgetItem(index, type) {
  if (type === "expense") {
    expenseData.splice(index, 1);
  } else {
    incomeData.splice(index, 1);
  }

  updateBudgetList();
  calculateBalance();
}

function calculateBalance() {
  const totalIncome = incomeData
    .reduce((sum, item) => sum + parseFloat(item.amount), 0)
    .toFixed(2);
  const totalExpense = expenseData
    .reduce((sum, item) => sum + parseFloat(item.amount), 0)
    .toFixed(2);
  const balance = (totalIncome - totalExpense).toFixed(2);

  if (balance > 0) {
    balanceMsg.textContent = `Możesz jeszcze wydać ${balance} złotych.`;
  } else if (balance < 0) {
    balanceMsg.textContent = `Bilans jest ujemny. Jesteś na minusie ${Math.abs(
      balance
    )} złotych.`;
  } else {
    balanceMsg.textContent = "Bilans wynosi zero.";
  }
}

function calculateTotalExpense() {
  const totalExpense = expenseData
    .reduce((sum, item) => sum + parseFloat(item.amount), 0)
    .toFixed(2);
  totalExpenseText.textContent = `${totalExpense} PLN`;
}

function calculateTotalIncome() {
  const totalIncome = incomeData
    .reduce((sum, item) => sum + parseFloat(item.amount), 0)
    .toFixed(2);
  totalIncomeText.textContent = `${totalIncome} PLN`;
}

calculateBalance();
