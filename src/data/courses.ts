export type Course = {
  id: string;
  title: string;
  title_ru?: string;
  description: string;
  description_ru?: string;
  price: string;
  duration: string;
  level: string;
  category: string;
};

export const courses: Course[] = [
  {
    id: 'web-temel',
    title: 'Web Proqramlasdirmaya Girish',
    title_ru: 'Vvedenie v veb-programmirovanie',
    description:
      'HTML, CSS ve JavaScript esaslari ile muasir web sehifeler yaradin. Sifirdan baslayaraq real layiheler qurun.',
    description_ru:
      'Izuchite osnovy HTML, CSS i JavaScript dlya sozdaniya sovremennyh veb-stranits. Nachnite s nulya i stroyte realnye proekty.',
    price: '199 AZN',
    duration: '8 hefte',
    level: 'Baslangic',
    category: 'Frontend',
  },
  {
    id: 'react-next',
    title: 'React ve Next.js ile Muasir Frontend',
    title_ru: 'Sovremennyj frontend s React i Next.js',
    description:
      'React 19 ve Next.js 16 istifade ederek dinamik, suretli ve SEO-dos tetbiqler inkishaf etdirin.',
    description_ru:
      'Ispolzuyte React 19 i Next.js 16 dlya razrabotki dinamichnyh, bystryh i SEO-druzhelyubnyh prilozheniy.',
    price: '349 AZN',
    duration: '10 hefte',
    level: 'Orta',
    category: 'Frontend',
  },
  {
    id: 'python-ds',
    title: 'Python ve Data Science',
    title_ru: 'Python i Data Science',
    description:
      'Python proqramlasdirma dilini oyrenin, data analizi ve mashin oyrenmesi esaslarni menimsedin.',
    description_ru:
      'Izuchite yazyk programmirovaniya Python, osvoyte osnovy analiza dannyh i mashinnogo obucheniya.',
    price: '399 AZN',
    duration: '12 hefte',
    level: 'Orta',
    category: 'Data',
  },
  {
    id: 'node-backend',
    title: 'Node.js ile Backend Inkishafi',
    title_ru: 'Backend-razrabotka s Node.js',
    description:
      'Node.js, Express ve verilenler bazasi istifade ederek guclu REST API-ler ve server tetbiqleri qurun.',
    description_ru:
      'Ispolzuyte Node.js, Express i bazy dannyh dlya sozdaniya moshnyh REST API i servernyh prilozheniy.',
    price: '329 AZN',
    duration: '10 hefte',
    level: 'Orta',
    category: 'Backend',
  },
  {
    id: 'mobile-flutter',
    title: 'Flutter ile Mobil Tetbiq Inkishafi',
    title_ru: 'Mobilnaya razrabotka s Flutter',
    description:
      'Flutter framework-u ile Android ve iOS ucun cross-platform mobil tetbiqler yaradin.',
    description_ru:
      'Sozdavayte krossplatformennye mobilnye prilozheniya dlya Android i iOS s pomoshyu freymvorka Flutter.',
    price: '379 AZN',
    duration: '11 hefte',
    level: 'Orta',
    category: 'Mobil',
  },
  {
    id: 'devops',
    title: 'DevOps ve Cloud Esaslari',
    title_ru: 'Osnovy DevOps i Cloud',
    description:
      'Docker, Kubernetes, CI/CD ve AWS ile muasir DevOps praktikalarini oyrenin.',
    description_ru:
      'Izuchite sovremennye praktiki DevOps s Docker, Kubernetes, CI/CD i AWS.',
    price: '449 AZN',
    duration: '9 hefte',
    level: 'Qabaqcil',
    category: 'DevOps',
  },
];

export const popularCourses = courses.slice(0, 4);
