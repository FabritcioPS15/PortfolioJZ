-- ============================================================
-- Editor de Secciones - Esquema de Supabase
-- Ejecuta este script en: Supabase Dashboard > SQL Editor > New query
-- ============================================================

create extension if not exists pgcrypto;

-- Tabla de secciones (CONSULTORÍAS, INVESTIGACIONES, ARTÍCULOS, o las que quieras).
create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,                       -- Ej: "CONSULTORÍAS"
  icon text not null default 'search',       -- briefcase | search | book-open | pen-tool
  type text not null default 'carousel',     -- carousel | book
  link text not null default '/publicaciones',-- Página propia de la sección (ej: /consultorias)
  "order" integer not null default 0,        -- Posición en la página
  items jsonb not null default '[]'::jsonb,  -- Lista de ítems [{id,title,meta,image,link,description,content}]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seguridad a nivel de fila: lectura pública, escritura solo con rol service_role.
alter table public.sections enable row level security;

drop policy if exists "sections public read" on public.sections;
create policy "sections public read"
  on public.sections for select
  using (true);

drop policy if exists "sections service write" on public.sections;
create policy "sections service write"
  on public.sections for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ============================================================
-- Storage: bucket "uploads" para las imágenes que subas desde el editor
-- (la API crea el bucket automáticamente, esto solo asegura su existencia)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

drop policy if exists "uploads public read" on storage.objects;
create policy "uploads public read"
  on storage.objects for select
  using (bucket_id = 'uploads');

-- ============================================================
-- Datos iniciales
-- NOTA: se eliminan las secciones existentes para dejar las 3 de ejemplo.
-- Si ya tienes contenido creado desde el editor y no quieres perderlo,
-- omite la línea "delete from public.sections;" y crea las secciones desde /admin.
-- ============================================================
delete from public.sections;

