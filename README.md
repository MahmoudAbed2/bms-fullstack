
# BMS Fullstack-projekt

Detta projekt består av två delar:

- **Backend:** med Spring Boot och Java.
- **Frontend:** med React.

---

## Krav

- Java 17 eller högre
- Maven
- Node.js + npm

---

## Hur man kör projektet

### 1. Kör Backend

För att köra backend-projektet, följ dessa steg:

1. Navigera till backend-mappen:

```bash
cd backend
```

2. Kör backend-servern med Maven:

```bash
mvn spring-boot:run
```

Servern kommer att vara tillgänglig på `http://localhost:8080`.

### 2. Kör Frontend

För att köra frontend-projektet, följ dessa steg:

1. Navigera till frontend-mappen:

```bash
cd frontend
```

2. Installera alla beroenden:

```bash
npm install
```

3. Starta frontend-servern:

```bash
npm start
```

Frontend-applikationen öppnas automatiskt på `http://localhost:3000` och ansluter till backend via en proxy.

---

## Mappstruktur

```
bms-fullstack/
│
├── backend/          ← Spring Boot-projekt
│
└── frontend/         ← React-projekt
```

---

## Anmärkningar

- Sessionsdata lagras i en lokal SQLite-databas.
- Gränssnittet kan förbättras senare för att visa diagram eller prisvarningar.
