Documentación del Proyecto: Aplicación de Gestión de Cuidados y Medicación

1\. Documento de Negocio

1.1. Resumen Ejecutivo

La aplicación es una herramienta móvil "Local First" diseñada para cuidadores (familiares o profesionales) y pacientes. Su objetivo principal es centralizar, monitorizar y gestionar la toma de medicamentos, mediciones físicas y resultados de analíticas de una o múltiples personas. Aprovecha la infraestructura de Google Calendar para la gestión de recordatorios y eventos, garantizando la privacidad de los datos al almacenar la información médica de forma local en el dispositivo del usuario. Se tiene que crear en castellano, catalán e ingles, todos los textos en string para poder añadir un idioma nuevo en cualquier momento sin afectar a la usabilidad

1.2. Propuesta de Valor

Privacidad Absoluta (Local First): Los datos sensibles de salud no residen en servidores de terceros, sino en el dispositivo del usuario.

Alertas Inteligentes y Locales: Sistema de avisos directos en el móvil, claros y contextuales, que no dependen de conexión a internet.

Sincronización de Calendario: Uso de Google Calendar para reflejar las tomas e invitar a otras personas involucradas en el cuidado.

Gestión Integral del Paciente: No solo controla la medicación, sino también el histórico de mediciones biométricas y la digitalización de analíticas médicas mediante Inteligencia Artificial (OCR) en el propio dispositivo.

Contexto Visual Rápido: Uso de colores de fondo y fotos personalizadas por paciente para evitar errores de medicación cuando se gestiona a múltiples personas.

Propiedad y Seguridad de los Datos: El usuario tiene control total sobre sus datos médicos, con la capacidad de exportarlos y restaurarlos fácilmente.

1.3. Propuesta de Imagen y Branding

Para transmitir confianza, salud, tranquilidad y organización, se sugiere la siguiente línea visual:

Nombre Sugerido: CareSync, CuidApp Local, o MediCal (Medication + Calendar).

Paleta de Colores Base de la App: \* Primario: Azul claro/Celeste (transmite salud, limpieza, confianza médica).

Secundario: Verde menta suave (transmite bienestar y tranquilidad).

