const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const swaggerUI = require('swagger-ui-express');
const specs = require("../swagger/swagger.js");

const invoicesRoutes = require('./routes/invoices.routes');
const authRoutes = require('./routes/auth.routes');
const reportsRoutes = require('./routes/reports.routes');

const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Estados API',
  };

app.use(morgan('dev')); 

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs, swaggerOptions));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
}));

app.use(express.json());

app.use('/facturas', invoicesRoutes);
app.use('/auth', authRoutes);
app.use('/reportes', reportsRoutes);

module.exports = app; 