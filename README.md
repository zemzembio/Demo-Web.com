# PRERJA Barber Club — website demo for NEXXA WEB

A responsive one-page barbershop website in Albanian (Kosovo), built with:
- HTML5
- CSS3
- Vanilla JavaScript
- jQuery 3.7.1

## Run it

Open `index.html` in a browser. An internet connection is required for Google Fonts, jQuery CDN and the remote Unsplash photography used by the demo.

For local development, use VS Code with the Live Server extension if available.

## What works

- Responsive desktop/mobile layout and navigation
- Smooth anchor navigation
- Scroll reveal animations with reduced-motion support
- Service/pricing section
- Gallery category filters
- Click-to-zoom gallery lightbox
- Appointment form validation
- Date picker prevents selecting a past date
- Booking message generation for WhatsApp once a real business number is configured
- Dynamic copyright year

## Enable real WhatsApp booking

1. Open `script.js`.
2. Find `const WHATSAPP_NUMBER = "";` near the top.
3. Put the business WhatsApp number in international format, digits only. For example, Kosovo numbers start with `383`. Do not include `+`, spaces or brackets.
4. Save and test the form. It will open WhatsApp with a prefilled message. The visitor still needs to press Send, and the business must confirm the appointment.

Leave the number empty while using this as a fictional demo. The form will validate inputs and show a demo-mode message instead of contacting a real person.

## Replace before using for a real client

- `PRERJA Barber Club` brand name and logo
- Address, map destination, phone and business hours
- Service names, prices and appointment times
- Team names and photography (current team details are fictional)
- Gallery photos and alt text
- Meta description and page title
- WhatsApp number in `script.js`
- Verify all images and licenses/permissions before production

## Image and hosting note

The demo references photography hosted on Unsplash. For a client handover, use the business's own approved photos or download properly licensed assets and store them locally in an `assets/` folder. A custom domain is not required to preview or publish the demo on a free static host.

## Suggested free hosting

GitHub Pages can host this static site. Create a repository, upload the files and folders preserving their structure, then enable Pages in repository settings.

## Important

This is a demonstration website. It does not connect to a booking database or calendar, and it cannot verify appointment availability. A WhatsApp request is not a confirmed booking until the business responds.
