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

    postQuoteToServer(newQuote);
  });

  formContainer.appendChild(form);
}


async function fetchQuotesFromServer() {
  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    let data = await response.json();
    return data.map(function(item) {
      return { text: item.title, category: "Server" };
    });
  } catch (err) {
    console.error("Error fetching from server:", err);
    return [];
  }
}

async function postQuoteToServer(quote) {
  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    let data = await response.json();
    console.log("Posted to server:", data);
    notification.textContent = "Quote posted to server!";
  } catch (err) {
    console.error("Error posting to server:", err);
    notification.textContent = "Failed to post quote to server.";
  }
}

async function syncQuotes() {
  try {
    let serverQuotes = await fetchQuotesFromServer();
    quotes = serverQuotes.concat(quotes);
    saveQuotes();
    populateCategories();
    notification.textContent = "Quotes synced with server. Server data overrides local conflicts.";
  } catch (err) {
    notification.textContent = "Failed to sync with server.";
  }
}

newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuotes);
syncBtn.addEventListener("click", syncQuotes);

loadQuotes();
populateCategories();
makeAddForm();
showRandomQuote();

setInterval(syncQuotes, 30000);
