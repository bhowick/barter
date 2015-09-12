//TABLE CREATION CODES

//$ = Primary Key

/*=======================================================================================
ADMINISTRATORS (administrators)
The users designated as admins
[adminID | userID]
=======================================================================================*/
$[adminID]: The admin's ID number. Not a userID. Unique, auto-generated. (INTEGER)
[userID]: The admin's userID. Unique. (INTEGER)


/*=======================================================================================
CATEGORIES (categories)
Information about item shop categories
[categoryID | name | img]
=======================================================================================*/
$[categoryID]: The category's ID number. Unique, auto-generated. (INTEGER)
[name]: The category's name (e.g. "Collectibles") (VARCHAR)
[img]: The URL of a thumbnail image associated with the category, if any. (VARCHAR)


/*=======================================================================================
ITEM FUNCTIONS (itemFunctions)
Names of item functions
[functionID | name]
=======================================================================================*/
$[functionID]: The function's ID number. Unique, auto-generated. (INTEGER)
[name]: The function's name (e.g. "Useless", "Change User's Name Color") (VARCHAR)


/*=======================================================================================
ITEMS (items)
Properties of all unique types of items
[itemID | name | desc | img | rarityID | categoryID | functionID | maxStack | canTrade]
=======================================================================================*/
$[itemID]: The item's ID number. Unique, auto-generated. (INTEGER)
[name]: The item's name (e.g. "Card Pack", "Dispenser Dispenser", "The Game"). (VARCHAR)
[desc]: The item's description (e.g. "Mysterious, but evidently does nothing."). (TEXT)
[img]: The URL of an image associated with the item. (VARCHAR)
[rarityID]: The ID of the item's rarity. (INTEGER)
[categoryID]: The ID of the item's category listing in the server shop. (INTEGER)
[functionID]: The ID of the item's associated function. (INTEGER)
[maxStack]: The maximum stack of the item allowed in a user's inventory. (INTEGER)
[canTrade]: Can the item be traded between users? (Yes: true || No: false) (BOOLEAN)


/*=======================================================================================
RANKS (ranks)
Information about user ranks
[rankID | name | color]
=======================================================================================*/
$[rankID]: The rank's ID number. Unique, auto-generated. (INTEGER)
[name]: The rank's name (e.g. "Administrator", "Newbie"). (VARCHAR)
[color]: The rank's associated color. Must be a CSS color (hex or otherwise). (VARCHAR)


/*=======================================================================================
RARITIES (rarities)
Information about item rarities
[rarityID | name | color]
=======================================================================================*/
$[rarityID]: The rarity's ID number. Unique, auto-generated. (INTEGER)
[name]: The rarity's name (e.g. "Common", "Rare", "Vendor Trash", "Epic"). (VARCHAR)
[color]: The rarity's associated color. Must be a CSS color (hex or otherwise). (VARCHAR)


/*=======================================================================================
SHOP COSTS (shopCosts)
Information about the costs of shop items (when they cost other items, not only currency)
[itemID | costID | quantity]
=======================================================================================*/
[itemID]: The ID of the item up for sale in the shop. (INTEGER)
[costID]: The ID of an item used as payment for the one for sale. (INTEGER)
[quantity]: The quantity of the above item being used as payment. (INTEGER)
//NOTE: This table can contain duplicate rows of the same item ID.
//EXAMPLE
//[10 | 1 | 7]
//[10 | 3 | 6]
//Item#10 costs [Item#1]x7 and [Item#3]x6.


/*=======================================================================================
SHOP STOCK (shopStock)
Information about the items stocked in the server's shop
[stockID | itemID | quantity | balCost | costsItems]
=======================================================================================*/
$[stockID]: The stock ID of the item being sold. Unique, auto-generated. (INTEGER)
[itemID]: The item ID of the item being sold. (INTEGER)
[quantity]: The remaining stock of the item being sold. NULL if infinite stock. (INTEGER)
[balCost]: The amount of currency the item costs. (INTEGER)
[costsItems]: Does the item cost other items? (Yes: true || No: false) (BOOLEAN)
//NOTE: CostsItems will determine whether or not we run a query on the shopCosts table.


/*=======================================================================================
TRANSACTIONS (transactions)
Records of all of the server's shop transactions
[transactionID | userID | itemIDsBought | quantitiesBought | balPaid | itemIDsPaid | quantitiesPaid | time]
=======================================================================================*/
$[transactionID]: The ID of the transaction. Unique, auto-generated. (INTEGER)
[userID]: The ID of the user that bought the item(s). (INTEGER)
[itemIDsBought]: The IDs of the items bought by the user. (e.g. "[1,2]") (VARCHAR)
[quantitiesBought]: The amounts of the items bought by the user. (e.g. "[10,20]") (VARCHAR)
[balPaid]: The amount of currency paid by the user. (INTEGER)
[itemIDsPaid]: The IDs of the items paid by the user. (e.g. ["3,4"]) (VARCHAR)
[quantitiesPaid]: The amounts of the items paid by the user. (e.g. ["10,10"]) (VARCHAR)
[time]: The time at which the transaction occurred. (INTEGER)


/*=======================================================================================
USER INVENTORIES (userInventories)
Contents of users' inventories
[instanceID | userID | itemID | quantity]
=======================================================================================*/
$[instanceID]: The instance ID of the inventory entry. Unique, auto-generated. (INTEGER)
[userID]: The ID of the user that owns the item(s). (INTEGER)
[itemID]: The ID of one of the owned items. (INTEGER)
[quantity]: The amount of the item owned by the user. (INTEGER)
//NOTE: This table can contain duplicate rows of the same userID. 
//EXAMPLE
//[1 1 6]
//[1 2 9]
//[1 3 4]
//The user (userID #1) has [itemID#1]x6, [itemID#2]x9, and [itemID#3]x4.


/*=======================================================================================
USERS (users)
Information about all individual users
[userID | name | pass | rankID | balance | salt | timeCreated | lastLogin | isAdmin]
=======================================================================================*/
$[userID]: The ID of the user. Unique, auto-generated. (INTEGER)
[name]: The user's name. Unique. (VARCHAR)
[pass]: A hash of the user's password. (VARCHAR)
[rankID]: The ID of the user's rank. (INTEGER)
[balance]: The amount of server currency the user possesses. (INTEGER)
[salt]: Salt. Literally random nonsense. (VARCHAR)
[timeCreated]: The timestamp of when the account was created. (INTEGER)
[lastLogin]: The timestamp of when the account last logged into the server. (INTEGER)
[isAdmin]: Whether or not the user is an admin. (BOOL)

