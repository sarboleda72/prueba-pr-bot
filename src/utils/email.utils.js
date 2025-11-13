const nodemailer = require('nodemailer');
const excel = require('./excel.utils');
require('dotenv').config();

const send = async () => {
  try {
    const excelFilePath = await excel.create();
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_OCGN,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const mailOptions = {
      from: process.env.EMAIL_OCGN,
      to: 'jacosta@cyt.com.co, mariav.donado@zentria.com.co, tatiana.cano@zentria.com.co, sandra.penaranda@zentria.com.co, jairo.rincon@zentria.com.co, tatiana.acuna@zentria.com.co, nestor.estrada@zentria.com.co, yanka.maldonado@zentria.com.co, mayra.delahoz@zentria.com.co, manuel.criado@zentria.com.co, tatiana.arrieta@zentria.com.co, angelica.manjarres@zentria.com.co, harold.perez@zentria.com.co, sarboleda@cyt.com.co',
      subject: `Gestión autorizaciones FOMAG - Reporte ${formattedDate}`,
      text: '',
      html: '<p>Buenas tardes, se adjunta reporte con el detalle de los agendamientos procesados durante el día.</p><p>Se sugiere revisar el tablero para más información</p> <br> <a href="https://app.powerbi.com/view?r=eyJrIjoiZDE5MDNiYTAtNWI0ZC00Njg1LWE0NjQtZjViYTY2YmNjYTc4IiwidCI6IjNiY2M0MzNhLTgzZWUtNDY4Ny05YTUwLTIzZTZlODdjOTQ1NiJ9">Tablero Power BI</a>',
      attachments: [
        {
          filename: `OCGN-Reporte ${formattedDate}.xlsx`,
          path: excelFilePath,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: %s', info.messageId);
  } catch (error) {
    console.error('Error enviando el correo:', error);
  }
}

module.exports = { send };