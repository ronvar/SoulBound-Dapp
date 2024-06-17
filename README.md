
# Soulbound Dapp

This is a full stack application meant to interact with the Polygon Amoy testnet contract `0xA57CC3065E049d50D4f2D10F614FCfA6A8CA8eb5`.
## Screenshots

![App Screenshot](https://github.com/ronvar/SoulBound-Dapp/assets/31808077/347a3933-9e68-46c5-88e8-0bdc0f75bbd6)

![App Screenshot](https://github.com/ronvar/SoulBound-Dapp/assets/31808077/66f870ba-067f-4dbb-80a4-b9a7460405f7)

![App Screenshot](https://github.com/ronvar/SoulBound-Dapp/assets/31808077/32734a32-c236-4f2e-b1e1-3a3ddf3affa5)

![App Screenshot](https://github.com/ronvar/SoulBound-Dapp/assets/31808077/a258b983-d3d9-4ecb-b4a8-c953f63edcf8)

![App Screenshot](https://github.com/ronvar/SoulBound-Dapp/assets/31808077/adac3799-da55-4859-b69d-44522ffaf57e)

![App Screenshot](https://github.com/ronvar/SoulBound-Dapp/assets/31808077/59598a93-3623-49fc-a13f-6b20602cd452)

![App Screenshot](https://github.com/ronvar/SoulBound-Dapp/assets/31808077/00169fc5-0d99-4409-8e56-86b3bf404360)

![App Screenshot](https://github.com/ronvar/SoulBound-Dapp/assets/31808077/1ccd7cee-0c65-453f-8b3b-0e8d11395ecf)

![App Screenshot](https://github.com/ronvar/SoulBound-Dapp/assets/31808077/4254a5a1-07b5-4ace-992e-256ea1729b09)
## Installation
There are 2 folders you will need to take care of.
`./backend` and `./frontend`.

Please make sure you are running node v18.0.0+. To install dependencies, run:

```bash
  cd ./frontend
  npm install
```

To install necessary dependencies for the backend from the root folder, run:

```bash
  cd ./backend
  npm install
```

    

## Environment Variables

To run this project, you will need two environment variables. One at the root of the `./backend` folder and one at the root of the `./frontend` folder.


The BACKEND environment file has variables:
```
DYNAMIC_PUBLIC_KEY_BASE64=
PGHOST=
PGPORT=
PGUSER=
PGDATABASE=
PGPASSWORD=
DAPP_WALLET=
```

The FRONTEND environment file has the variables:
```
DYNAMIC_ENVIRONMENT_ID=
```


## Run Locally

You will need two terminals to fully run this project.
Please run this command on one terminal to run the backend server:

```bash
  cd ./backend
  npm run dev
```


Then please run this command on the other terminal to start the frontend Next.JS instance:

```bash
  cd ./frontend
  npm run dev
```

In your browser, head over to `http://localhost:3000` to view the app.

## Further Improvements

- Minting an NFT client-side: Currently, the only way to mint an NFT is using the backend. Client-side transactions were not completed in time and could be made a feature in future iterations.

- Logging Out/Refreshing Page: Less priority was given to a user logging out/refreshing the page and hydrating the user from local storage and cookies so this can cause issues. In a production environment this would be stablized and made robust to ensure fluidity and security.


## Tech Stack

**Client:** React, Next.JS, Typescript

**Server:** Node, Express, Typescript, Postgres

