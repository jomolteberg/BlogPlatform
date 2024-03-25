# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list


 Bloggplattform med Ekte-tids Kommentarsystem

- **Teknologier**: .NET, React, TypeScript, CSS, PostgreSQL, RabbitMQ, SignalR, AWS, Seq, Prometheus, Grafana.
- **Beskrivelse**: Utvikle en bloggplattform hvor brukere kan publisere artikler, og andre brukere kan legge igjen kommentarer i sanntid. Bruk .NET for backend, React med TypeScript for frontend, og CSS for styling. PostgreSQL fungerer som databasen for å lagre artikler og kommentarer. Implementer et ekte-tids kommentarsystem ved hjelp av SignalR for umiddelbar kommunikasjon og RabbitMQ for meldingskø håndtering. Deploy prosjektet på AWS og bruk Seq for logging, Prometheus for overvåking, og Grafana for dashboard visualiseringer.