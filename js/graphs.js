
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




var modal = document.getElementById("expenseModal");
var addExpenseBtn = document.getElementById("addExpenseBtn");

var span = document.getElementsByClassName("close")[0];


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
  // Generate expense chart
  generateExpenseChart(expenses);

  // Group expenses by month and generate pie chart
  groupByMonthExpense(expenses);
}



