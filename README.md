# Sigurnost računala i podataka - SRP

### FESB, 2020/21

U ovom repozitoriju objavljivat ćemo upute, kodove i isječke kodova, konfiguracijske skripte, i razne sugestije relevantne za laboratorijske vježbe.

## Kloniranje repozitorija

U repozitoriju ćemo objavljivati kompletne projekte koje možete klonirati i pokretati lokalno. To možete napraviti u par jednostavnih koraka koje ćemo pokazati na primjeru Node.js projekta u direktoriju `postgres-express-node`.

1. Instalirajte git klijent, npr. [Git-SMC](https://git-scm.com/downloads).
2. U komandnom prozoru/terminalu, u odgovarajućem direktoriju, izvršite sljedeću naredbu:

    ```sh
    git clone https://github.com/mcagalj/SRP-2020-21
    ```

    Git klijent će automatski generirati direktorij `SRP-2020-21` u kojem će biti pohranjen cijeli repozitorij.

3. Pokretanje Node.js aplikacije. Ovo možete napraviti na više načina ovisno u kojoj fazi razvoja se nalazite. Uđite u direktorij `SRP-2020-21\postgres-express-node` i izvršite sljedeću naredbu:
   
   > VAŽNO: Prije pokretanja aplikacije trebate u direktoriju `SRP-2020-21` kreirati `.env` datoteku i popuniti je kako je objašnjeno u datoteci `.env.example`. 

    ```sh
    npm run
    ```

    Ova naredba će vam izlistati neke od opcija koje možete koristiti za pokretanje Node.js aplikacije; izlistane opcije konfigurirane su u datoteci `package.json` koju po potrebi možete prilagoditi vlastitim potrebama.

    ```sh
    > npm run
    Scripts available in srp-labs via npm run-script:
        dev
            cross-env NODE_ENV=development node index.js
        dev:watch
            cross-env NODE_ENV=development nodemon index.js
        prod
            cross-env NODE_ENV=production node index.js
    ```

    Npr., ako odaberemo opciju `dev:watch`, Node.js aplikaciju pokrećemo kako slijedi:

    ```sh
    npm run dev:watch
    ```
