Restaurant App (Skeleton)
Esqueleto de aplicación para restaurantes que permite crear un perfil y comprar opciones del menú en línea. Desarrollada con React Native + Expo y persistencia local con SQLite.

🚀 Stack
React Native (Expo)

expo-sqlite (API v15+: openDatabaseSync/Async, runAsync, getAllAsync, execAsync)

react-native-paper (UI)

Lodash (debounce)

📦 Requisitos
Node LTS

Expo CLI (npx expo --version)

Android Studio / Xcode (opcional, para emuladores)

▶️ Inicio rápido
bash
Copiar
Editar
# instalar deps
npm i
# o yarn

# levantar app
npx expo start

# abrir en Android
a # (en la consola de Expo)

# abrir en iOS (macOS)
i
🗄️ Base de datos (SQLite)
Esquema: menuitems(id INTEGER PK, title TEXT, price REAL, category TEXT)

API moderna:

Crear tabla: db.execAsync(...)

Insert/Update/Delete: db.runAsync(sql, ...params)

Lecturas: db.getAllAsync(sql, ...params)

Transacción: db.withTransactionAsync(async () => { ... })

🧩 Scripts útiles
json
Copiar
Editar
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "lint": "eslint ."
  }
}
🗂️ Estructura sugerida
bash
Copiar
Editar
.
├── App.js
├── database.js         # CRUD SQLite (API v15+)
├── components/
│   └── Filters.jsx
├── utils.js            # getSectionListData, hooks utilitarios
├── assets/
├── .gitignore
└── README.md
🔄 Flujo de desarrollo
Crea rama: git checkout -b feature/<descriptivo>

Commits claros: feat:, fix:, chore:

PR a main con descripción breve y pasos de prueba

🔐 Variables de entorno
Si usas credenciales/URLs privadas, ponlas en .env y no lo subas (ya está ignorado). Deja un .env.example.

🧪 Notas y tips
Keys en listas: usa keyExtractor={(item) => String(item.id)}.

Debounce: cancela en useEffect cleanup (debouncedLookup.cancel()).

Datos remotos: normaliza el JSON (algunas APIs devuelven { menu: [...] }).

Migraciones: si cambiaste columnas (ej. quitaste uuid), borra la BD de desarrollo (reinstala app o DROP TABLE).