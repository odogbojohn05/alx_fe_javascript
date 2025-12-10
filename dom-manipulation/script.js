var LS_QUOTES_KEY = "my_quotes";
var LS_FILTER_KEY = "my_filter";

var defaultQuotes = [
  { text: "Just stop talking and try doing stuff.", category: "Motivation" },
  { text: "Life happens while you are busy with other things.", category: "Life" },
  { text: "Winning is not forever, losing is not the end. Keep going.", category: "Success" }
];

var quotes = [];

var quoteDisplay = document.getElementById("quoteDisplay");
var newQuoteBtn = document.getElementById("newQuote");
var categoryFilter = document.getElementById("categoryFilter");
var formContainer = document.getElementById("formContainer");

function loadQuotes() {
  var raw = localStorage.getItem(LS_QUOTES_KEY);
  if (raw) {
    try {
      quotes = JSON.parse(raw);
    } catch (e) {
      quotes = defaultQuotes.slice();
    }
  } else {
    quotes = defaultQuotes.slice();
  }
}

function saveQuotes() {
  localStorage.setItem(LS_QUOTES_KEY, JSON.stringify(quotes));
}

function populateCategories() {
  categoryFilter.innerHTML = "";
  var allOpt = document.createElement("option");
  allOpt.value = "all";
  allOpt.textContent = "All Categories";
  categoryFilter.appendChild(allOpt);

  var categories = [];
  for (var i = 0; i < quotes.length; i++) {
    var cat = quotes[i].category;
    if (categories.indexOf(cat) === -1) {
      categories.push(cat);
    }
  }

  for (var j = 0; j < categories.length; j++) {
    var opt = document.createElement("option");
    opt.value = categories[j];
    opt.textContent = categories[j];
    categoryFilter.appendChild(opt);
  }

  // Restore last filter from localStorage
  var lastFilter = localStorage.getItem(LS_FILTER_KEY);
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
}

function showRandomQuote() {
  var selectedCategory = categoryFilter.value;
  var list = [];

  for (var i = 0; i < quotes.length; i++) {
    if (selectedCategory === "all" || quotes[i].category === selectedCategory) {
      list.push(quotes[i]);
    }
  }

  if (list.length > 0) {
    var index = Math.floor(Math.random() * list.length);
    var q = list[index];
    quoteDisplay.textContent = '"' + q.text + '" — ' + q.category;
  } else {
    quoteDisplay.textContent = "No quotes available for this category.";
  }
}
function filterQuotes() {
  var selectedCategory = categoryFilter.value;
  localStorage.setItem(LS_FILTER_KEY, selectedCategory); 
  showRandomQuote();
}

function makeAddForm() {
  var form = document.createElement("form");

  var inputText = document.createElement("input");
  inputText.type = "text";
  inputText.placeholder = "Enter quote text";
  inputText.required = true;

  var inputCat = document.createElement("input");
  inputCat.type = "text";
  inputCat.placeholder = "Enter category";
  inputCat.required = true;

  var addBtn = document.createElement("button");
  addBtn.type = "submit";
  addBtn.textContent = "Add Quote";

  form.appendChild(inputText);
  form.appendChild(inputCat);
  form.appendChild(addBtn);

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    var newQuote = { text: inputText.value.trim(), category: inputCat.value.trim() };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    inputText.value = "";
    inputCat.value = "";
    alert("Quote added!");
  });

  formContainer.appendChild(form);
}

newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuotes);

loadQuotes();
populateCategories();
makeAddForm();
showRandomQuote();
