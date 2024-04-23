
const storedExpenses = sessionStorage.getItem('expenses');

// Initialize an array to store expenses
let expenses = [];

// Check if there are stored expenses in session storage
if (storedExpenses) {
    // Parse the stored JSON string into an array
    expenses = JSON.parse(storedExpenses);
}


if (sessionStorage.getItem('isLoggedIn') === 'false') {
    window.location.href = 'AccessDenied.html';
}
function showConfirmationMessage(message) {
  console.log('asd');
  const confirmationMessage = document.getElementById('confirmationMessage');
  confirmationMessage.textContent = message;
  confirmationMessage.style.display = 'block';
  
  // Hide the message after a certain duration (e.g., 3 seconds)
  setTimeout(() => {
      confirmationMessage.style.display = 'none';
  }, 3000); // 3000 milliseconds = 3 seconds
}

function searchExpenseTitle() {
    // Get the search input value
    var searchInput = document.getElementById("searchInput").value.toLowerCase();
    var searchCategory = document.getElementById("categorySearch").value.toLowerCase();

    // Filter expenses based on the search input

    var filteredExpenses = expenses.filter(function (expense) {
        return expense.title.toLowerCase().includes(searchInput) && expense.category.toLowerCase().includes(searchCategory);
    });

    // Display filtered expenses
    const expenseListTable = document.getElementById('expenseList');
    expenseListTable.innerHTML = ''; // Clear previous data

    filteredExpenses.forEach(expense => {
        const row = expenseListTable.insertRow();
        row.innerHTML = `
            <td>${expense.title}</td>
            <td style="text-align:left">${expense.category}</td>
            <td>${expense.amount}</td>
            <td>${expense.date}</td>
            <td>${expense.note}</td>
            <td><button style="background-color:#4CAF50"><i class="material-icons" >edit</i></button></td>
            <td><button style="background-color:#e90505"><i class="material-icons" >delete</i></button></td>
        `;
    });
    generateExpenseChart(filteredExpenses);
    groupByMonthExpense(filteredExpenses);
}

// Function to display expenses in the table
function displayExpenses() {

    const expenseListTable = document.getElementById('expenseList');
    expenseListTable.innerHTML = ''; // Clear previous data

    expenses.forEach(expense => {
        const row = expenseListTable.insertRow();
        row.innerHTML = `
            <td>${expense.title}</td>
            <td>${expense.category}</td>
            <td>${expense.amount}</td>
            <td>${expense.date}</td>
            <td>${expense.note}</td>
            <td><button style="background-color:#4CAF50"><i class="material-icons" >edit</i></button></td>
            <td><button style="background-color:#e90505"><i class="material-icons" >delete</i></button></td>
            
        `;
    });
}

var modal = document.getElementById("expenseModal");
var addExpenseBtn = document.getElementById("addExpenseBtn");

var span = document.getElementsByClassName("close")[0];
addExpenseBtn.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function addExpense() {
    var title_val = document.getElementById("title").value;
    var category_val = document.getElementById("category").value;
    var amount_val = document.getElementById("amount").value;
    var date_val = document.getElementById("date").value;
    var note_val = document.getElementById("note").value;

    if (!category_val || isNaN(parseFloat(amount_val)) || !date_val) {
      alert("Please fill in all required fields and ensure that the amount is a valid number."); // Display a warning message
      return;
  }
    // Generate a unique ID for the expense
    const id = expenses.length + 1;

    // Create a new expense object
    const newExpense = { id, title: title_val, category: category_val, amount: amount_val, date: date_val, note: note_val };

    // Add the new expense to the expenses array
    expenses.push(newExpense);

    // Save the updated expenses array to sessionStorage
    sessionStorage.setItem('expenses', JSON.stringify(expenses));
    console.log('sdasd');
   alert('Expense added successfully!');
    // displayExpenses();
    // modal.style.display = "none";
    

}
let expenseChart=null;

