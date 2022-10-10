// Change main content on tab click
function openTab(evt, idName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(idName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Change mobile content on tab click
function openMobileTab(evt, idName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("mobileTabContent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByName("mobileTablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace("Active", "");
    console.log(tablinks[i].className)
  }
  document.getElementById(idName).style.display = "block";
  evt.currentTarget.className += "Active";
}

// Show map on 'View Map' button click
function viewMap() {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById("Map").style.display = "block";
  document.getElementById("mapTab").className += " active";
}

// Show checkout tab on click
function checkoutButton() {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById("Checkout").style.display = "block";
  document.getElementById("checkoutTab").className += " active";
}

// Mock on search function (only searches for milk)
var search = function(evt) {
  var icon = document.createElement("i");
  icon.className = "fas fa-map-marker-alt";
  icon.ariaHidden = true;
  var iconDiv = document.getElementById("aisleIcon");
  var label = document.createElement("label");
  if(evt.target.value.toLowerCase() == "milk")
  {
    var aisleText = document.createTextNode("Aisle 3");
    label.appendChild(aisleText);
    iconDiv.appendChild(icon);
    iconDiv.appendChild(label);
    milkSearch.forEach(item => {
      createSearchItem(item.name, item.inCart, item.onList);
    });
  }
  else
  {
    document.getElementById("aisleIcon").innerHTML = "";
    var searchItemDiv = document.getElementById("searchItemDiv");
    searchItemDiv.innerHTML = "";
  }
}

// Search listeners
var searchInput = document.getElementById('searchBar');
searchInput.addEventListener('input', search, false);

// Collapsible functionality
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight)
    {
      content.style.maxHeight = null;
    } 
    else 
    {
      content.style.maxHeight = "180px";
    } 
  });
}

// budget scale variables
var budgetCanvas = document.getElementById("budgetScale");
var budgetCtx = budgetCanvas.getContext("2d");
budgetCtx.fillStyle = "#0c5cb7";

var total = 0;
var budget = 0;
var missingItems = 0;
var overBudgetShown = false;
var missingItemShown = false;

var shoppingList = [{name: "cheese", inCart: true}, {name: "2% milk", inCart: true}, {name: "bread", inCart: false}, {name: "pasta", inCart: false}];
//{name: "cheese", inCart: true}, {name: "2% milk", inCart: true}, {name: "bread", inCart: true}
var inCart = [{name: "cheese", quantity: 2, price: 2.50}, {name: "2% milk", quantity: 1, price: 3}];
// {name: "bread", quantity: 1, price:2.50}

// TODO: move to on cart change function
inCart.forEach(item => {
  total += (item.price * item.quantity);
});

shoppingList.forEach(item => {
  if(!item.inCart) {
    missingItems++;
  }
})
if(missingItems > 0 && !missingItemShown)
{
  createWarning("Missing Items", "warningList");
  missingItemShown = true;
}
else if(missingItems == 0 && missingItemShown) {
  document.getElementById("warningList").innerHTML = "";
  if(overBudgetShown) {
    createWarning("Over Budget", "warningList");
  }
  missingItemShown = false;
}

// Update budget scale and warnings
var onBudgetChange = function(evt) {
    var budgetHeight = document.getElementById("budgetScale").height;
    budget = evt.target.value;

    var fill = (total * budgetHeight)/budget;
    var place = budgetHeight - fill;

    budgetCtx.clearRect(0, 0, budgetCanvas.width, budgetCanvas.height);
    budgetCtx.fillRect(0, place, 100, fill);

    var cartHeader = document.getElementById("cartHeader");
    if(total > budget && !overBudgetShown) {
      createWarning("Over Budget", "warningList");
      overBudgetShown = true;
    }
    else if(total <= budget && overBudgetShown){
      document.getElementById("warningList").innerHTML = "";
      if(missingItemShown) {
        createWarning("Missing Items", "warningList");
      }
      overBudgetShown = false;
    }
};

// Budget input event listeners
var input = document.getElementById('budget');
input.addEventListener('input', onBudgetChange, false);

