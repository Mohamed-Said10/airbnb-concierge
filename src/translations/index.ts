export type Language = 'en' | 'fr';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      about: 'About',
      blog: 'Blog',
      contact: 'Contact',
      bookNow: 'Book Now',
    },
    hero: {
      welcome: 'Welcome to KoziBnB',
      titleLine1: 'Maximize Your',
      titleLine2: 'Airbnb Potential',
      description:
        'Let us handle everything from guest communication to cleaning services, while you enjoy passive income from your property. Professional management services tailored to your needs.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
    },
    featuredServices: {
      label: 'Services',
      heading: 'Everything you need for successful hosting',
      subheading:
        'We handle all aspects of your Airbnb property management, so you can enjoy passive income without the hassle.',
      items: [
        {
          title: 'Property Management',
          description:
            'Complete management of your Airbnb property, from listing optimization to maintenance coordination.',
        },
        {
          title: 'Guest Communication',
          description:
            '24/7 guest support and communication, ensuring prompt responses and happy guests.',
        },
        {
          title: 'Cleaning Services',
          description:
            'Professional cleaning and turnover services between guest stays to maintain high standards.',
        },
        {
          title: 'Revenue Optimization',
          description:
            "Dynamic pricing and optimization strategies to maximize your property's earning potential.",
        },
      ],
    },
    footer: {
      description:
        "Professional Airbnb management services to help you maximize your property's potential while providing exceptional guest experiences.",
      navigation: 'Navigation',
      followUs: 'Follow Us',
      rights: 'All rights reserved.',
    },
    services: {
      label: 'Our Services',
      heading: 'Professional Airbnb Management',
      subheading:
        'We offer comprehensive property management services to help you maximize your Airbnb rental income while minimizing your time investment.',
      whyChooseUs: 'Why Choose Us?',
      whyChooseUsText:
        'Our team of experienced professionals handles everything from guest communication to property maintenance, allowing you to earn passive income without the hassle of day-to-day management.',
      getStartedToday: 'Get Started Today',
      faq: {
        heading: 'Frequently Asked Questions',
        items: [
          {
            question: 'What percentage of rental income do you charge?',
            answer:
              "Our fees are competitive and based on your property's location and requirements. Contact us for a personalized quote.",
          },
          {
            question: 'How do you handle maintenance issues?',
            answer:
              "We have a network of trusted contractors and handle all maintenance issues promptly. We'll notify you of any major repairs needed.",
          },
          {
            question: 'Can I still use my property occasionally?',
            answer:
              'Yes! You can block off dates for personal use through our management system anytime.',
          },
          {
            question: 'How do you screen guests?',
            answer:
              "We use Airbnb's verification system and our own screening process to ensure quality guests for your property.",
          },
        ],
      },
      items: [
        {
          title: 'Full Property Management',
          description: 'End-to-end management of your Airbnb property',
          features: [
            'Professional listing creation and optimization',
            'Dynamic pricing strategy',
            '24/7 guest communication',
            'Check-in/check-out management',
            'Professional cleaning coordination',
            'Maintenance and repairs handling',
            'Monthly performance reports',
            'Professional photography',
          ],
          cta: 'Get Started',
          highlighted: true,
        },
        {
          title: 'Guest Communication',
          description: 'Professional guest interaction service',
          features: [
            '24/7 guest support',
            'Multilingual communication',
            'Quick response times',
            'Check-in instructions',
            'Local recommendations',
            'Issue resolution',
            'Guest screening',
            'Review management',
          ],
          cta: 'Learn More',
          highlighted: false,
        },
        {
          title: 'Cleaning & Maintenance',
          description: 'Keep your property in perfect condition',
          features: [
            'Professional cleaning service',
            'Quality inspection',
            'Inventory management',
            'Supplies restocking',
            'Maintenance coordination',
            'Emergency repairs',
            'Regular property checks',
            'Damage reporting',
          ],
          cta: 'Contact Us',
          highlighted: false,
        },
      ],
    },
    about: {
      label: 'About Us',
      heading: 'Your Trusted Airbnb Management Partner',
      subheading:
        "We're passionate about helping property owners maximize their Airbnb potential while providing exceptional experiences for guests.",
      mission: 'Our Mission',
      missionText:
        'To revolutionize property management through technology and exceptional service, making Airbnb hosting effortless and profitable for property owners.',
      values: {
        label: 'Our Values',
        heading: 'What Sets Us Apart',
        items: [
          {
            title: 'Excellence in Service',
            description:
              'We maintain the highest standards in property management and guest services.',
          },
          {
            title: 'Innovation',
            description:
              'We leverage technology to streamline operations and enhance guest experiences.',
          },
          {
            title: 'Personal Touch',
            description:
              'We treat each property as if it were our own, ensuring attention to every detail.',
          },
          {
            title: 'Revenue Optimization',
            description:
              "We use data-driven strategies to maximize your property's earning potential.",
          },
        ],
      },
      team: {
        heading: 'Our Team',
        subheading:
          'Meet the experienced professionals dedicated to managing your property and exceeding guest expectations.',
        members: [
          {
            name: 'Sarah Johnson',
            role: 'Founder & CEO',
            bio: '10+ years of experience in property management and hospitality.',
          },
          {
            name: 'Michael Chen',
            role: 'Operations Director',
            bio: 'Expert in streamlining property management operations and guest services.',
          },
          {
            name: 'Emma Rodriguez',
            role: 'Guest Relations Manager',
            bio: 'Specialized in creating exceptional guest experiences and communication.',
          },
          {
            name: 'David Kim',
            role: 'Property Management Specialist',
            bio: 'Experienced in property optimization and maintenance coordination.',
          },
        ],
      },
    },
    contact: {
      label: 'Contact Us',
      heading: "Let's Get Started",
      subheading:
        "Ready to maximize your Airbnb potential? Fill out the form below and we'll get back to you within 24 hours.",
      office: 'Our Office',
      form: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        propertyType: 'Property Type',
        message: 'Message',
        send: 'Send Message',
        propertyTypes: {
          apartment: 'Apartment',
          house: 'House',
          condo: 'Condo',
          villa: 'Villa',
          other: 'Other',
        },
      },
    },
    blog: {
      label: 'Blog & Resources',
      heading: 'Insights for Successful Hosting',
      subheading:
        'Expert tips, industry insights, and best practices to help you succeed in your Airbnb hosting journey.',
      stayUpdated: 'Stay Updated',
      newsletterText:
        'Subscribe to our newsletter for the latest tips and trends in property management and guest experiences.',
      emailPlaceholder: 'Enter your email',
      subscribe: 'Subscribe',
      featuredArticle: 'Featured Article',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      services: 'Services',
      about: 'À propos',
      blog: 'Blog',
      contact: 'Contact',
      bookNow: 'Réserver',
    },
    hero: {
      welcome: 'Bienvenue chez KoziBnB',
      titleLine1: 'Maximisez votre',
      titleLine2: 'potentiel Airbnb',
      description:
        'Laissez-nous gérer tout, de la communication avec les clients aux services de nettoyage, pendant que vous profitez de revenus passifs de votre propriété. Des services de gestion professionnels adaptés à vos besoins.',
      getStarted: 'Commencer',
      learnMore: 'En savoir plus',
    },
    featuredServices: {
      label: 'Services',
      heading: 'Tout ce dont vous avez besoin pour un hébergement réussi',
      subheading:
        'Nous gérons tous les aspects de la gestion de votre propriété Airbnb, pour que vous puissiez profiter de revenus passifs sans les tracas.',
      items: [
        {
          title: 'Gestion immobilière',
          description:
            "Gestion complète de votre propriété Airbnb, de l'optimisation des annonces à la coordination de la maintenance.",
        },
        {
          title: 'Communication clients',
          description:
            'Support et communication 24h/7j, assurant des réponses rapides et des clients satisfaits.',
        },
        {
          title: 'Services de nettoyage',
          description:
            'Services de nettoyage professionnel entre les séjours pour maintenir des standards élevés.',
        },
        {
          title: 'Optimisation des revenus',
          description:
            'Stratégies de tarification dynamique pour maximiser le potentiel de revenus de votre propriété.',
        },
      ],
    },
    footer: {
      description:
        "Services professionnels de gestion Airbnb pour vous aider à maximiser le potentiel de votre propriété tout en offrant des expériences exceptionnelles aux clients.",
      navigation: 'Navigation',
      followUs: 'Suivez-nous',
      rights: 'Tous droits réservés.',
    },
    services: {
      label: 'Nos services',
      heading: 'Gestion Airbnb professionnelle',
      subheading:
        'Nous offrons des services complets de gestion immobilière pour vous aider à maximiser vos revenus locatifs Airbnb tout en minimisant votre investissement en temps.',
      whyChooseUs: 'Pourquoi nous choisir ?',
      whyChooseUsText:
        "Notre équipe de professionnels expérimentés gère tout, de la communication avec les clients à la maintenance des propriétés, vous permettant de gagner des revenus passifs sans les tracas de la gestion quotidienne.",
      getStartedToday: "Commencer aujourd'hui",
      faq: {
        heading: 'Questions fréquemment posées',
        items: [
          {
            question: 'Quel pourcentage des revenus locatifs facturez-vous ?',
            answer:
              "Nos frais sont compétitifs et basés sur l'emplacement et les exigences de votre propriété. Contactez-nous pour un devis personnalisé.",
          },
          {
            question: 'Comment gérez-vous les problèmes de maintenance ?',
            answer:
              "Nous avons un réseau d'entrepreneurs de confiance et traitons tous les problèmes de maintenance rapidement. Nous vous informerons de toute réparation majeure nécessaire.",
          },
          {
            question: 'Puis-je encore utiliser ma propriété occasionnellement ?',
            answer:
              "Oui ! Vous pouvez bloquer des dates pour un usage personnel via notre système de gestion à tout moment.",
          },
          {
            question: 'Comment sélectionnez-vous les clients ?',
            answer:
              "Nous utilisons le système de vérification d'Airbnb et notre propre processus de sélection pour assurer des clients de qualité pour votre propriété.",
          },
        ],
      },
      items: [
        {
          title: 'Gestion complète de propriété',
          description: 'Gestion de bout en bout de votre propriété Airbnb',
          features: [
            'Création et optimisation professionnelle des annonces',
            'Stratégie de tarification dynamique',
            'Communication client 24h/7j',
            'Gestion des arrivées/départs',
            'Coordination professionnelle du nettoyage',
            'Gestion des entretiens et réparations',
            'Rapports de performance mensuels',
            'Photographie professionnelle',
          ],
          cta: 'Commencer',
          highlighted: true,
        },
        {
          title: 'Communication client',
          description: "Service d'interaction professionnelle avec les clients",
          features: [
            'Support client 24h/7j',
            'Communication multilingue',
            'Temps de réponse rapide',
            "Instructions d'enregistrement",
            'Recommandations locales',
            'Résolution des problèmes',
            'Sélection des clients',
            'Gestion des avis',
          ],
          cta: 'En savoir plus',
          highlighted: false,
        },
        {
          title: 'Nettoyage et maintenance',
          description: 'Gardez votre propriété en parfait état',
          features: [
            'Service de nettoyage professionnel',
            'Inspection de qualité',
            'Gestion des stocks',
            'Réapprovisionnement des fournitures',
            'Coordination de la maintenance',
            "Réparations d'urgence",
            'Contrôles réguliers de la propriété',
            'Rapport des dommages',
          ],
          cta: 'Nous contacter',
          highlighted: false,
        },
      ],
    },
    about: {
      label: 'À propos de nous',
      heading: 'Votre partenaire de confiance en gestion Airbnb',
      subheading:
        "Nous sommes passionnés par l'aide aux propriétaires pour maximiser leur potentiel Airbnb tout en offrant des expériences exceptionnelles aux clients.",
      mission: 'Notre mission',
      missionText:
        "Révolutionner la gestion immobilière grâce à la technologie et un service exceptionnel, rendant l'hébergement Airbnb sans effort et rentable pour les propriétaires.",
      values: {
        label: 'Nos valeurs',
        heading: 'Ce qui nous distingue',
        items: [
          {
            title: 'Excellence du service',
            description:
              'Nous maintenons les plus hauts standards dans la gestion immobilière et les services aux clients.',
          },
          {
            title: 'Innovation',
            description:
              'Nous utilisons la technologie pour rationaliser les opérations et améliorer les expériences des clients.',
          },
          {
            title: 'Touche personnelle',
            description:
              "Nous traitons chaque propriété comme si c'était la nôtre, assurant une attention à chaque détail.",
          },
          {
            title: 'Optimisation des revenus',
            description:
              "Nous utilisons des stratégies basées sur les données pour maximiser le potentiel de revenus de votre propriété.",
          },
        ],
      },
      team: {
        heading: 'Notre équipe',
        subheading:
          'Rencontrez les professionnels expérimentés dédiés à la gestion de votre propriété et au dépassement des attentes des clients.',
        members: [
          {
            name: 'Sarah Johnson',
            role: 'Fondatrice & PDG',
            bio: "Plus de 10 ans d'expérience dans la gestion immobilière et l'hôtellerie.",
          },
          {
            name: 'Michael Chen',
            role: 'Directeur des opérations',
            bio: "Expert en rationalisation des opérations de gestion immobilière et des services aux clients.",
          },
          {
            name: 'Emma Rodriguez',
            role: 'Responsable des relations clients',
            bio: "Spécialisée dans la création d'expériences clients exceptionnelles et la communication.",
          },
          {
            name: 'David Kim',
            role: 'Spécialiste en gestion immobilière',
            bio: "Expérimenté dans l'optimisation immobilière et la coordination de la maintenance.",
          },
        ],
      },
    },
    contact: {
      label: 'Contactez-nous',
      heading: 'Commençons',
      subheading:
        "Prêt à maximiser votre potentiel Airbnb ? Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24 heures.",
      office: 'Notre bureau',
      form: {
        name: 'Nom',
        email: 'E-mail',
        phone: 'Téléphone',
        propertyType: 'Type de propriété',
        message: 'Message',
        send: 'Envoyer le message',
        propertyTypes: {
          apartment: 'Appartement',
          house: 'Maison',
          condo: 'Copropriété',
          villa: 'Villa',
          other: 'Autre',
        },
      },
    },
    blog: {
      label: 'Blog & Ressources',
      heading: 'Perspectives pour un hébergement réussi',
      subheading:
        "Conseils d'experts, perspectives de l'industrie et meilleures pratiques pour vous aider à réussir dans votre parcours d'hébergement Airbnb.",
      stayUpdated: 'Restez informé',
      newsletterText:
        "Abonnez-vous à notre newsletter pour les derniers conseils et tendances en matière de gestion immobilière et d'expériences clients.",
      emailPlaceholder: 'Entrez votre e-mail',
      subscribe: "S'abonner",
      featuredArticle: 'Article à la une',
    },
  },
} as const;
