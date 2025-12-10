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
var syncBtn = document.getElementById("syncQuotes");
var notification = document.getElementById("notification");

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

  var categories = quotes.map(function(q) { return q.category; });
  var uniqueCategories = categories.filter(function(cat, index) {
    return categories.indexOf(cat) === index;
  });

  uniqueCategories.map(function(cat) {
    var opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  var lastFilter = localStorage.getItem(LS_FILTER_KEY);
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
}

function showRandomQuote() {
  var selectedCategory = categoryFilter.value;
  var list = quotes.filter(function(q) {
    return selectedCategory === "all" || q.category === selectedCategory;
  });

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

function fetchFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
    .then(function(response) { return response.json(); })
    .then(function(data) {
      return data.map(function(item) {
        return { text: item.title, category: "Server" };
      });
    });
}

function syncQuotes() {
  fetchFromServer().then(function(serverQuotes) {
    quotes = serverQuotes.concat(quotes);
    saveQuotes();
    populateCategories();
    notification.textContent = "Quotes synced with server. Server data overrides local conflicts.";
  }).catch(function() {
    notification.textContent = "Failed to sync with server.";
  });
}

newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuotes);
syncBtn.addEventListener("click", syncQuotes);

loadQuotes();
populateCategories();
makeAddForm();
showRandomQuote();

setInterval(syncQuotes, 30000);
