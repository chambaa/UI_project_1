# User Interface Project 1
## Smart Shopping Cart Interface
[Project Write-Up](https://chambersanna99.wixsite.com/ui-portfolio/projects-7)

### Description
For this project, I created an interface for a smart shopping cart. Although this interface is not physically implemented it is designed to be a tablet mounted to the front of a shopping cart to assist users with their grocery shopping experience. The main design requirements for this interface were determined by a series of interviews that sought to identify what users would find helpful and what they didn't currently like about their shopping experience. The main requirements identified were access to a store map, assistance finding items, shop-as-you-go, dynamically showing relevant coupons, and budget tracking.

I created two interfaces to achieve these goals. The primary interface, which is intended to be mounted to the front of the shopping cart, consists of three tabs: Home, Map, and Checkout. The Home tab has a search bar that allows the user to search for items, determine what aisle it is in, and add them to their list. When an item is added to the user's list it is plotted for them on the Map tab. The Home screen also has a budget tracker. The user can set their budget and a scale will raise as their total increases to show how much they have left. Also on the Home screen, three collapsible components show the user's cart, list, and coupons based on the aisle they are in. The Map tab plots the items that are on the user's list and shows a recommended path and current location. The Checkout screen shows the items in the cart, coupons for their current items, and any applicable warnings. The user can also pay directly from the checkout tab achieving the shop-as-you-go functionality. The secondary interface is intended to be a mobile app that is connected to the primary interface. On the secondary device, the user can create a shopping list, see relevant coupons, and cart. All of the things done on the secondary device automatically update the primary device, and vice-versa.

### Steps for running locally
* Install Node.JS if you do not already have it.
  * [link to download installer](https://nodejs.org/en/download/)
* Download code as Zip.
* Extract files.
* Navigate to code directory in terminal.
  * `cd Downloads/UI_project_1`
* run `npm start`
* In a browser navigate to: `http://localhost:8080/index.html`

### Tips for interacting with the mock device
* This interface is not connected to a real database, but a mock database was created as a proof of concept. The items in the mock database are:
  * Cheese
  * Milk
  * Chicken
  * Bread
* You can search for any of these items (or variations) and add them to the list.
* Once you add items to your list you can click the "Add to Cart" button and it will add the next item on your list to your cart and update the interface as though you had walked to that item.
* There is also a "Simulate" button that will walk through an entire mock shopping trip.