// Update shown list
function updateListDropdown(list, className)
{
  var checkDiv = document.getElementById(className);
  checkDiv.innerHTML = '';
  for(i in list) {
      var item = list[i];
      var pair = item.name;
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = pair;
      checkbox.value = pair;
      checkbox.checked = item.inCart;
      // checkbox.disabled = true;
      checkDiv.appendChild(checkbox);

      var label = document.createElement('label')
      label.htmlFor = pair;
      label.appendChild(document.createTextNode(pair));

      checkDiv.appendChild(label);
      checkDiv.appendChild(document.createElement("br"));
  }
}
updateListDropdown(shoppingList, "shoppingList");
updateListDropdown(shoppingList, "shoppingListMobile");

// Update backend shopping list
function updateList() {
  var value = document.getElementById("addToList").value;
  document.getElementById("addToList").value = '';
  if(value == "")
  {
    value = document.getElementById("addToListMobile").value;
    document.getElementById("addToListMobile").value = '';
  }
  if(value != "")
  {
    shoppingList.push({name: value, inCart: false});
    updateListDropdown(shoppingList, "shoppingList");
    updateListDropdown(shoppingList, "shoppingListMobile");
    shoppingList.forEach(item => {
      if(!item.inCart) {
        missingItems++;
      }
    })
    
    if(missingItems > 0 && !missingItemShown)
    {
      createWarning("Missing Items", "warningList");
      missingItemShown = true;
    }
    else if(missingItems == 0 && missingItemShown) {
      document.getElementById("warningList").innerHTML = "";
      if(overBudgetShown) {
        createWarning("Over Budget", "warningList");
      }
      missingItemShown = false;
    }
  }
}

// Show items in cart
function showCart(name)
{
  var inCartTable = document.getElementById(name);
  inCartTable.innerHTML = '';
  for(i in inCart) {
      var itemObj = inCart[i];

      var tr = document.createElement('tr');   

      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      var td3 = document.createElement('td');

      var minus = document.createElement('button');
      minus.className = "quantityBtn"
      minus.innerHTML ="-";
      minus.id = "minus " + i;
      minus.setAttribute('onclick','minus(this.id)')

      var plus = document.createElement('button');
      plus.className = "quantityBtn"
      plus.innerHTML ="+";
      plus.id = "plus " + i;
      plus.setAttribute('onclick','plus(this.id)')

      var item = document.createTextNode(itemObj.name);
      var quantity = document.createTextNode(itemObj.quantity);
      var price = document.createTextNode("$" + (itemObj.price * itemObj.quantity));

      td1.appendChild(item);
      td2.appendChild(minus);
      td2.appendChild(quantity);
      td2.appendChild(plus);
      td3.appendChild(price);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);

      inCartTable.appendChild(tr);
  }
  var tfoot = document.createElement("tfoot");
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');

  var totalText = document.createTextNode("Total");
  var totalAmt = document.createTextNode("$" + total.toString());
  var blank = document.createTextNode("");
  td1.appendChild(blank);
  td2.appendChild(totalText);
  td3.appendChild(totalAmt);
  tfoot.appendChild(td1);
  tfoot.appendChild(td2);
  tfoot.appendChild(td3);
  inCartTable.appendChild(tfoot);
}

function minus(id) {
  var index = id.substring(id.length - 1, id.length);
  inCart[index].quantity -= 1
  if(inCart[index].quantity == 0)
  {
    inCart.splice(index, 1);
  }
  total = 0;
  inCart.forEach(item => {
    total += (item.price * item.quantity);
  });
  showCart("inCart");
  showCart("inCartCheck");
  showCart("inCartMobile");
}

function plus(id) {
  var index = id.substring(id.length - 1, id.length);
  inCart[index].quantity += 1

  total = 0;
  inCart.forEach(item => {
    total += (item.price * item.quantity);
  });
  showCart("inCart");
  showCart("inCartCheck");
  showCart("inCartMobile");
}

showCart("inCart");
showCart("inCartCheck");
showCart("inCartMobile");


var milkSearch = [{name: "2% Milk", inCart: false, onList: true}, {name: "Whole Milk", inCart: false, onList: false}, {name: "Almond Milk", inCart: false, onList: false}];

