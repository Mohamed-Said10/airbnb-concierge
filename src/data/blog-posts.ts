import { BlogPost } from '@/types/blog';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Airbnb Regulations in Morocco: What Every Host Must Know',
    titleFr: 'Réglementation Airbnb au Maroc : ce que tout hôte doit savoir',
    description: 'A complete guide to Moroccan tourism law, the fiche de police obligation, and how to stay compliant while welcoming international guests.',
    descriptionFr: 'Un guide complet de la loi touristique marocaine, de l\'obligation de fiche de police, et comment rester conforme tout en accueillant des invités internationaux.',
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
    contentFr: `
      Le marché de la location de courte durée au Maroc est en plein essor — mais opérer légalement exige de comprendre un ensemble de réglementations que beaucoup d'hôtes négligent.

      1. L'obligation de fiche de police
      En vertu du Dahir n° 1-02-176, tout propriétaire accueillant des invités doit recueillir et conserver une fiche de police signée pour chaque invité. Ce document enregistre les informations d'identité de l'invité à partir de sa carte d'identité nationale ou de son passeport, et doit être conservé pour inspection par les autorités...

      2. Taxe de séjour
      Les municipalités marocaines prélèvent une taxe de séjour par nuit et par invité. Les tarifs varient selon la ville — Marrakech, Agadir et Casablanca ont chacune leur propre barème. En tant qu'hôte, vous êtes responsable de la collecte et du reversement de cette taxe...

      3. Enregistrement de l'annonce
      Depuis 2023, les plateformes de location de courte durée doivent vérifier que les propriétés listées respectent les règles d'urbanisme locales. Assurez-vous que votre propriété est enregistrée auprès de la municipalité avant de la publier...

      4. Exigences d'assurance
      Les polices d'assurance habitation standard excluent souvent l'activité de location de courte durée. Vous aurez besoin d'un avenant spécifique « location meublée touristique » ou d'une police autonome...

      5. Comment KoziBnB vous aide
      Notre plateforme automatise numériquement le processus de collecte de la fiche de police — les invités renseignent leurs informations, téléversent leur pièce d'identité et signent électroniquement avant l'arrivée, vous gardant pleinement conforme sans paperasse.
    `,
    author: {
      name: 'Youssef Benali',
      role: 'Founder & CEO',
      image: '/team/youssef.jpeg'
    },
    publishedAt: '2025-03-15',
    readTime: '8 min read',
    readTimeFr: '8 min de lecture',
    category: 'Legal & Compliance',
    categoryFr: 'Juridique et conformité',
    image: '/blog/morocco-regulations.jpeg',
    slug: 'maximizing-your-airbnb-revenue-10-pro-tips'
  },
  {
    id: '2',
    title: 'Creating a 5-Star Guest Experience in Morocco',
    titleFr: 'Créer une expérience invité 5 étoiles au Maroc',
    description: 'How to blend authentic Moroccan hospitality with modern guest expectations to earn consistent five-star reviews.',
    descriptionFr: 'Comment allier l\'hospitalité marocaine authentique aux attentes modernes des invités pour obtenir des avis cinq étoiles constants.',
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
    contentFr: `
      L'hospitalité marocaine — connue sous le nom de « l'hospitalité marocaine » — est réputée dans le monde entier. Voici comment transformer cette tradition en une expérience de location de courte durée cinq étoiles.

      1. Le rituel de bienvenue
      Un petit panier de bienvenue avec du thé à la menthe marocain, des dattes et du msemen donne immédiatement le ton. Les invités internationaux apprécient particulièrement cette introduction culturelle. Budget : moins de 50 MAD par séjour...

      2. Des instructions d'arrivée claires
      De nombreuses médinas marocaines ont des rues non signalées et sans accès véhicule. Fournissez un guide écrit détaillé avec des points de repère, des coordonnées GPS et un numéro WhatsApp pour un accompagnement en temps réel...

      3. Recommandations locales
      Élaborez un guide de quartier : la meilleure boulangerie du derb, le hammam qui ne surfacture pas les touristes, l'échoppe du souk aux prix honnêtes. Des recommandations authentiques renforcent la confiance et génèrent des avis...

      4. Considérations linguistiques
      Avec des invités venant de France, d'Espagne, du Golfe et d'Amérique du Nord, la communication multilingue est essentielle. Des messages automatisés en français, anglais et arabe couvrent la grande majorité des invités de KoziBnB...

      5. Gérer le départ
      Les usages de départ marocains diffèrent des usages européens. Une communication claire sur la remise des clés, le stationnement et la consigne des bagages évite les frictions de dernière minute...
    `,
    author: {
      name: 'Karim Tazi',
      role: 'Guest Relations Manager',
      image: '/team/karim.jpeg'
    },
    publishedAt: '2025-02-28',
    readTime: '6 min read',
    readTimeFr: '6 min de lecture',
    category: 'Guest Experience',
    categoryFr: 'Expérience invité',
    image: '/blog/guest-experience.jpeg',
    slug: 'creating-the-perfect-guest-experience'
  },
  {
    id: '3',
    title: 'Seasonal Pricing Strategy for Moroccan Properties',
    titleFr: 'Stratégie de tarification saisonnière pour les propriétés marocaines',
    description: 'How to price your listing across Ramadan, Eid, summer heat, and the winter European exodus to maximise annual revenue.',
    descriptionFr: 'Comment tarifer votre annonce pendant le Ramadan, l\'Aïd, la chaleur estivale et l\'exode hivernal européen pour maximiser vos revenus annuels.',
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
    contentFr: `
      Le Maroc présente une courbe de demande saisonnière unique, différente de tout autre marché. Bien ajuster vos tarifs peut augmenter vos revenus annuels de 30 à 40 %.

      1. La migration hivernale européenne (novembre–mars)
      Marrakech et Agadir se remplissent de retraités européens et de travailleurs à distance fuyant les hivers froids. C'est la haute saison — les tarifs peuvent être 2 à 3 fois plus élevés que la base estivale...

      2. Dynamique du Ramadan
      Pendant le Ramadan, les voyages domestiques augmentent significativement, notamment pour les réunions familiales. Ajustez votre séjour minimum et votre calendrier de ménage pour accueillir des réservations plus courtes à des tarifs légèrement réduits...

      3. Aïd al-Adha et Aïd al-Fitr
      Les deux Aïds génèrent une demande de voyage domestique massive. Les réservations se font 6 à 8 semaines à l'avance avec une majoration de 40 à 60 %. Exigez un minimum de 3 nuits pour éviter les coûts opérationnels d'une seule nuit...

      4. Stratégie estivale (juillet–août)
      Les propriétés côtières (Essaouira, Agadir, Al Hoceima) bénéficient de tarifs premium en été. Les villes de l'intérieur comme Marrakech et Fès connaissent une baisse — compensez avec des tarifs hebdomadaires ciblant les séjours longs...

      5. Outils de tarification dynamique
      Le service d'optimisation des revenus de KoziBnB utilise les calendriers d'événements locaux, l'analyse de la concurrence et les prévisions d'occupation pour ajuster automatiquement vos tarifs...
    `,
    author: {
      name: 'Fatima Zahra Idrissi',
      role: 'Operations Director',
      image: '/team/fatima.jpeg'
    },
    publishedAt: '2025-02-10',
    readTime: '7 min read',
    readTimeFr: '7 min de lecture',
    category: 'Revenue Optimization',
    categoryFr: 'Optimisation des revenus',
    image: '/blog/cleaning-maintenance.jpeg',
    slug: 'essential-cleaning-and-maintenance-tips'
  }
];
