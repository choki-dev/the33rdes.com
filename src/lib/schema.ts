import { getImage } from 'astro:assets';
import { experiences, rooms, site, stats } from '../data/site';
import { img } from './images';
import { assetUrl, experiencePath, pageUrl, roomPath } from './urls';

// Built once per build, not per page.
export const shareSize = { width: 1200, format: 'jpg', quality: 80 } as const;
export const defaultShareImage = assetUrl((await getImage({ src: img('valley-1'), ...shareSize })).src);

/** "2:00 PM" → "14:00", as schema.org times expect. */
const to24h = (time: string) => {
  const [, h, m, pm] = time.match(/(\d+):(\d+)\s*(PM)?/i)!;
  return `${String((Number(h) % 12) + (pm ? 12 : 0)).padStart(2, '0')}:${m}`;
};

export const hotelId = `${site.url}/#hotel`;

/** The hotel in full: shown on the home page; other pages point at it by @id. */
export const hotel = {
  '@type': 'Hotel',
  '@id': hotelId,
  name: site.name,
  alternateName: site.shortName,
  description: site.description,
  slogan: site.tagline,
  url: pageUrl('/'),
  telephone: site.phone,
  email: site.email,
  image: defaultShareImage,
  logo: assetUrl('/favicon.png'),
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: 'Thimphu',
    postalCode: site.address.postalCode,
    addressCountry: 'BT',
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  hasMap: site.mapUrl,
  areaServed: { '@type': 'City', name: 'Thimphu' },
  checkinTime: to24h(site.checkIn),
  checkoutTime: to24h(site.checkOut),
  numberOfRooms: Number(stats[0].value),
  servesCuisine: ['Vegetarian', 'Vegan', 'Bhutanese'],
  amenityFeature: ['Spa', 'Rooftop bar', 'Restaurant', 'Vegetarian restaurant', 'Fitness centre', 'Free Wi-Fi', 'Free parking', 'Meeting room', '24-hour room service', 'Airport transfer'].map((name) => ({
    '@type': 'LocationFeatureSpecification',
    name,
    value: true,
  })),
  containsPlace: [
    ...rooms.map((r) => ({
      '@type': 'HotelRoom',
      name: r.name,
      url: pageUrl(roomPath(r.slug)),
      description: r.description,
      occupancy: { '@type': 'QuantitativeValue', maxValue: r.capacity },
      bed: r.bed,
    })),
    ...experiences.map((x) => ({ '@type': 'Place', name: x.name, description: x.kind, url: pageUrl(experiencePath(x.slug)) })),
  ],
  sameAs: Object.values(site.social),
};

/** What other pages carry: enough to name the hotel, linked to the full node on the home page. */
export const hotelRef = { '@type': 'Hotel', '@id': hotelId, name: site.name, url: pageUrl('/') };