insert into public.sections (title, icon, type, link, "order", items)
values
(
  'CONSULTORÍAS', 'briefcase', 'carousel', '/consultorias', 1,
  '[
    {"id":"seed-cons-1","title":"Gestión del Talento Humano","meta":"Consultoría","category":"Consultoría","author":"José Luis Zelada","date":"2024-01-10T00:00:00.000Z","tags":["Talento","RRHH","Estrategia"],"image":"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&h=300&fit=crop","description":"Diseño e implemento estrategias para atraer, desarrollar y retener el talento que impulsa los resultados.","content":"Acompaño a las organizaciones en el diseño e implementación de estrategias para atraer, desarrollar y retener el talento que impulsa los resultados.\n\nRealizamos diagnósticos del ciclo de vida del colaborador, desde el reclutamiento hasta la desvinculación, identificando oportunidades de mejora en cada etapa.\n\nDiseñamos programas de desarrollo, planes de carrera y sistemas de reconocimiento alineados con la estrategia del negocio.\n\nEl resultado es una gestión del talento integral que conecta a las personas con los objetivos organizacionales."},
    {"id":"seed-cons-2","title":"Desarrollo Organizacional","meta":"Consultoría","category":"Consultoría","author":"José Luis Zelada","date":"2024-01-10T00:00:00.000Z","tags":["Cultura","Procesos","Estructura"],"image":"https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&h=300&fit=crop","description":"Fortalezco la cultura, los procesos y la estructura organizacional para lograr equipos más ágiles y efectivos.","content":"Fortalezco la cultura, los procesos y la estructura organizacional para lograr equipos más ágiles y efectivos.\n\nTrabajamos en conjunto con los líderes para diagnosticar la cultura actual y definir la cultura deseada, construyendo hojas de ruta accionables.\n\nRediseñamos procesos y estructuras para eliminar fricciones y potenciar la colaboración entre áreas.\n\nEl enfoque está en generar organizaciones capaces de adaptarse con rapidez a los cambios del entorno."},
    {"id":"seed-cons-3","title":"Consultoría Estratégica","meta":"Consultoría","category":"Consultoría","author":"José Luis Zelada","date":"2024-01-10T00:00:00.000Z","tags":["Estrategia","Liderazgo","Decisiones"],"image":"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop","description":"Acompaño a líderes y organizaciones en la toma de decisiones y en la ejecución de estrategias de alto impacto.","content":"Acompaño a líderes y organizaciones en la toma de decisiones y en la ejecución de estrategias de alto impacto.\n\nAnalizamos el contexto, el modelo de negocio y las capacidades internas para definir prioridades estratégicas claras.\n\nFacilitamos talleres de planeamiento, sesiones de alineamiento y acompañamiento a la alta dirección.\n\nAcompañamos la implementación hasta obtener resultados medibles y sostenibles en el tiempo."}
  ]'::jsonb
),
(
  'INVESTIGACIONES', 'search', 'carousel', '/investigaciones', 2,
  '[
    {"id":"seed-inv-1","title":"Gestión del talento humano y desempeño organizacional: un análisis en el contexto peruano","meta":"2024","category":"Investigación","author":"José Luis Zelada","date":"2024-03-12T00:00:00.000Z","tags":["Talento Humano","Desempeño","Perú"],"image":"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=300&fit=crop","description":"Un análisis sobre cómo las prácticas de gestión del talento humano influyen directamente en el desempeño de las organizaciones peruanas.","content":"La gestión del talento humano se ha convertido en un factor estratégico clave para el éxito de las organizaciones en el contexto peruano. Este estudio analiza la relación entre las prácticas de gestión del talento y el desempeño organizacional.\n\nLa investigación se realizó con una muestra de empresas peruanas de distintos sectores, evaluando dimensiones como la atracción del talento, el desarrollo, la retención y el clima laboral.\n\nLos resultados evidencian una correlación positiva significativa entre las prácticas de gestión del talento y el desempeño organizacional, particularmente en las dimensiones de compromiso y productividad.\n\nSe concluye que las organizaciones que invierten en el desarrollo de su talento humano logran ventajas competitivas sostenibles en el tiempo."},
    {"id":"seed-inv-2","title":"Impacto de la inteligencia artificial en la selección de personal","meta":"2023","category":"Investigación","author":"José Luis Zelada","date":"2023-09-20T00:00:00.000Z","tags":["Inteligencia Artificial","Selección","RRHH"],"image":"https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500&h=300&fit=crop","description":"Exploramos cómo la inteligencia artificial está transformando los procesos de reclutamiento y selección de personal.","content":"La inteligencia artificial está revolucionando la manera en que las organizaciones atraen y seleccionan talento. Este estudio examina el impacto de las herramientas basadas en IA en los procesos de selección de personal.\n\nSe analizaron casos de empresas que implementaron soluciones de IA para la preselección de candidatos, la evaluación de competencias y la reducción de sesgos.\n\nLos hallazgos muestran que la IA puede agilizar significativamente los procesos, pero requiere de supervisión humana para garantizar la equidad y evitar sesgos algorítmicos.\n\nLa recomendación principal es combinar la eficiencia de la tecnología con el criterio humano en las decisiones finales de contratación."},
    {"id":"seed-inv-3","title":"Estrategias de retención de talento en la nueva normalidad","meta":"2023","category":"Investigación","author":"José Luis Zelada","date":"2023-04-05T00:00:00.000Z","tags":["Retención","Talento","Nueva normalidad"],"image":"https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop","description":"Las mejores prácticas para retener al talento clave en un entorno laboral transformado por el trabajo híbrido y remoto.","content":"La nueva normalidad ha transformado profundamente el mundo laboral y con ello las estrategias de retención de talento. Este estudio identifica las prácticas más efectivas en el contexto actual.\n\nSe encuestó a profesionales y líderes de RRHH para comprender qué factores influyen en la decisión de permanecer o dejar una organización.\n\nEl desarrollo profesional, la flexibilidad laboral y el liderazgo cercano aparecen como los principales impulsores de la retención.\n\nLas organizaciones que adaptan sus estrategias a estas nuevas expectativas logran reducir significativamente la rotación de su talento clave."}
  ]'::jsonb
),
(
  'ARTÍCULOS', 'book-open', 'carousel', '/articulos', 3,
  '[
    {"id":"seed-art-1","title":"Liderazgo consciente: la clave para equipos comprometidos y organizaciones sostenibles","meta":"Mayo 2024","category":"Artículo","author":"José Luis Zelada","date":"2024-05-15T00:00:00.000Z","tags":["Liderazgo","Equipos","Sostenibilidad"],"image":"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=300&fit=crop","description":"El liderazgo consciente como motor del compromiso de los equipos y la sostenibilidad organizacional.","content":"El liderazgo consciente es una de las tendencias más poderosas en el desarrollo de equipos. Los líderes que se conocen a sí mismos y actúan con propósito logran equipos más comprometidos.\n\nUn líder consciente practica la escucha activa, la empatía y la transparencia, creando un entorno de confianza donde las personas se sienten valoradas.\n\nEl compromiso del equipo no se exige, se inspira. Cuando las personas entienden el propósito y ven coherencia en sus líderes, su compromiso se vuelve genuino.\n\nLas organizaciones que forman líderes conscientes construyen culturas sostenibles capaces de enfrentar los desafíos del futuro."},
    {"id":"seed-art-2","title":"Cómo construir una cultura organizacional resiliente en tiempos de cambio","meta":"Abril 2024","category":"Artículo","author":"José Luis Zelada","date":"2024-04-10T00:00:00.000Z","tags":["Cultura","Resiliencia","Cambio"],"image":"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=300&fit=crop","description":"Cinco pilares para que tu cultura organizacional resista y se fortalezca ante el cambio constante.","content":"La resiliencia organizacional no se improvisa: se construye intencionalmente a través de la cultura. En tiempos de cambio constante, las organizaciones resilientes destacan.\n\nEl primer pilar es el propósito compartido: las personas necesitan saber hacia dónde va la organización y por qué.\n\nEl segundo pilar es la comunicación transparente, que reduce la incertidumbre y fortalece la confianza.\n\nCompletan los pilares la flexibilidad, el aprendizaje continuo y el cuidado del bienestar de los equipos.\n\nConstruir estos pilares requiere liderazgo consciente y un compromiso genuino con los valores organizacionales."},
    {"id":"seed-art-3","title":"El rol del feedback continuo en el desarrollo profesional de tu equipo","meta":"Marzo 2024","category":"Artículo","author":"José Luis Zelada","date":"2024-03-18T00:00:00.000Z","tags":["Feedback","Desarrollo","Equipos"],"image":"https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&h=300&fit=crop","description":"Por qué el feedback continuo supera a la evaluación anual y cómo implementarlo en tu equipo.","content":"La evaluación de desempeño anual es cada vez menos suficiente. El feedback continuo se ha convertido en la herramienta más efectiva para el desarrollo profesional.\n\nDar feedback oportuno permite corregir el rumbo a tiempo y reconocer los logros en el momento en que ocurren.\n\nUn buen feedback es específico, orientado al comportamiento y enfocado en el futuro, no en juzgar a la persona.\n\nCrear una cultura de feedback requiere práctica y confianza. Los líderes deben modelar la recepción del feedback antes de pedirlo."}
  ]'::jsonb
);
