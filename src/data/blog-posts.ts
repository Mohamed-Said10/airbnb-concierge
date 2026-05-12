import { BlogPost } from '@/types/blog';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Airbnb Regulations in Morocco: What Every Host Must Know',
    description: 'A complete guide to Moroccan tourism law, the fiche de police obligation, and how to stay compliant while welcoming international guests.',
    content: `
      Morocco's short-term rental market is booming — but operating legally requires understanding a set of regulations that many hosts overlook.

      1. The Fiche de Police Obligation
      Under Dahir n° 1-02-176, every property owner hosting guests must collect and retain a signed fiche de police for each guest. This document records the guest's identity information from their national ID or passport and must be kept for inspection by authorities...

      2. Tourist Tax (Taxe de Séjour)
      Moroccan municipalities levy a tourist tax per night per guest. Rates vary by city — Marrakech, Agadir, and Casablanca each have their own schedules. As the host, you are responsible for collecting and remitting this tax...

      3. Listing Registration
      Since 2023, short-term rental platforms must verify that listed properties comply with local zoning rules. Ensure your property is registered with the local municipality before listing...

      4. Insurance Requirements
      Standard home insurance policies often exclude short-term rental activity. You will need a specific "location meublée touristique" endorsement or a standalone policy...

      5. How KoziBnB Helps
      Our platform automates the fiche de police collection process digitally — guests fill in their information, upload their ID, and sign electronically before check-in, keeping you fully compliant without paperwork.
    `,
    author: {
      name: 'Youssef Benali',
      role: 'Founder & CEO',
      image: '/team/youssef.jpeg'
    },
    publishedAt: '2025-03-15',
    readTime: '8 min read',
    category: 'Legal & Compliance',
    image: '/blog/morocco-regulations.jpeg',
    slug: 'maximizing-your-airbnb-revenue-10-pro-tips'
  },
  {
    id: '2',
    title: 'Creating a 5-Star Guest Experience in Morocco',
    description: 'How to blend authentic Moroccan hospitality with modern guest expectations to earn consistent five-star reviews.',
    content: `
      Moroccan hospitality — known as "l'hospitalité marocaine" — is renowned worldwide. Here's how to channel that tradition into a five-star short-term rental experience.

      1. The Welcome Ritual
      A small welcome basket with Moroccan mint tea, dates, and msemen sets an immediate tone. International guests especially appreciate this cultural introduction. Budget: under 50 MAD per stay...

      2. Clear Arrival Instructions
      Many Moroccan medinas have unmarked streets and no vehicle access. Provide a detailed written guide with landmarks, GPS coordinates, and a WhatsApp number for real-time guidance...

      3. Local Recommendations
      Curate a neighbourhood guide: the best derb bakery, the hammam that won't overcharge tourists, the souk stall with honest prices. Authentic recommendations build trust and generate reviews...

      4. Language Considerations
      With guests arriving from France, Spain, the Gulf, and North America, multilingual communication matters. Automated messages in French, English, and Arabic cover the vast majority of KoziBnB guests...

      5. Managing Checkout
      Moroccan checkout customs differ from European ones. Clear communication about key handover, parking, and luggage storage prevents last-minute friction...
    `,
    author: {
      name: 'Karim Tazi',
      role: 'Guest Relations Manager',
      image: '/team/karim.jpeg'
    },
    publishedAt: '2025-02-28',
    readTime: '6 min read',
    category: 'Guest Experience',
    image: '/blog/guest-experience.jpeg',
    slug: 'creating-the-perfect-guest-experience'
  },
  {
    id: '3',
    title: 'Seasonal Pricing Strategy for Moroccan Properties',
    description: 'How to price your listing across Ramadan, Eid, summer heat, and the winter European exodus to maximise annual revenue.',
    content: `
      Morocco has a unique seasonal demand curve unlike any other market. Getting your pricing right can increase annual revenue by 30–40%.

      1. The European Winter Migration (November–March)
      Marrakech and Agadir fill up with European retirees and remote workers escaping cold winters. This is premium season — rates can be 2–3× the summer baseline...

      2. Ramadan Dynamics
      During Ramadan, domestic travel picks up significantly, especially for family gatherings. Adjust your minimum stay and cleaning schedule to accommodate shorter bookings at slightly reduced rates...

      3. Eid Al-Adha & Eid Al-Fitr
      Both Eids generate massive domestic travel demand. Book out 6–8 weeks in advance at a 40–60% premium. Require a 3-night minimum to avoid single-night operational costs...

      4. Summer Strategy (July–August)
      Coastal properties (Essaouira, Agadir, Al Hoceima) command summer premiums. Inland cities like Marrakech and Fès see a dip — compensate with weekly rates targeting long-stay guests...

      5. Dynamic Pricing Tools
      KoziBnB's revenue optimisation service uses local event calendars, competitor analysis, and occupancy forecasts to adjust your rates automatically...
    `,
    author: {
      name: 'Fatima Zahra Idrissi',
      role: 'Operations Director',
      image: '/team/fatima.jpeg'
    },
    publishedAt: '2025-02-10',
    readTime: '7 min read',
    category: 'Revenue Optimization',
    image: '/blog/cleaning-maintenance.jpeg',
    slug: 'essential-cleaning-and-maintenance-tips'
  }
];
