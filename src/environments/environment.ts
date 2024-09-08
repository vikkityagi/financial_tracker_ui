// environment.ts

export const environment = createEnvironment();

function createEnvironment() {
  const isProduction = false; // Set this dynamically as needed
  return {
    production: isProduction,
    baseUrl: isProduction ? 'http://production-url' : 'http://localhost:8084'
  };
}
