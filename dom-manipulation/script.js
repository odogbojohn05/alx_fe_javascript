var LS_QUOTES_KEY = "my_quotes";
var SS_LAST_QUOTE_KEY = "my_last_quote";

var defaultQuotes = [
  { text: "Just stop talking and try doing stuff.", category: "Motivation" },
  { text: "Life happens while you are busy with other things.", category: "Life" },
  { text: "Winning is not forever, losing is not the end. Keep going.", category: "Success" }
];

var quotes = [];

var quoteDisplay = document.getElementById("quoteDisplay");
var newQuoteBtn = document.getElementById("newQuote");
var categorySelect = document.getElementById("categorySelect");
var formContainer = document.getElementById("formContainer");
var exportBtn = document.getElementById("exportJson");
var importInput = document.getElementById("importFile");
var showLastViewedBtn = document.getElementById("showLastViewed");
var clearSessionBtn = document.getElementById("clearSession");
var sessionInfo = document.getElementById("sessionInfo");

function loadQuotes() {
  var raw = localStorage.getItem(LS_QUOTES_KEY);
  if (raw) {
    try {
      var data = JSON.parse(raw);
      if (Array.isArray(data)) {
        quotes = data;
      } else {
        quotes = defaultQuotes.slice();
      }
    } catch (e) {
      quotes = defaultQuotes.slice();
    }
  } else {
    quotes = defaultQuotes.slice();
  }
}

function saveQuotes() {
  try {
    localStorage.setItem(LS_QUOTES_KEY, JSON.stringify(quotes));
  } catch (e) {
    alert("Could not save quotes.");
  }
}

function fillCategories() {
  categorySelect.innerHTML = "";
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
    categorySelect.appendChild(opt);
  }

  if (categories.length === 0) {
    var empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "No categories";
    categorySelect.appendChild(empty);
  }
}

function showRandomQuote() {
  var selectedCategory = categorySelect.value;
  var list = [];

  for (var i = 0; i < quotes.length; i++) {
    if (!selectedCategory || quotes[i].category === selectedCategory) {
      list.push(quotes[i]);
    }
  }

  if (list.length > 0) {
    var index = Math.floor(Math.random() * list.length);
    var q = list[index];
    quoteDisplay.textContent = '"' + q.text + '" — ' + q.category;

    try {
      sessionStorage.setItem(SS_LAST_QUOTE_KEY, JSON.stringify(q));
    } catch (e) {}
  } else {
    quoteDisplay.textContent = "No quotes available for this category.";
  }
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

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var textValue = inputText.value.trim();
    var catValue = inputCat.value.trim();

    if (textValue === "" || catValue === "") {
      alert("Please fill both fields.");
      return;
    }

    var newQuote = { text: textValue, category: catValue };
    quotes.push(newQuote);
    saveQuotes();        
    fillCategories();    

    inputText.value = "";
    inputCat.value = "";
    alert("Quote added and saved!");
  });

  formContainer.appendChild(form);
}

function exportQuotes() {
  var data = JSON.stringify(quotes, null, 2);
  var blob = new Blob([data], { type: "application/json" });
  var url = URL.createObjectURL(blob);

  var a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  var file = event.target.files && event.target.files[0];
  if (!file) {
    return;
  }

  var reader = new FileReader();
  reader.onload = function (ev) {
    try {
      var imported = JSON.parse(ev.target.result);

      if (!Array.isArray(imported)) {
        alert("Invalid file. Must be an array of quotes.");
        return;
      }

      var valid = [];
      for (var i = 0; i < imported.length; i++) {
        var item = imported[i];
        if (item && typeof item.text === "string" && typeof item.category === "string") {
          valid.push({ text: item.text, category: item.category });
        }
      }

      if (valid.length === 0) {
        alert("No valid quotes found in file.");
        return;
      }

      quotes = quotes.concat(valid);
      saveQuotes();
      fillCategories();
      alert("Quotes imported!");
      importInput.value = ""; 
    } catch (e) {
      alert("Could not read JSON file.");
    }
  };

  reader.readAsText(file);
}

function showLastViewed() {
  var raw = sessionStorage.getItem(SS_LAST_QUOTE_KEY);
  if (raw) {
    try {
      var q = JSON.parse(raw);
      sessionInfo.textContent = 'Last viewed: "' + q.text + '" — ' + q.category;
    } catch (e) {
      sessionInfo.textContent = "No last viewed quote.";
    }
  } else {
    sessionInfo.textContent = "No last viewed quote.";
  }
}

function clearSession() {
  sessionStorage.removeItem(SS_LAST_QUOTE_KEY);
  sessionInfo.textContent = "Session cleared.";
}

newQuoteBtn.addEventListener("click", showRandomQuote);
categorySelect.addEventListener("change", showRandomQuote);
exportBtn.addEventListener("click", exportQuotes);
importInput.addEventListener("change", importFromJsonFile);
showLastViewedBtn.addEventListener("click", showLastViewed);
clearSessionBtn.addEventListener("click", clearSession);

loadQuotes();
fillCategories();
makeAddForm();
showRandomQuote();

