# Shopify Cellardirect App

This project is an integrated Shopify app to be used on the Cellardirect Shopify store.

### The Problem:

Cellardirect is a wine importer and seller in Canada. They sell their wines through weekly offers, but ship only during peak weather conditions ensuring their wines temperature and quality.

Cellardirect offers shipping based on a per case model. If a customer purchases 3 bottles, they are charged for a full case of shipping (12 bottles), and the package is shipped at a later date. 

If the same customer comes at a later date to purchase wines from a separate offer they are currently charged a new shipping fee.

A separate issue is that the cost to ship multiple cases to the same customer is less per case than a single case.

Also any customer that buys 12 bottles (1 full case) of a single wine will be given free shipping on that case.

### The Solution:

After the Shopify Cellardirect App has been installed, customers shipping is based on past purchases. Shipping is now based on a tiered system. If they have purchased 5 bottles (Tier 1 shipping) they will be initially charged a full shipping cost, any subsequent purchases up to 12 bottles will include free shipping.

The tiered shipping system charges different amounts based on how many cases are being shipped.

Any purchases that contain 12 of the same bottle are ignored by the system and given free shipping.

The admins of the store are given access to the full app, and are able to delete customers resetting their shipping, this is done when the shipments go out. Admins can also set the tiered shipping amounts for each province.

# Main Technologies Used:

### Client

* react
* react-router
* @shopify/polaris
* react-s-alert
* react-redux

### Server

* express
* shopify-express
* shopify-api-node
* pg
* knex

# Snap Shots

!["Shipping Calculator"](https://media.giphy.com/media/9Pk8K5yC4DvkNNbLrM/giphy.gif)

!["Customer List"](https://media.giphy.com/media/ljH3nnZmZtCGCkpDku/giphy.gif)

!["Shipping Rates"](https://media.giphy.com/media/uiZ4fX434bcu2Y2H8k/giphy.gif)

# Installation

Clone this repo

```yarn install```

In the repo folder start a local tunnel using ngrok
``` ./ngrok http 3000```

create new database named: cellardirect_node

Create a new app through the Shopify Developer program.

rename .env.example .env

Copy this new apps API key and API secret into the .env file.

Copy the ngrok forwarding https into the .env file as the APP_HOST

In the Shopify developer Program App set the App URL to {ngrok https}, and the Whitelisted Redirection URL(s) to {ngrok https}/shopify/auth/callback

In the project folder ```yarn start```

In the server folder run ```knex migrate:latest``` & ```knex seed:run```

Visit the ngrok https url, install the app onto your shopify site or shopify developer site.