function generateExpenseChart(exp) {
    if(expenseChart){
      expenseChart.destroy();
    }
    const expenseByCategory = {};
    exp.forEach(expense => {
      if (!expenseByCategory[expense.category]) {
        expenseByCategory[expense.category] = 0;
      }
      expenseByCategory[expense.category] += parseInt(expense.amount);
    });

    // Prepare data for the chart
    const labels = Object.keys(expenseByCategory);
    const data = Object.values(expenseByCategory);

    // Create the chart
    const ctx = document.getElementById('expenseChart').getContext('2d');
    expenseChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Expense by Category',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

}
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("expenseTable");
  switching = true;
  dir = "asc";
  while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
          shouldSwitch = false;
          x = rows[i].getElementsByTagName("td")[n];
          y = rows[i + 1].getElementsByTagName("td")[n];
          if (dir == "asc") {
              if (n === 3) { // If sorting the 'date' column
                  if (new Date(x.innerHTML) > new Date(y.innerHTML)) {
                      shouldSwitch = true;
                      break;
                  }
              } else if (n === 2) { // If sorting the 'amount' column
                  if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
                      shouldSwitch = true;
                      break;
                  }
              } else {
                  if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                      shouldSwitch = true;
                      break;
                  }
              }
          } else if (dir == "desc") {
              if (n === 3) { // If sorting the 'date' column
                  if (new Date(x.innerHTML) < new Date(y.innerHTML)) {
                      shouldSwitch = true;
                      break;
                  }
              } else if (n === 2) { // If sorting the 'amount' column
                  if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
                      shouldSwitch = true;
                      break;
                  }
              } else {
                  if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                      shouldSwitch = true;
                      break;
                  }
              }
          }
      }
      if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
          switchcount++;
      } else {
          if (switchcount == 0 && dir == "asc") {
              dir = "desc";
              switching = true;
          }
      }
  }
}
function generateColors() {
  var colors = [];
  for (var i = 0; i < 12; i++) {
      var r = Math.floor(Math.random() * 256); // Random red component
      var g = Math.floor(Math.random() * 256); // Random green component
      var b = Math.floor(Math.random() * 256); // Random blue component
      var alpha = 0.5; // Fixed alpha value
      var rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
      colors.push(rgba);
  }
  return colors;
}
let expensePieChart=null;

function groupByMonthExpense(exp) {
    // Calculate total expenses for each month
    if(expensePieChart){
      expensePieChart.destroy();
    }
    console.log(exp);
    const expenseByMonth = {};
    exp.forEach(expense => {
        const month = new Date(expense.date).toLocaleString('default', { month: 'long' }); // Extracting YYYY-MM from the date
      if (!expenseByMonth[month]) {
        expenseByMonth[month] = 0;
      }
      expenseByMonth[month] += parseInt(expense.amount);
    });

    // Prepare data for the chart
    const labels = Object.keys(expenseByMonth);
    const data = Object.values(expenseByMonth);
    const colors=generateColors();
    // Create the chart
    const ctx = document.getElementById('expensePieChart').getContext('2d');
    expensePieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Expense by Month',
          data: data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }]
      }
    });
}
function generateSampleData() {
    return [
        
            { id: 11, title: "Dinner Party", category: "Food", amount: "200", date: "2024-08-10", note: "Hosting friends" },
            { id: 12, title: "Taxi Ride", category: "Transportation", amount: "30", date: "2024-08-11", note: "Late night ride" },
            { id: 13, title: "Grocery Shopping", category: "Food", amount: "150", date: "2024-08-12", note: "Stocking up" },
            { id: 14, title: "Concert Tickets", category: "Entertainment", amount: "100", date: "2024-08-13", note: "Live music event" },
            { id: 15, title: "Internet Bill", category: "Utilities", amount: "60", date: "2024-09-14", note: "Monthly internet subscription" },
            { id: 16, title: "New Jacket", category: "Clothing and Accessories", amount: "120", date: "2024-09-15", note: "Winter jacket" },
            { id: 17, title: "Fast Food", category: "Food", amount: "20", date: "2024-10-16", note: "Quick lunch" },
            { id: 18, title: "Flight Tickets", category: "Travel", amount: "500", date: "2024-10-17", note: "Vacation booking" },
            { id: 19, title: "Prescription Medicine", category: "Healthcare", amount: "50", date: "2024-11-18", note: "Monthly medication" },
            { id: 20, title: "Car Insurance", category: "Insurance", amount: "100", date: "2024-11-19", note: "Monthly premium" }
        
        
    ];
}

window.onload = function () {
  const storedExpenses = sessionStorage.getItem('expenses');
  console.log(storedExpenses);
  if (!storedExpenses) { // If there are no stored expenses
      // Generate sample data
      const sampleData = generateSampleData();
      // Convert the sample data to JSON string
      const jsonData = JSON.stringify(sampleData);
      // Store the JSON string in session storage
      sessionStorage.setItem('expenses', jsonData);
      // Set the expenses variable to the sample data
      expenses = sampleData;
  } else {
      // If there are stored expenses, parse and set them to the expenses variable
      expenses = JSON.parse(storedExpenses);
  }

  // Display expenses
  displayExpenses();

  // Generate expense chart
  generateExpenseChart(expenses);

  // Group expenses by month and generate pie chart
  groupByMonthExpense(expenses);
}

function reset(){
        document.getElementById("searchInput").value='';
    document.getElementById("categorySearch").value='';
    displayExpenses();
    generateExpenseChart(expenses);

    // Group expenses by month and generate pie chart
    groupByMonthExpense(expenses);
}

function logout() {
    sessionStorage.setItem('isLoggedIn', 'false');
    window.location.href = 'index.html';
}

