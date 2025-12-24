# SWAPI Explorer

This project is the submission to the following coding challenge:

> Please implement a Star Wars themed React App. The App should connect to https://swapi.dev/ or https://swapi.py4e.com/api and display the retrieved data. Please do not invest more than 4-8 hours on this. Also, keep the design effort to a minimum and use a pragmatic approach to your app's design. If you need to cut anything from the implementation or make any assumptions due to time constraints, please make a note and let us know later when presenting your solution to us. Treat this as a showcase for your working style and as a chance to show off your skills as a developer. Of course you don’t have to overdo it. In the end, we know that you have to work on it next to your daily life. A simple solution is perfectly fine. Should you hit a roadblock don’t hesitate to ask us. Please commit your code to a public github repository and provide us with the link.


This project implements a Next.js app that connects to the SWAPI (https://swapi.py4e.com/api) and displays the retrieved data.

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Process

The project was bootstrapped via https://ui.shadcn.com/create to have an initial set of UI components and theming. I tried out [Antigravity](https://antigravity.google), Googles new VS Code based AI coding IDE.

I implemented the challenge with the following iterations:

1. Create a root layout and index page. This was used to initialize some Nav bar, and overview about the app.
2. Implement access to people, including a list/search page, and a details page.
3. Implement access to planets, similar to how people were implemented. the people page now links to the planets page.
4. implement the following entities in a similar fashion: films, species, vehicles, and starships.
5. Refactor the app to use mainly server components, create reusable components (e.g. for search fields, pagination, etc.).

## Open topics

Due to time constraints, the following topics were not implemented:

- Improve streamin: there are a couple of dependent network requests, e.g. to display a person, we need to first fetch the person, then planet, species, vehicles, and starships. While we are fetching the dependent data in parallel, we could still display the UI that is only dependent on the person data and pass promises to the remaining data to child components in suspens boundaries. This would allow the UI to be displayed while the remaining data is being fetched.
- Moving error states to separate `error.tsx` files.
- Adding loading states via separate `loading.tsx` files.
- Adding component tests / E2E tests.