Fondo general: Blanco o Gris muy claro (#F8F9FA) para mantener la interfaz limpia y permitir que los colores de fondo personalizados de cada paciente destaquen sin saturar visualmente.

Tipografía: Inter o Roboto (tipografías sans-serif, muy legibles, modernas y accesibles para personas mayores o con problemas de visión).

Estilo Visual (UI): Tarjetas (cards) con bordes redondeados, sombras muy suaves. Iconografía minimalista (estilo "outline").

Logo: Un icono minimalista que fusione la silueta de un calendario con un corazón o una píldora en la esquina superior derecha, usando un degradado de azul a verde menta.

2\. Documento Funcional

2.1. Módulo de Gestión de Perfiles (Pacientes/Cuidados)

Creación de Perfiles: Capacidad de crear múltiples perfiles.

Personalización:

Subida de foto de perfil (desde cámara o galería).

Selector de color de fondo específico. Cuando el usuario entre en el perfil de "María", la interfaz adoptará sutilmente ese color para dar contexto rápido y evitar errores.

Datos básicos: Nombre, edad, relación, notas generales del paciente.

2.2. Módulo de Medicamentos y Pautas

Alta de Medicamento:

Nombre del medicamento.

Foto del medicamento (caja o pastilla) para reconocimiento visual.

Apartado de notas generales del medicamento.

Pauta de Administración:

Fecha de inicio y fecha de fin (opcional si es crónico).

Frecuencia altamente configurable: Cada X horas, X días, X semanas o X meses.

Integración con Google Calendar: Al guardar la pauta, se generan eventos en Calendar para tener una vista global compartida.

2.3. Módulo de Registro de Tomas (Log/Histórico)

Vista de Tomas: Un listado (línea de tiempo) cronológico de las tomas pendientes y realizadas.

Detalle de cada toma (Línea):

Estado: Pendiente, Tomado, Saltado/Omitido.

Comentarios por toma: Capacidad de añadir texto específico a una toma particular.

2.4. Módulo de Mediciones Biométricas

Registro de Viales: Formulario para añadir mediciones por fecha y hora.

Campos Fijos: Peso (kg/lbs), Tamaño/Estatura, Presión arterial, Glucosa en sangre.

Campos Personalizables: El usuario podrá crear y configurar nuevos campos de medición específicos para ese paciente (ej. "Saturación de oxígeno", "Nivel de dolor", "Temperatura").

Vista: Listado histórico o gráfico de evolución para observar tendencias.

2.5. Módulo de Analíticas y Pruebas Médicas

Captura: Uso de la cámara del móvil para hacer una foto a una hoja de resultados.

Procesamiento (OCR): Extracción del texto de la imagen para que sea buscable e indexable.

Histórico: Listado de analíticas previas con foto original y texto extraído.

2.6. Módulo de Copias de Seguridad y Exportación (Backup)

Backup Automático Semanal: Empaquetado automático de todos los datos (perfiles, medicamentos, tomas y fotos) en un archivo local cifrado.

Envío por Correo Electrónico: Apertura automática del cliente de correo con el archivo adjunto.

Importación y Restauración: Capacidad de abrir el archivo de backup para restaurar la base de datos en cualquier dispositivo.

2.7. Sistema de Alertas y Notificaciones Push (NUEVO)

Notificaciones Push Locales: El sistema programará de manera automática alertas en el teléfono del cuidador/paciente sin depender de internet.

Mensajería Contextualizada: El formato del mensaje será altamente específico para evitar confusiones. Ejemplo: "María tiene que tomar Paracetamol (1 pastilla)".

Acciones Rápidas (Rich Notifications): Desde la propia notificación en la pantalla de bloqueo, el usuario podrá pulsar botones de acción rápida como: "Marcar como Tomado" o "Posponer 15 min", sin necesidad de abrir la app completa.

3\. Documento Técnico

3.1. Arquitectura del Sistema

Paradigma: Local-First (Offline First). La aplicación es funcional sin conexión a internet.

Infraestructura: Sin backend propio. Los datos y la programación de notificaciones residen enteramente en el dispositivo.

3.2. Stack Tecnológico Sugerido

Frontend: React Native (con Expo) o Flutter.

Base de Datos Local: WatermelonDB o Realm.

Gestión de Notificaciones (NUEVO): \* expo-notifications: Permite programar alertas a futuro basadas en fechas y horas exactas (Local Push). Al no usar servidores externos (como Firebase Cloud Messaging), se garantiza la privacidad de los datos del paciente y se asegura que la alerta suene aunque el móvil esté en "Modo Avión".

Procesamiento OCR: Google ML Kit (Text Recognition) (On-Device).

Sistema de Archivos y Correo: expo-file-system y expo-mail-composer.

Autenticación y APIs: Google Sign-In / OAuth 2.0 y Google Calendar API.

3.3. Lógica de Notificaciones Locales

Cálculo de Tomas: Al crear una pauta médica de 1 mes cada 8 horas, la app calcula localmente los ~90 timestamps (fecha/hora exacta) de cada toma.

Programación (Scheduling): La app utiliza el módulo de notificaciones para dejar programados en el sistema operativo esos 90 avisos.

Payload Personalizado: A cada notificación se le inyecta el título \[Nombre Paciente] tiene que tomar... y el cuerpo \[Nombre Medicamento], junto con el medication\_id de forma invisible.

Interacción: Si el usuario pulsa "Marcar como tomado" en la notificación, un proceso en segundo plano (Background Task) actualiza el registro en la base de datos local (WatermelonDB).

3.4. Estructura de Datos Básica (Esquema Relacional)

Table Patients: id, name, relation, profile\_pic\_uri, bg\_color\_hex, custom\_measurement\_fields, created\_at.

Table Medications: id, patient\_id, name, photo\_uri, start\_date, end\_date, frequency\_type, frequency\_interval, general\_notes.

Table Intakes (Tomas): id, medication\_id, scheduled\_time, actual\_time, status, intake\_notes, calendar\_event\_id, local\_notification\_id (NUEVO: para poder cancelar la alarma si el usuario la marca como tomada antes de que suene).

Table Measurements: id, patient\_id, date\_time, weight, height, blood\_pressure, blood\_glucose, other\_measures, comments.

Table Analytics\_Records: id, patient\_id, date, photo\_uri, extracted\_text\_ocr, created\_at.

