## Running the project
1. Add a new file .env to the project root and insert the following entry:
   ```bash
   REACT_APP_API+KEY=X
   ```
   Where X is your API key for the free openweathermap.org API.

2. Run the docker container by running this command in the project root:
   ```bash
   docker compose up --build
   ```

3. On your favorite browser, visit localhost:3000
