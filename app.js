const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./common/logger');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const notesRouter = require('./routes/notes');
const http = require("http");

const app = express();

// client.connect();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notes', notesRouter);

app.server = http.createServer(app);
app.server.listen(process.env.PORT || '3000', () => {
  logger.info(
    `Started server on => http://localhost:${app.server.address().port}`,
  );
});

module.exports = app;