function createSearchItem(name, inCart, onList) {
  var div  = document.createElement("div");
  div.className = "searchItem";
  div.id = name + "div";

  var title = document.createElement("label");
  var totalText = document.createTextNode(name);
  title.appendChild(totalText);
  title.style.marginBottom = "15px";
  div.appendChild(title)

  var addToList = document.createElement("button");
  if(inCart)
  {
    addToList.textContent = "In Cart";
    addToList.disabled = true;
  }
  else if(onList)
  {
    addToList.textContent = "On List";
    addToList.disabled = true;
  }
  else
  {
    addToList.textContent = "Add to List";
  }
  addToList.className = "addToListBtn";
  addToList.id = name;
  addToList.onclick = function(){addSearchToList(this.id)}

  var showMap = document.createElement("button");
  showMap.textContent = "Show on Map";
  showMap.className = "showOnMapBtn";
  showMap.onclick = function(){viewMap()}

  div.appendChild(addToList);
  div.appendChild(showMap);

  var searchDiv = document.getElementById("searchItemDiv");
  searchDiv.appendChild(div);
}

function addSearchToList(id) {
  shoppingList.push({name: id, inCart: false});
  updateListDropdown(shoppingList, "shoppingList");
  updateListDropdown(shoppingList, "shoppingListMobile");
  shoppingList.forEach(item => {
    if(!item.inCart) {
      missingItems++;
    }
  })

  if(missingItems > 0 && !missingItemShown)
  {
    createWarning("Missing Items", "warningList");
    missingItemShown = true;
  }
  else if(missingItems == 0 && missingItemShown) {
    document.getElementById("warningList").innerHTML = "";
    if(overBudgetShown) {
      createWarning("Over Budget", "warningList");
    }
    missingItemShown = false;
  }
  var btn = document.getElementById(id);
  btn.textContent = "On List";
  btn.disabled = true;
}

function createCoupon(title, applied, idName) {
  var div  = document.createElement("div");
  div.className = "couponContentItem";

  var label = document.createElement("label");
  var totalText = document.createTextNode(title);
  label.appendChild(totalText);
  div.appendChild(label)

  var appliedBtn = document.createElement("button");
  appliedBtn.id = title;
  if(applied)
  {
    appliedBtn.textContent = "Applied";
    appliedBtn.disabled = true;
  }
  else
  {
    appliedBtn.textContent = "Apply";
    appliedBtn.setAttribute('onclick','testFunction(this.id)')
  }

  appliedBtn.className = "dropdownBtn";
  div.appendChild(appliedBtn)

  var couponContent = document.getElementById(idName);
  couponContent.appendChild(div);
}

function testFunction(id) {
  var clicked = document.getElementById(id);
  clicked.textContent = "Applied";
  clicked.disabled = true;
}


function createWarning(title, idName) {
  var div  = document.createElement("div");
  div.className = "couponContentItem";

  var label = document.createElement("label");
  var totalText = document.createTextNode(title);
  label.appendChild(totalText);
  div.appendChild(label)

  var detailsBtn = document.createElement("button");
  detailsBtn.textContent = "Details";
  detailsBtn.className = "warningBtn";
  detailsBtn.id = title;
  detailsBtn.setAttribute('onclick','showDetails(this.id)');


  div.appendChild(detailsBtn)

  var couponContent = document.getElementById(idName);
  couponContent.appendChild(div);
}

createCoupon("BOGO 50% off cheese", false, "couponContent");
createCoupon("50% off bread", false, "couponContent");
createCoupon("BOGO 50% off cheese", false, "couponContentCheck");
createCoupon("50% off bread", false, "couponContentCheck");
createCoupon("BOGO 50% off cheese", false, "couponContentMobile");
createCoupon("50% off bread", false, "couponContentMobile");

var detailsPopup = document.getElementById("detailsPopup");
function showDetails(id) {
  var detailsList = document.getElementById("detailsList");
  detailsList.innerHTML = "";
  if(id == "Missing Items") {
    var detailsTitle = document.getElementById("detailsText");
    detailsTitle.innerHTML = "The following item are on your list but not in your cart:"

    shoppingList.forEach(item => {
      if(!item.inCart) {
        var li = document.createElement("li");
        li.innerHTML = item.name;
        detailsList.appendChild(li);
      }
    });

  }
  else {
    var detailsTitle = document.getElementById("detailsText");
    detailsTitle.innerHTML = "You have exceeded your set budget:"

    var totalLi = document.createElement("li");
    totalLi.innerHTML = "Total: $" + total;
    var budgetLi = document.createElement("li");
    budgetLi.innerHTML = "Budget: $" + budget;
    detailsList.appendChild(totalLi);
    detailsList.appendChild(budgetLi);
  }
  detailsPopup.style.display = "block";
}

var payPopup = document.getElementById("payPopup");
function showPayPopup() {
  payPopup.style.display = "block";
}

