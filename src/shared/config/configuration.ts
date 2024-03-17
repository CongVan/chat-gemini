export default () => ({
  port: parseInt(process.env.PORT + '', 10) || 8005,
  googleAPIKey: process.env.GOOGLE_API_KEY + '',
});
