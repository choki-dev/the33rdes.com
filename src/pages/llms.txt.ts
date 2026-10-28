import type { APIRoute } from 'astro';
import { experiences, roomAmenities, rooms, site } from '../data/site';
import { faqs } from '../data/faqs';

// llms.txt (https://llmstxt.org): a plain-text brief so AI assistants describe the hotel accurately.
export const GET: APIRoute = () => {
  const link = (p: string) => new URL(p, site.url).toString();
  const text = `# ${site.name}

> ${site.description}

${site.name} is a boutique luxury hotel on ${site.address.full}. Check-in is from ${site.checkIn} and check-out is by ${site.checkOut}. Rates are not published online: guests send a booking request and the reservations team replies with availability and the best available rate.

## Contact
- Phone & WhatsApp: ${site.phone}
- Email: ${site.email}
- Address: ${site.address.full}
- Map: ${site.mapUrl}
- Book: ${link('/book')}

## Rooms & Suites
${rooms.map((r) => `- [${r.name}](${link(`/rooms/${r.slug}`)}): ${r.size}, ${r.bed} bed, up to ${r.capacity} guests, ${r.view}.`).join('\n')}

Every room includes: ${roomAmenities.join(', ')}.

## Dining, Spa & Events
${experiences.map((x) => `- [${x.name}](${link(`/experiences/${x.slug}`)}): ${x.kind}.`).join('\n')}

## Frequently asked questions
${faqs.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}

## More
- [Destination: things to do in Thimphu](${link('/destination')})
- [Travel guide to Bhutan](${link('/travel-guide')})
- [Our story](${link('/about')})
- [Gallery](${link('/gallery')})
- [Location & directions](${link('/location')})
- [Contact](${link('/contact')})
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