var closeDetails = document.getElementsByClassName("close")[0];
closeDetails.onclick = function() {
  detailsPopup.style.display = "none";
}

var closePay = document.getElementsByClassName("close")[1];
closePay.onclick = function() {
  payPopup.style.display = "none";
}

function showAisleNum() {
  var aisleCheck = document.getElementById("aisleNumCheck");
  var aisleNums = document.getElementsByClassName("aisleNum");
  if(aisleCheck.checked)
  {
    for (i = 0; i < aisleNums.length; i++) {
      aisleNums[i].style.display = "flex";
    }
  }
  else 
  {
      for (i = 0; i < aisleNums.length; i++) {
        aisleNums[i].style.display = "none";
      }
  }


}


var stop_button = document.getElementById('stop');
var start_button = document.getElementById('start');

stop_button.addEventListener('click', pauseResume);

var routeCanvas = document.getElementById("mapBackground");
var routeCtx = routeCanvas.getContext("2d");

function drawLine(startX, startY, endX, endY)
{
  routeCtx.setLineDash([5, 3]);
  routeCtx.lineWidth = 2;
  routeCtx.beginPath();
  routeCtx.moveTo(startX, startY);
  routeCtx.lineTo(endX, endY);
  routeCtx.strokeStyle = 'red';
  routeCtx.stroke();
}

function drawItem(x, y)
{
  routeCtx.fillStyle = "#1073E5";
  routeCtx.strokeStyle = "gray";
  routeCtx.setLineDash([0, 0]);
  routeCtx.lineWidth = 3;
  routeCtx.beginPath();
  routeCtx.rect(x - 13, y - 8, 25, 15);
  routeCtx.fill();
  routeCtx.stroke();
}

function drawDot(point, color) {
  routeCtx.fillStyle = color;
  routeCtx.strokeStyle = "black";
  routeCtx.lineWidth = 3;
  routeCtx.beginPath();
  routeCtx.arc(point.x, point.y, 8, 0, Math.PI * 2, false);
  routeCtx.closePath();
  routeCtx.fill();
  routeCtx.stroke();
}


// set starting values
var fps = 60;
var percent = 0
var direction = 1;
var numItems = 4;
var pause = false;

function pauseResume()
{
  if(!pause)
  {
    stop_button.innerHTML = 'Resume';
    pause = true;
  }
  else
  {
    stop_button.innerHTML = 'Pause';
    pause = false;
    setTimeout(function () {
      requestAnimationFrame(animate);
      }, 3000 / fps); 
  }
  
}

drawMapLines();
drawItems(numItems);
xy = getLineXYatPercent({
  x: 0,
  y: 570
}, {
  x: 0,
  y: 570
}, percent);
drawDot(xy, "red");

function start() {
  start_button.disabled = true;
  animate();
}

function animate() {

    // set the animation position (0-100)
    percent += direction;
    if (percent < 0) {
        percent = 0;
        direction = 1;
    };
    if (percent < 2000 && !pause)
    {
      draw(percent);

      // request another frame only if it is not done and not paused
      setTimeout(function () {
          requestAnimationFrame(animate);
      }, 3000 / fps);
    }
}
start_button.addEventListener('click', start);

function getLineXYatPercent(startPt, endPt, percent) {
  var dx = endPt.x - startPt.x;
  var dy = endPt.y - startPt.y;
  var X = startPt.x + dx * percent;
  var Y = startPt.y + dy * percent;
  return ({
      x: X,
      y: Y
  });
}

function drawMapLines()
{
  routeCtx.clearRect(0, 0, routeCanvas.width, routeCanvas.height);
  drawLine(0, 570, 160, 570);
  drawLine(160, 570, 160, 480);
  drawLine(160, 470, 160, 350);
  drawLine(160, 350, 410, 350);
  drawLine(410, 350, 410, 250);
  drawLine(410, 240, 410, 110);
  drawLine(410, 110, 500, 110);
  drawLine(510, 110, 920, 110);
  drawLine(920, 110, 920, 400);
  drawLine(920, 410, 920, 570);
  drawLine(920, 570, 590, 570);
  drawLine(590, 570, 590, 600);
}

function drawItems(num)
{
  if(num == 4)
  {
    drawItem(160, 480);
  }
  if(num >= 3)
  {
    drawItem(410, 250);
  }
  if(num >= 2)
  {
    drawItem(500, 110);
  }
  if(num >= 1)
  {
    drawItem(920, 400);
  }
}

