export const BLOG_POSTS = [
  {
    id: 1,
    title: "Invisalign Cost 2024: A Complete UK Price Guide",
    excerpt: "Understand the investment required for a perfect smile. We break down the cost factors between Platinum and Diamond tier providers.",
    date: "March 15, 2024",
    category: "Pricing",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Invisalign vs Traditional Braces: Which is Better for You?",
    excerpt: "Comparing aesthetics, comfort, and clinical effectiveness. Discover why 90% of adults now choose clear aligners over metal tracks.",
    date: "March 10, 2024",
    category: "Patient Guide",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "The Science of ClinCheck: How Digital Planning Transforms Smiles",
    excerpt: "Explore the 3D software that allows you to see your final smile before you even start treatment. The power of digital orthodontics.",
    date: "March 02, 2024",
    category: "Technology",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "How to Clean Invisalign Aligners: Expert Maintenance Tips",
    excerpt: "Maintain crystal-clear aligners and fresh breath with these daily cleaning protocols recommended by leading Platinum providers.",
    date: "February 25, 2024",
    category: "Patient Guide",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1593054992451-2495393d6961?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Orthodontic Relapse: Why Invisalign is the Solution",
    excerpt: "Did your teeth move after childhood braces? Learn how Invisalign 'Lite' and 'Express' can quickly restore your alignment.",
    date: "February 18, 2024",
    category: "Specialist Info",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1461532257246-777de18cd58b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Eating with Invisalign: The 'Do's and Don'ts'",
    excerpt: "One of the best perks of clear aligners is zero dietary restrictions. Here is how to manage snacks and meals effectively.",
    date: "February 10, 2024",
    category: "Lifestyle",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop"
  }
];

export const LOCATIONS: Record<string, string[]> = {
  "England": [
    "London", "Birmingham", "Manchester", "Leeds", "Liverpool", "Sheffield", "Bristol", 
    "Newcastle upon Tyne", "Nottingham", "Leicester", "Coventry", "Bradford", "Hull", 
    "Stoke-on-Trent", "Derby", "Southampton", "Portsmouth", "Plymouth", "Wolverhampton", "Reading",
    "Luton", "Milton Keynes", "Northampton", "Peterborough", "Swindon", "York", "Oxford", 
    "Cambridge", "Chelmsford", "Colchester", "Slough", "Blackpool", "Preston", "Bolton", 
    "Huddersfield", "Sunderland", "Middlesbrough", "Brighton", "Bournemouth", "Ipswich"
  ],
  "Scotland": [
    "Glasgow", "Edinburgh", "Aberdeen", "Dundee", "Inverness", "Perth", "Stirling", "Paisley", "Ayr", "Kilmarnock"
  ],
  "Wales": [
    "Cardiff", "Swansea", "Newport", "Wrexham", "Bangor", "Bridgend", "Llanelli", "Merthyr Tydfil", "Barry", "Caerphilly"
  ],
  "Northern Ireland": [
    "Belfast", "Derry (Londonderry)", "Lisburn", "Newtownabbey", "Bangor", "Craigavon", "Newry", "Carrickfergus", "Coleraine", "Antrim"
  ]
};

export const SERVICES = [
  { id: 'crowded', title: 'Invisalign for Crowded Teeth', desc: 'Effectively straighten teeth that overlap or lack space. Crowded teeth can lead to plaque buildup and gum disease.', color: 'sky' },
  { id: 'gaps', title: 'Invisalign for Gaps', desc: 'Close noticeable spaces between your teeth quickly. Gaps can bring your smile together seamlessly.', color: 'indigo' },
  { id: 'overbite', title: 'Invisalign for Overbite', desc: 'Correct deep bites where upper teeth overlap lower teeth significantly. Modern attachments handle complex movements.', color: 'emerald' },
  { id: 'underbite', title: 'Invisalign for Underbite', desc: 'Address underbites to enhance facial profile and prevent wear. Invisalign is a gentle alternative to corrective surgery.', color: 'amber' },
  { id: 'crossbite', title: 'Invisalign for Crossbite', desc: 'Fix crossbites to prevent jaw pain and tooth chipping. Clear aligners widen the arch for a balanced bite.', color: 'rose' },
  { id: 'adults', title: 'Invisalign for Adults', desc: 'Professional, discreet aligners designed for busy lifestyles. Straighten your teeth without the traditional braces look.', color: 'sky' }
];

export const FAQS_HOME = [
  { q: "How does this service differ from a normal dentist?", a: "We are an independent referral network focusing on Platinum tier providers. We prioritize matching you with clinical experts who handle thousands of cases annually. This ensures you receive the highest standard of specialized care." },
  { q: "Is the $500 network credit really available?", a: "Yes, patients who book through our referral pipeline qualify for an exclusive $500 credit. This credit is applied directly toward your full Invisalign treatment plan with our partners. It is part of our commitment to making elite care accessible." },
  { q: "Is there a cost for the referral?", a: "Our referral facilitation service is completely free for patients. We help you find the perfect match and arrange your initial consultation at no charge. You only pay the clinic directly if you choose to proceed with treatment." }
];

export const FAQS_SERVICES = [
  { q: "How long does treatment usually take?", a: "Treatment duration varies but most adult cases are completed within 6 to 18 months. Lite cases can often be resolved in as little as 3 months. Your specialist will provide a precise digital timeline during your scan." },
  { q: "Will Invisalign affect my speech?", a: "Most patients experience a slight lisp for the first few days as the tongue adjusts to the aligners. This typically disappears quickly as you get used to wearing them. The aligners are ultra-thin to minimize any impact on daily conversation." },
  { q: "Can I see my results before I start?", a: "Yes, we use advanced 3D ClinCheck software to map out your entire smile transformation. You will be able to view a digital animation of your teeth moving into their final position. This happens before you even order your first set of aligners." }
];

export const FAQS_LOCATION = [
  { q: "How do you vet your local providers?", a: "We only partner with clinics that maintain Platinum or Diamond status from Invisalign. This signifies they have achieved the highest level of experience and successful case volume. We also monitor patient reviews to ensure consistently high service standards." },
  { q: "Are the clinics easily accessible?", a: "Our network specifically targets major city centers and high-value towns for maximum convenience. Most partners offer flexible evening or weekend appointments to fit your schedule. We prioritize locations with excellent transport links and modern facilities." },
  { q: "What if there isn't a provider in my exact town?", a: "If your specific town is not listed, we will match you with the nearest elite hub. Platinum providers are worth the short travel as they offer superior technology and clinical outcomes. We ensure the travel time is minimized for your convenience." }
];
