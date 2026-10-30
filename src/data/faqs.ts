import { site } from './site';

// Shown on the Contact page, marked up as FAQPage and listed in /llms.txt so search and AI answers quote them.
export const faqs = [
  {
    q: `Where is ${site.name}?`,
    a: `We are on ${site.address.full}, in Babesa on the southern side of Thimphu, Bhutan’s capital — on the road in from Paro International Airport.`,
  },
  {
    q: 'What are the check-in and check-out times?',
    a: `Check-in is from ${site.checkIn} and check-out is by ${site.checkOut}. Late check-out can be requested when you book, subject to availability.`,
  },
  {
    q: 'Is the hotel vegetarian?',
    a: `Yes. ${site.name} is one of Bhutan’s only 100% vegetarian and vegan-friendly hotels. Breakfast, the Artisan’s Table restaurant, Private Dining, Salts Rooftop Bar and Sugar Box Café all serve vegetarian food.`,
  },
  {
    q: 'Do you offer airport transfers from Paro?',
    a: 'Yes. A private chauffeured transfer between Paro International Airport and the hotel can be added when you book.',
  },
  {
    q: 'What is included in every room?',
    a: 'Rooms have a rain shower, high-speed Wi-Fi, a smart TV, a minibar, tea and coffee facilities and 24-hour room service, and most have a mini kitchen and microwave. The Valley and Executive Suites also have a bathtub. Every room can be booked with or without our daily vegetarian breakfast, and fitness centre access is included in your stay.',
  },
  {
    q: 'How do I book and see the rates?',
    a: `Choose your dates and room on our website and send a booking request — our reservations team replies with availability and the best available rate. You can also call or WhatsApp ${site.phone} or email ${site.email}.`,
  },
  {
    q: 'Does the hotel have a spa and a rooftop bar?',
    a: 'Yes. Om Spa offers massages with steam and sauna, and Salts Rooftop Bar on the seventh floor is open daily from 10:00 AM to midnight with views over the valley.',
  },
];