function draw(sliderValue) {
  drawMapLines();
  drawItems(numItems);

  routeCtx.setLineDash([0, 0]);

    // draw the circle
    var xy;
    if (sliderValue <= 100) {
        var percent = sliderValue / 100;
        xy = getLineXYatPercent({
            x: 0,
            y: 570
        }, {
            x: 160,
            y: 570
        }, percent);
    }
    else if (sliderValue <= 200){
      var percent = (sliderValue - 100) / 100
      xy = getLineXYatPercent({
          x: 160,
          y: 570
      }, {
          x: 160,
          y: 480
      }, percent);
    }
    else if (sliderValue <= 300) {
      var percent = (sliderValue - 100) / 100
      xy = getLineXYatPercent({
          x: 160,
          y: 480
      }, {
          x: 160,
          y: 480
      }, percent);
      if(numItems == 4)
      {
        numItems--;
      }
    }
    else if(sliderValue <= 400) {
      var percent = (sliderValue - 300) / 100
      xy = getLineXYatPercent({
          x: 160,
          y: 480
      }, {
          x: 160,
          y: 350
      }, percent);
    }
    else if(sliderValue <= 500) {
      var percent = (sliderValue - 400) / 100
      xy = getLineXYatPercent({
          x: 160,
          y: 350
      }, {
          x: 410,
          y: 350
      }, percent);
    }
    else if(sliderValue <= 600) {
      var percent = (sliderValue - 500) / 100
      xy = getLineXYatPercent({
          x: 410,
          y: 350
      }, {
          x: 410,
          y: 250
      }, percent);

    }
    else if(sliderValue <= 700) {
      var percent = (sliderValue - 400) / 100
      xy = getLineXYatPercent({
          x: 410,
          y: 250
      }, {
          x: 410,
          y: 250
      }, percent);
      if(numItems == 3)
      {
        numItems--;
      }
    }
    else if(sliderValue <= 800) {
      var percent = (sliderValue - 700) / 100
      xy = getLineXYatPercent({
          x: 410,
          y: 250
      }, {
          x: 410,
          y: 110
      }, percent);
    }
    else if(sliderValue <= 900) {
      var percent = (sliderValue - 800) / 100
      xy = getLineXYatPercent({
          x: 410,
          y: 110
      }, {
          x: 500,
          y: 110
      }, percent);
    }
    else if(sliderValue <= 1000) {
      var percent = (sliderValue - 800) / 100
      xy = getLineXYatPercent({
          x: 500,
          y: 110
      }, {
          x: 500,
          y: 110
      }, percent);
      if(numItems == 2)
      {
        numItems--;
      }
    }
    else if(sliderValue <= 1100) {
      var percent = (sliderValue - 1000) / 100
      xy = getLineXYatPercent({
          x: 500,
          y: 110
      }, {
          x: 920,
          y: 110
      }, percent);
    }
    else if(sliderValue <= 1200) {
      var percent = (sliderValue - 1100) / 100
      xy = getLineXYatPercent({
          x: 920,
          y: 110
      }, {
          x: 920,
          y: 400
      }, percent);
    }
    else if(sliderValue <= 1300) {
      var percent = (sliderValue - 1100) / 100
      xy = getLineXYatPercent({
          x: 920,
          y: 400
      }, {
          x: 920,
          y: 400
      }, percent);
      if(numItems == 1)
      {
        numItems--;
      }
    }
    else if(sliderValue <= 1400) {
      var percent = (sliderValue - 1300) / 100
      xy = getLineXYatPercent({
          x: 920,
          y: 400
      }, {
          x: 920,
          y: 570
      }, percent);
    }
    else if(sliderValue <= 1500) {
      var percent = (sliderValue - 1400) / 100
      xy = getLineXYatPercent({
          x: 920,
          y: 570
      }, {
          x: 590,
          y: 570
      }, percent);
    }
    else if(sliderValue <= 1600) {
      var percent = (sliderValue - 1500) / 100
      xy = getLineXYatPercent({
          x: 590,
          y: 570
      }, {
          x: 590,
          y: 600
      }, percent);
    }
    else {
      var percent = (sliderValue - 1500) / 100
      xy = getLineXYatPercent({
          x: 590,
          y: 600
      }, {
          x: 590,
          y: 600
      }, percent);
    }
  drawDot(xy, "red");

}