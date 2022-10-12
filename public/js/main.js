var currentX = 0;
var currentY = 570;
var inAisle = false;
var noWarnings = true;
var currentAisle = 0;

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
    var aisleText = document.createTextNode("Aisle 7");
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
budgetCtx.fillStyle = "#90738c";

var total = 0;
var budget = 0;
var missingItems = 0;
var overBudgetShown = false;
var missingItemShown = false;

var itemsDatabase = [{name: "cheese", x: 160, y: 480, aisle: 2, price: 3},
                     {name: "Almond Milk", x: 410, y: 250, aisle: 7, price: 5},
                     {name: "chicken", x: 500, y: 110, aisle: "Deli", price: 15},
                     {name: "pasta", x: 920, y: 400, aisle: 10, price: 2}]

var shoppingList = [];
var inCart = [];
var aisles = [{number: 2, name: "Dairy: Cheese, Egg, and Butter", coupons: [
                                                                  {name: "BOGO 50% off cheese", product: "cheese", reduction: "50%", quantity:2, deal: true, applied: false},
                                                                  {name: "50 cents off eggs", product: "eggs", reduction: .50, quantity:1, deal: false, applied: false}]},
              {number: 7, name: "Dairy: Milk", coupons: [
                                                {name: "10% off Whole Milk", product: "whole milk", reduction: "10%", quantity:1, deal: true, applied: false}]},
              {number: "Deli", name: "Deli", coupons: [
                                                {name: "BOGO 50% off turkey", product: "turkey", reduction: "50%", quantity:2, deal: false, applied: false},
                                                {name: "2 dollars off chicken", product: "chicken", reduction: 2, quantity:1, deal: true, applied: false}]},
              {number: 10, name:"Pasta and Grain", coupons: [
                                                    {name: "Buy 2 get 1 free Pasta", product: "pasta", reduction: itemsDatabase[3].price, quantity:3, deal: false, applied: false}]}
              ]

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
else if(missingItems == 0) {
  document.getElementById("warningList").innerHTML = "";
  if(overBudgetShown) {
    createWarning("Over Budget", "warningList");
  }
  else {
    createNoWarnings("warningList");
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
      else {
        createNoWarnings("warningList");
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

    itemsDatabase.forEach(item => {
      if(item.name == value) {
        drawItem(item.x, item.y)
        connectItem(item,inAisle)
      }
    })

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
      else {
        createNoWarnings("warningList");
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


var milkSearch = [{name: "2% Milk", inCart: false, onList: false}, {name: "Whole Milk", inCart: false, onList: false}, {name: "Almond Milk", inCart: false, onList: false}];

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

  itemsDatabase.forEach(item => {
    if(item.name == id) {
      drawItem(item.x, item.y)
      connectItem(item,inAisle)
    }
  })

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
    else {
      createNoWarnings("warningList");
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
  appliedBtn.id = title + "-" + idName;
  if(applied)
  {
    appliedBtn.textContent = "Applied";
    appliedBtn.disabled = true;
  }
  else
  {
    appliedBtn.textContent = "Apply";
    appliedBtn.setAttribute('onclick','applyCoupon(this.id)')
  }

  appliedBtn.className = "dropdownBtn";
  div.appendChild(appliedBtn)

  var couponContent = document.getElementById(idName);
  couponContent.appendChild(div);
}

function clearCouponContent() {
  document.getElementById("couponContent").innerHTML = "";
  document.getElementById("couponContentMobile").innerHTML = "";
}

function clearCouponContentCheck() {
  document.getElementById("couponContentCheck").innerHTML = "";
}

function setAisleCoupons(aisleNum) {
  clearCouponContent();
  document.getElementById("currentAisle").innerHTML = "Current Aisle: " + aisleNum;
  var mainCoupon = document.getElementById("couponContent");
  var mobileCoupon = document.getElementById("couponContentMobile");
  var h2 = document.createElement("h2");
  h2.innerHTML = "Aisle " + aisleNum;
  var h2Mobile = document.createElement("h2");
  h2Mobile.innerHTML = "Aisle " + aisleNum;
  mainCoupon.appendChild(h2);
  mobileCoupon.appendChild(h2Mobile);
  aisles.forEach(aisle => {
    if(aisle.number == aisleNum) {
      aisle.coupons.forEach(coupon => {
        createCoupon(coupon.name, coupon.applied, "couponContent")
        createCoupon(coupon.name, coupon.applied, "couponContentMobile")
      })
    }
  })
}

function setTodaysDeals() {
  clearCouponContent();
  var couponContent = document.getElementById("couponContent");
  var couponContentMobile = document.getElementById("couponContentMobile");
  var h2 = document.createElement("h2");
  h2.innerHTML = "Today's Deals";
  var h2Mobile = document.createElement("h2");
  h2Mobile.innerHTML = "Today's Deals";
  couponContent.appendChild(h2);
  couponContentMobile.appendChild(h2Mobile);
  aisles.forEach(aisle => {
      aisle.coupons.forEach(coupon => {
        if(coupon.deal) {
          createCoupon(coupon.name, coupon.applied, "couponContent")
          createCoupon(coupon.name, coupon.applied, "couponContentMobile")
        }
      })
  })
}

function setCouponsInCart() {
  clearCouponContentCheck();

  inCart.forEach(item => {
    aisles.forEach(aisle => {
      aisle.coupons.forEach(coupon => {
        if(coupon.product == item.name) {
          createCoupon(coupon.name, coupon.applied, "couponContentCheck")
        }
      })
  })

  })
}

setTodaysDeals();

function applyCoupon(id) {
  var name = id.substring(0,id.indexOf("-"));
  // var clicked = document.getElementById(id);
  // clicked.textContent = "Applied";
  // clicked.disabled = true;
  aisles.forEach(aisle => {
    aisle.coupons.forEach(coupon => {
      if(coupon.name == name) {
        coupon.applied = true;
      }
    })
  })
  if(currentAisle == 0) {
    setTodaysDeals();
  }
  else {
    setAisleCoupons(currentAisle);
  }
  setCouponsInCart();
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
  detailsBtn.className = "dropdownBtn";
  detailsBtn.id = title;
  detailsBtn.setAttribute('onclick','showDetails(this.id)');


  div.appendChild(detailsBtn)

  var couponContent = document.getElementById(idName);
  if(noWarnings) {
    couponContent.innerHTML = "";
  }
  couponContent.appendChild(div);
}

function createNoWarnings(idName) {
  var div  = document.createElement("div");
  div.className = "couponContentItem";

  var label = document.createElement("label");
  var totalText = document.createTextNode("No Warnings. Click Pay to checkout.");
  label.appendChild(totalText);
  div.appendChild(label)
  var couponContent = document.getElementById(idName);
  couponContent.appendChild(div);
  noWarnings = true;
}

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

var simulate_button = document.getElementById('start');

var routeCanvas = document.getElementById("mapBackground");
var routeCtx = routeCanvas.getContext("2d");

function drawLine(startX, startY, endX, endY)
{
  routeCtx.setLineDash([5, 3]);
  routeCtx.lineWidth = 2;
  routeCtx.beginPath();
  routeCtx.moveTo(startX, startY);
  routeCtx.lineTo(endX, endY);
  routeCtx.strokeStyle = '#593202';
  routeCtx.stroke();
}

function drawItem(x, y)
{
  routeCtx.fillStyle = "#739086";
  routeCtx.strokeStyle = "gray";
  routeCtx.setLineDash([0, 0]);
  routeCtx.lineWidth = 3;
  routeCtx.beginPath();
  routeCtx.rect(x - 13, y - 8, 25, 15);
  routeCtx.fill();
  routeCtx.stroke();
}

function drawDot(point) {
  routeCtx.fillStyle = "#90738c";
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function simulate() {
  var budgetInput = document.getElementById("budget");
  var mobileInput = document.getElementById("addToListMobile");
  var mobileInputBtn = document.getElementById("addToListBtnMobile");
  var searchInput = document.getElementById("searchBar");
  var listCollapsible = document.getElementById("listCollapsible")
  var listInput = document.getElementById("addToList");
  var listInputBtn = document.getElementById("addToListBtn");
  var listViewMapBtn = document.getElementById("listViewMap");

  var budgetEvt = {
    target: {
      value: 100
    }
  };
  var searchEvt = {
    target: {
      value: "milk"
    }
  };

  budgetInput.value = "100";
  onBudgetChange(budgetEvt);
  await sleep(500);
  mobileInput.value = "cheese";
  await sleep(1000);
  mobileInputBtn.click();
  await sleep(1000);
  searchInput.value = "milk"
  await sleep(500);
  search(searchEvt);
  var milkAddBtn = document.getElementById("Almond Milk");
  await sleep(1000);
  milkAddBtn.click();
  await sleep(1000);
  listCollapsible.click();
  await sleep(1000);
  listInput.value = "chicken";
  await sleep(500);
  listInputBtn.click();
  await sleep(500);
  listInput.value = "pasta";
  await sleep(500);
  listInputBtn.click();
  await sleep(2000);
  listViewMapBtn.click();

  simulate_button.disabled = true;
  animate();
}

function animate() {

    // set the animation position (0-100)
    percent += direction;
    if (percent < 0) {
        percent = 0;
        direction = 1;
    };
    if (percent < 2000)
    {
      draw(percent);

      // request another frame
      setTimeout(function () {
          requestAnimationFrame(animate);
      }, 3000 / fps);
    }
}
simulate_button.addEventListener('click', simulate);

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
  if(numItems == 4)
  {
    currentX = 0;
    currentY = 570;
    inAisle = false;
    connectItem(itemsDatabase[0], inAisle);
  }
  if(numItems >= 3)
  {
    currentX = itemsDatabase[0].x;
    currentY = itemsDatabase[0].y;
    inAisle = typeof itemsDatabase[0].aisle == "number";
    connectItem(itemsDatabase[1], inAisle);
  }
  if(numItems >= 2)
  {
    currentX = itemsDatabase[1].x;
    currentY = itemsDatabase[1].y;
    inAisle = typeof itemsDatabase[1].aisle == "number";
    connectItem(itemsDatabase[2], inAisle);
  }
  if(numItems >= 1)
  {
    currentX = itemsDatabase[2].x;
    currentY = itemsDatabase[2].y;
    inAisle = typeof itemsDatabase[2].aisle == "number";
    connectItem(itemsDatabase[3], inAisle);
  }
  else {
    drawLine(920, 410, 920, 570);
    drawLine(920, 570, 590, 570);
    drawLine(590, 570, 590, 600);
  }
}

function connectItem(item, inAisleLoc)
{
  const middleLane = 350;
  const fullAisle = 800;
  const topLane = 110;
  const bottomLane = 570;

  console.log(currentX)
  console.log(currentY)
  if(!inAisleLoc) {
    drawLine(currentX, currentY, item.x, currentY);
    drawLine(item.x, currentY, item.x, item.y);
  }
  else if((currentY > middleLane && currentX < fullAisle) || (item.y > middleLane && currentY < middleLane && item.x < fullAisle)){
    drawLine(currentX, currentY, currentX, middleLane);
    drawLine(currentX, middleLane, item.x, middleLane);
    drawLine(item.x, middleLane, item.x, item.y);
  }
  else if((currentY < middleLane && item.x > fullAisle) || (currentX > fullAisle && item.y < middleLane)) {
    drawLine(currentX, currentY, currentX, topLane);
    drawLine(currentX, topLane, item.x, topLane);
    drawLine(item.x, topLane, item.x, item.y);
  }
  else if(currentX > fullAisle && item.y > middleLane) {
    drawLine(currentX, currentY, currentX, bottomLane);
    drawLine(currentX, bottomLane, item.x, bottomLane);
    drawLine(item.x, bottomLane, item.x, item.y);
  }
  else {
    drawLine(currentX, currentY, currentX, item.y);
    drawLine(currentX, item.y, item.x, item.y);
  }
  currentX = item.x;
  currentY = item.y;
  inAisle = (typeof item.aisle === 'number')
}

function addItemToCart(index, quantity) {
  inCart.push({name: itemsDatabase[index].name, quantity: quantity, price: itemsDatabase[index].price})
  total += quantity*itemsDatabase[index].price;
  showCart("inCart");
  showCart("inCartCheck");
  showCart("inCartMobile");

  var evt = {
    target: {
      value: budget
    }
  }
  onBudgetChange(evt);

  missingItems = 0
  shoppingList.forEach(item => {
    if(item.name == itemsDatabase[index].name)
     {
      item.inCart = true;
     }
     if(!item.inCart) {
      missingItems++;
    }
  });
  updateListDropdown(shoppingList, "shoppingList");
  updateListDropdown(shoppingList, "shoppingListMobile");

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
    else {
      createNoWarnings("warningList");
    }
    missingItemShown = false;
  }

  setCouponsInCart();
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
var click = true;
var checkout = true;

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
      if(click)
      {
        currentAisle = itemsDatabase[0].aisle;
        setAisleCoupons(currentAisle);
        // document.getElementById("homeTab").click();
        // document.getElementById("couponCollapsible").click();
        click = false;
      }
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
        var inCartBtn = document.getElementById("cartCollapsible");
        var inCartMobileBtn = document.getElementById("cartTabMobile");
        
        inCartBtn.click();
        inCartMobileBtn.click();
        addItemToCart(0,2);
        inCartBtn.click();
        inCartMobileBtn.click();
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
      currentAisle = itemsDatabase[1].aisle;
      setAisleCoupons(currentAisle);
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
        addItemToCart(1,1);
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
      currentAisle = itemsDatabase[2].aisle;
      setAisleCoupons(currentAisle);
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
        addItemToCart(2,1);
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
      currentAisle= itemsDatabase[3].aisle;
      setAisleCoupons(currentAisle);
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
        addItemToCart(3,3);
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
      document.getElementById("currentAisle").innerHTML = "Current Aisle: None";
      currentAisle = 0
      setTodaysDeals();
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
      routeCtx.clearRect(0, 0, routeCanvas.width, routeCanvas.height);
      if(checkout) {
        document.getElementById("checkoutTab").click();
      }
    }
  drawDot(xy);

}