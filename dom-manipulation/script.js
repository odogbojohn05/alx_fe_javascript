var quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

var quoteDisplay = document.getElementById("quoteDisplay");
var newQuoteBtn = document.getElementById("newQuote");
var categorySelect = document.getElementById("categorySelect");
var formContainer = document.getElementById("formContainer");

function showCategories() {
  categorySelect.innerHTML = "";
  var categories = [];

  for (var i = 0; i < quotes.length; i++) {
    var cat = quotes[i].category;
    if (categories.indexOf(cat) === -1) {
      categories.push(cat);
    }
  }

  for (var j = 0; j < categories.length; j++) {
    var option = document.createElement("option");
    option.value = categories[j];
    option.textContent = categories[j];
    categorySelect.appendChild(option);
  }
}

function showRandomQuote() {
  var selectedCategory = categorySelect.value;
  var filteredQuotes = [];

  for (var i = 0; i < quotes.length; i++) {
    if (quotes[i].category === selectedCategory) {
      filteredQuotes.push(quotes[i]);
    }
  }

  if (filteredQuotes.length > 0) {
    var randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    var quote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = '"' + quote.text + '" — ' + quote.category;
  } else {
    quoteDisplay.textContent = "No quotes available for this category.";
  }
}

function createAddQuoteForm() {
  var form = document.createElement("form");

  var quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter your quote";

  var categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter category";

  var addBtn = document.createElement("button");
  addBtn.type = "submit";
  addBtn.textContent = "Add Quote";

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addBtn);

  form.onsubmit = function(e) {
    e.preventDefault();
    var newQuote = {
      text: quoteInput.value,
      category: categoryInput.value
    };
    quotes.push(newQuote);
    showCategories();
    quoteInput.value = "";
    categoryInput.value = "";
    alert("Quote added!");
  };

  formContainer.appendChild(form);
}

newQuoteBtn.onclick = showRandomQuote;

showCategories();
createAddQuoteForm();
showRandomQuote();
