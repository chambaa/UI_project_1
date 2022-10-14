var currentX = 0;
var currentY = 570;
var inAisle = false;
var noWarnings = true;
var currentAisle = 0;

var simulate_button = document.getElementById('start');
var reset_button = document.getElementById('reset');
var add_button = document.getElementById('addToCart');
add_button.disabled = true;

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
  if(evt.target.value.toLowerCase().includes("milk"))
  {
    var aisleText = document.createTextNode(" Aisle 7");
    label.appendChild(aisleText);
    iconDiv.appendChild(icon);
    iconDiv.appendChild(label);
    milkSearch.forEach(item => {
      createSearchItem(item);
    });
  }
  else if(evt.target.value.toLowerCase().includes("cheese")) {
    var aisleText = document.createTextNode(" Aisle 2");
    label.appendChild(aisleText);
    iconDiv.appendChild(icon);
    iconDiv.appendChild(label);
    cheeseSearch.forEach(item => {
      createSearchItem(item);
    });
  }
  else if(evt.target.value.toLowerCase().includes("chicken")) {
    var aisleText = document.createTextNode(" Deli");
    label.appendChild(aisleText);
    iconDiv.appendChild(icon);
    iconDiv.appendChild(label);
    chickenSearch.forEach(item => {
      createSearchItem(item);
    });
  }
  else if(evt.target.value.toLowerCase().includes("pasta")) {
    var aisleText = document.createTextNode("Aisle 10");
    label.appendChild(aisleText);
    iconDiv.appendChild(icon);
    iconDiv.appendChild(label);
    pastaSearch.forEach(item => {
      createSearchItem(item);
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
                     {name: "milk", x: 410, y: 250, aisle: 7, price: 5},
                     {name: "chicken", x: 500, y: 110, aisle: "Deli", price: 15},
                     {name: "pasta", x: 920, y: 400, aisle: 10, price: 2}]

var shoppingList = [];
var inCart = [];
var aisles = [{number: 2, name: "Dairy: Cheese, Egg, and Butter", coupons: [
                                                                  {name: "BOGO 50% off cheese", product: "cheese", reduction: .50, quantity:2, deal: true, applied: false, percent: true},
                                                                  {name: "50 cents off eggs", product: "eggs", reduction: .50, quantity:1, deal: false, applied: false, percent: false}]},
              {number: 7, name: "Dairy: Milk", coupons: [
                                                {name: "10% off Whole Milk", product: "whole milk", reduction: .10, quantity:1, deal: true, applied: false, percent: true}]},
              {number: "Deli", name: "Deli", coupons: [
                                                {name: "BOGO 50% off turkey", product: "turkey", reduction: .50, quantity:2, deal: false, applied: false, percent: true},
                                                {name: "$2 off chicken", product: "chicken", reduction: 2, quantity:1, deal: true, applied: false, percent: false}]},
              {number: 10, name:"Pasta and Grain", coupons: [
                                                    {name: "Buy 2 get 1 free Pasta", product: "pasta", reduction: itemsDatabase[3].price, quantity:3, deal: false, applied: false, percent: false}]}
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

var mappedItems = [];

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
      if(value.toLowerCase().includes(item.name.toLowerCase())) {
        var mapped = false;
        mappedItems.forEach(map => {
          if(map.x == item.x && map.y == item.y) {
            mapped = true;
          }
        })
        if(!mapped)
        {
          drawItem(item.x, item.y);
          connectItem(item,inAisle);
          var mappedItem = {name: value, x: item.x, y: item.y, aisle: item.aisle, price: item.price, product: item.name};
          mappedItems.push(mappedItem);
          add_button.disabled = false;
        }
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
  var trHead = document.createElement('tr');
  th1 = document.createElement('th');
  th2 = document.createElement('th');
  th3 = document.createElement('th');
  var itemLabel = document.createTextNode("Item");
  var quantityLabel = document.createTextNode("Quantity");
  var priceLabel = document.createTextNode("Price");
  th1.appendChild(itemLabel);
  th2.appendChild(quantityLabel);
  th3.appendChild(priceLabel);
  trHead.appendChild(th1);
  trHead.appendChild(th2);
  trHead.appendChild(th3);
  inCartTable.appendChild(trHead);
  for(i in inCart) {
      var itemObj = inCart[i];
      var span = itemObj.discount > 0 ? 2 : 1;

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
      td1.rowSpan = span;
      td2.appendChild(minus);
      td2.appendChild(quantity);
      td2.appendChild(plus);
      td2.rowSpan = span
      td3.appendChild(price);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);

      inCartTable.appendChild(tr);
      if(itemObj.discount > 0) {
        var tr2 = document.createElement('tr');  
        var td4 = document.createElement('td'); 
        var discount = document.createTextNode("- $" + itemObj.discount);
        td4.style.color = "red"
        td4.appendChild(discount);
        tr2.appendChild(td4);
        inCartTable.appendChild(tr2);
      }
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
  var updatedItem = inCart[index];
  updatedItem.quantity -= 1
  if(updatedItem.quantity == 0)
  {
    inCart.splice(index, 1);
  }
  else
  {
    aisles.forEach(aisle => {
      aisle.coupons.forEach(coupon => {
        if(updatedItem.name.toLowerCase().includes(coupon.product.toLowerCase())  && coupon.applied) {
          if(updatedItem.quantity >= coupon.quantity) {
            if(coupon.percent) {
              var discount = updatedItem.price * coupon.reduction;
              updatedItem.discount = discount * Math.floor(updatedItem.quantity/coupon.quantity);
            }
            else {
              updatedItem.discount = coupon.reduction * Math.floor(updatedItem.quantity/coupon.quantity);
            }
          }
          else {
            updatedItem.discount = 0;
          }
        }
      })
    })
  }
  total = 0;
  inCart.forEach(item => {
    total += ((item.price * item.quantity) - item.discount);
  });
  var evt = {
    target: {
      value: budget
    }
  }
  onBudgetChange(evt);

  showCart("inCart");
  showCart("inCartCheck");
  showCart("inCartMobile");
}

function plus(id) {
  var index = id.substring(id.length - 1, id.length);
  var updatedItem = inCart[index];
  updatedItem.quantity += 1
  aisles.forEach(aisle => {
    aisle.coupons.forEach(coupon => {
      if(updatedItem.name.toLowerCase().includes(coupon.product.toLowerCase()) && coupon.applied) {
        if(updatedItem.quantity >= coupon.quantity) {
          if(coupon.percent) {
            var discount = updatedItem.price * coupon.reduction;
            updatedItem.discount = discount * Math.floor(updatedItem.quantity/coupon.quantity);
          }
          else {
            updatedItem.discount = coupon.reduction * Math.floor(updatedItem.quantity/coupon.quantity);
          }
        }
        else {
          updatedItem.discount = 0;
        }
      }
    })
  })

  total = 0;
  inCart.forEach(item => {
    total += ((item.price * item.quantity) - item.discount);
  });
  var evt = {
    target: {
      value: budget
    }
  }
  onBudgetChange(evt);

  showCart("inCart");
  showCart("inCartCheck");
  showCart("inCartMobile");
}

showCart("inCart");
showCart("inCartCheck");
showCart("inCartMobile");


var milkSearch = [{name: "2% Milk", inCart: false, onList: false, product: "milk"}, {name: "Whole Milk", inCart: false, onList: false, product: "milk"}, {name: "Almond Milk", inCart: false, onList: false, product: "milk"}];
var cheeseSearch = [{name: "Chedder Cheese", inCart: false, onList: false, product: "cheese"}, {name: "Mexican Blend Cheese", inCart: false, onList: false, product: "cheese"}, {name: "Mozzerarella Cheese", inCart: false, onList: false, product: "cheese"}];
var chickenSearch = [{name: "Organic Chicken", inCart: false, onList: false, product: "chicken"}, {name: "Frozen Chicken", inCart: false, onList: false, product: "chicken"}, {name: "Rotisserie Chicken", inCart: false, onList: false, product: "chicken"}, {name: "Fried Chicken", inCart: false, onList: false, product: "chicken"}];
var pastaSearch = [{name: "Penne Pasta", inCart: false, onList: false, product: "pasta"}, {name: "Farfalle Pasta", inCart: false, onList: false, product: "pasta"}];

function createSearchItem(item) {
  var div  = document.createElement("div");
  div.className = "searchItem";
  div.id = item.name + "div";

  var title = document.createElement("label");
  var totalText = document.createTextNode(item.name);
  title.appendChild(totalText);
  title.style.marginBottom = "15px";
  div.appendChild(title)

  var addToList = document.createElement("button");
  if(item.inCart)
  {
    addToList.textContent = "In Cart";
    addToList.disabled = true;
  }
  else if(item.onList)
  {
    addToList.textContent = "On List";
    addToList.disabled = true;
  }
  else
  {
    addToList.textContent = "Add to List";
  }
  addToList.className = "addToListBtn";
  addToList.id = item.name + "-" + item.product;
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
  var name = id.substring(0,id.indexOf("-"));
  var product = id.substring(id.indexOf("-") + 1, id.length);
  shoppingList.push({name: name, inCart: false});
  updateListDropdown(shoppingList, "shoppingList");
  updateListDropdown(shoppingList, "shoppingListMobile");

  var mapped = false;
  itemsDatabase.forEach(item => {
    if(item.name == product) {
      mappedItems.forEach(map => {
        if(map.x == item.x && map.y == item.y) {
          mapped = true;
        }
      })
      if(!mapped)
      {
        drawItem(item.x, item.y)
        connectItem(item,inAisle)
        var mappedItem = {name: name, x: item.x, y: item.y, aisle: item.aisle, price: item.price, product: item.name};
        mappedItems.push(mappedItem);
        add_button.disabled = false;
      }
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

function createCoupon(coupon, idName) {
  var div  = document.createElement("div");
  div.className = "couponContentItem";

  var label = document.createElement("label");
  var totalText = document.createTextNode(coupon.name);
  label.appendChild(totalText);
  div.appendChild(label)

  var appliedBtn = document.createElement("button");
  appliedBtn.id = coupon.name + "-" + idName;

  var couponInCart = false;
  inCart.forEach(item => {
    if(item.name.toLowerCase().includes(coupon.product.toLowerCase())) {
      couponInCart = true;
    }
  })

  if(coupon.applied)
  {
    appliedBtn.textContent = "Applied";
    appliedBtn.disabled = true;
  }
  else if(!couponInCart) {
    appliedBtn.textContent = "Apply";
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
  if(aisleNum == 0)
  {
    setTodaysDeals();
    document.getElementById("currentAisle").innerHTML = "Current Aisle: None";
  }
  else {
    document.getElementById("currentAisle").innerHTML = "Current Aisle: " + aisleNum;
    var mainCoupon = document.getElementById("couponContent");
    var mobileCoupon = document.getElementById("couponContentMobile");
    var h2 = document.createElement("h2");
    h2.innerHTML = "Aisle " + aisleNum;
    h2.style.color = "#593202";
    var h2Mobile = document.createElement("h2");
    h2Mobile.innerHTML = "Aisle " + aisleNum;
    mainCoupon.appendChild(h2);
    mobileCoupon.appendChild(h2Mobile);
    aisles.forEach(aisle => {
      if(aisle.number == aisleNum) {
        aisle.coupons.forEach(coupon => {
          createCoupon(coupon, "couponContent")
          createCoupon(coupon, "couponContentMobile")
        })
      }
    })
  }
}

function setTodaysDeals() {
  clearCouponContent();
  var couponContent = document.getElementById("couponContent");
  var couponContentMobile = document.getElementById("couponContentMobile");
  var h2 = document.createElement("h2");
  h2.innerHTML = "Today's Deals";
  h2.style.color = "#593202";
  var h2Mobile = document.createElement("h2");
  h2Mobile.innerHTML = "Today's Deals";
  h2Mobile.style.color = "#593202";
  couponContent.appendChild(h2);
  couponContentMobile.appendChild(h2Mobile);
  aisles.forEach(aisle => {
      aisle.coupons.forEach(coupon => {
        if(coupon.deal) {
          createCoupon(coupon, "couponContent")
          createCoupon(coupon, "couponContentMobile")
        }
      })
  })
}

function setCouponsInCart() {
  clearCouponContentCheck();

  inCart.forEach(item => {
    aisles.forEach(aisle => {
      aisle.coupons.forEach(coupon => {
        if(item.name.toLowerCase().includes(coupon.product.toLowerCase())) {
          createCoupon(coupon, "couponContentCheck")
        }
      })
  })

  })
}

setTodaysDeals();

function applyCoupon(id) {
  var name = id.substring(0,id.indexOf("-"));
  aisles.forEach(aisle => {
    aisle.coupons.forEach(coupon => {
      if(coupon.name == name) {
        inCart.forEach(item => {
          if(item.name.toLowerCase().includes(coupon.product.toLowerCase())) {
            coupon.applied = true;
            if(item.quantity >= coupon.quantity) {
              if(coupon.percent) {
                var discount = item.price * coupon.reduction;
                item.discount = discount * Math.floor(item.quantity/coupon.quantity);
              }
              else {
                item.discount = coupon.reduction * Math.floor(item.quantity/coupon.quantity);
              }
              total -= item.discount;
            }
          }
        })
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
  showCart("inCart");
  showCart("inCartCheck");
  showCart("inCartMobile");
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

function submitPay() {
  payPopup.style.display = "none";
  document.getElementById("finishPopup").style.display = "block";
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

function addItemToCart(index, quantity, name = itemsDatabase[index].name) {
  inCart.push({name: name, quantity: quantity, price: itemsDatabase[index].price, discount: 0})
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
    if(item.name.toLowerCase().includes(itemsDatabase[index].name.toLowerCase()))
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
  setAisleCoupons(currentAisle);
}

function mockAddToCart() {
  var itemToRemove = mappedItems[0];
  mappedItems.splice(0, 1);
  routeCtx.clearRect(0, 0, routeCanvas.width, routeCanvas.height);
  currentX = itemToRemove.x;
  currentY = itemToRemove.y;
  currentAisle = itemToRemove.aisle;
  itemsDatabase.forEach(databaseItem => {
    if(databaseItem.name == itemToRemove.product) {
      const index = itemsDatabase.indexOf(databaseItem);
      addItemToCart(index, 1, itemToRemove.name);
      
    }
  }) 
  inAisle = typeof itemToRemove.aisle == "number";
  
  if(mappedItems.length == 0) {
    add_button.disabled = true;
  }
  else
  {
    mappedItems.forEach(item => {
      drawItem(item.x, item.y)
      connectItem(item, inAisle)
    })
  }
}

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

function reset() {
  window.location.reload();
}

async function simulate() {
  simulate_button.disabled = true;
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
      value: 50
    }
  };
  var searchEvtMilk = {
    target: {
      value: "milk"
    }
  };
  var searchEvtPasta = {
    target: {
      value: "penne pasta"
    }
  };
  var searchEvtBlank = {
    target: {
      value: ""
    }
  };

  budgetInput.value = "50";
  onBudgetChange(budgetEvt);
  await sleep(500);
  mobileInput.value = "cheese";
  await sleep(1000);
  mobileInputBtn.click();
  await sleep(1000);
  searchInput.value = "milk"
  await sleep(500);
  search(searchEvtMilk);
  var milkAddBtn = document.getElementById("Almond Milk-milk");
  await sleep(1000);
  milkAddBtn.click();
  await sleep(1000);
  listCollapsible.click();
  await sleep(1000);
  listInput.value = "chicken";
  await sleep(500);
  listInputBtn.click();
  await sleep(500);
  // listInput.value = "pasta";
  // await sleep(500);
  // listInputBtn.click();
  await sleep(1000);
  search(searchEvtBlank);
  searchInput.value = "penne pasta"
  await sleep(500);
  search(searchEvtPasta);
  var pastaAddBtn = document.getElementById("Penne Pasta-pasta");
  await sleep(1000);
  pastaAddBtn.click();
  await sleep(2000);
  listViewMapBtn.click();

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
reset_button.addEventListener('click', reset);
add_button.addEventListener('click', mockAddToCart);

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

async function draw(sliderValue) {
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
        
        document.getElementById("cartCollapsible").click();
        document.getElementById("cartTabMobile").click();
        mockAddToCart();
        await sleep(3000);
        document.getElementById("homeTab").click();
        await sleep(500);
        document.getElementById("couponCollapsible").click();
        await sleep(2000);
        document.getElementById("BOGO 50% off cheese-couponContent").click();
        await sleep(2000);
        document.getElementById("plus 0").click();
        await sleep(2000);
        document.getElementById("mapTab").click();
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
        mockAddToCart();
        await sleep(1000);
        document.getElementById("couponTabMobile").click();
        await sleep(1000);
        document.getElementById("aisleNumCheck").click();
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
        mockAddToCart();
        await sleep(1000);
        document.getElementById("checkoutTab").click();
        await sleep(2000);
        document.getElementById("$2 off chicken-couponContentCheck").click();
        await sleep(1000);
        document.getElementById("Missing Items").click();
        await sleep(2000);
        document.getElementById("detailsClose").click();
        await sleep(2000);
        document.getElementById("plus 2").click();
        await sleep(500);
        document.getElementById("plus 2").click();
        await sleep(2000);
        document.getElementById("mapTab").click();
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
        mockAddToCart();
        await sleep(1000);
        document.getElementById("homeTab").click();
        await sleep(2000);
        document.getElementById("Buy 2 get 1 free Pasta-couponContentMobile").click();
        await sleep(2000);
        document.getElementById("plus 3").click();
        document.getElementById("plus 3").click();
        await sleep(2000);
        document.getElementById("mapTab").click();
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
      if(checkout)
      {
        checkout = false;
        routeCtx.clearRect(0, 0, routeCanvas.width, routeCanvas.height);
        document.getElementById("checkoutTab").click();
        await sleep(1000);
        document.getElementById("Over Budget").click();
        await sleep(2000);
        document.getElementById("detailsClose").click();
        await sleep(2000);
        document.getElementById("minus 2").click();
        await sleep(2000);
        document.getElementById("payBtn").click();
        await sleep(2000);
        document.getElementById("pin").value = "1234";
        await sleep(1000);
        document.getElementById("submitBtn").click();
        await sleep(2000);
        document.getElementById("logoutBtn").click();
      }
    }
  drawDot(xy);

}