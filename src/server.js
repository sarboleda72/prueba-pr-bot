const schedule = require('node-schedule');
const sequelize = require('./config/database');
const app = require('./app');
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
    console.log('Base datos conectada y sincronizada.');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No pudo iniciar el servidor:', error);
  }
};

startServer();

/* schedule.scheduleJob('01 22 * * *', async () => {
  await email.send();
  console.log('Correo enviado');
  await agendamiento.sendAuthorizations();
  console.log('Autorizaciones enviadas');  
}); */