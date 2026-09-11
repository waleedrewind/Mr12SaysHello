# PPC Practice Lab

A beginner-friendly static website for practicing Google Tag Manager (GTM) and Google Analytics 4 (GA4) events. It contains lead-generation forms and a small test store with a simulated cart and checkout. No framework, build process, backend, payments, or login are used.

## Run locally

Open `index.html` in a modern browser. For the most browser-like local testing, use a simple static-server extension in your code editor.

## Deploy to Netlify

1. Log into Netlify and choose **Add new site** → **Deploy manually**.
2. Drag this project folder (the folder containing `index.html`) into the upload area.
3. No build command or settings are required. Netlify will publish it as a static site.

## Add your GTM container

At the top of `index.html`, find the clearly marked `Google Tag Manager` comment block. Paste your GTM container snippet there. The site intentionally does not include a container ID.

## Available dataLayer events

| Event | Trigger |
| --- | --- |
| `form_submit` | Successful contact form submission |
| `newsletter_signup` | Successful newsletter signup |
| `view_item` | **View Product** click |
| `add_to_cart` | **Add to Cart** click |
| `view_cart` | **View Cart** click |
| `begin_checkout` | **Checkout** click |
| `purchase` | **Place Test Order** click |

Ecommerce events include a GA4-style `ecommerce` object with currency, value, and items. Events are also logged to the browser console.

## Test with GTM Preview / Tag Assistant

1. Add your GTM container code, deploy the site, and publish/save your GTM workspace as appropriate.
2. In GTM, click **Preview**, enter the deployed Netlify URL, and connect Tag Assistant.
3. Use the forms and ecommerce controls. Each action appears in Tag Assistant's event timeline and in the browser console as `dataLayer event`.
4. Create Custom Event triggers in GTM using the event names above, then attach GA4 Event tags to practice sending them to GA4.
