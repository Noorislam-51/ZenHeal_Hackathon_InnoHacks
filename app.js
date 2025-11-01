require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const expressSession = require('express-session');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
connectDB();

// ------------------ INITIALIZE EXPRESS APP ------------------
const app = express();

// ------------------ SERVER + SOCKET.IO SETUP ------------------
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server); // Attach socket.io

// ------------------ MIDDLEWARE ------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------ VIEW ENGINE ------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ------------------ GOOGLE TRANSLATE SNIPPET ------------------
app.use((req, res, next) => {
  res.locals.translateSnippet = `
    <div id="google_translate_element" style="text-align:right; padding:10px;"></div>
    <script>
      function googleTranslateElementInit() {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'hi,bn,ml,ta,te,gu,mr,kn,pa',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
      }
    </script>
    <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
  `;
  next();
});

// ------------------ SESSION & FLASH ------------------
app.use(flash());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'DoctorPatientAppSecret',
  })
);

// ------------------ MODELS ------------------
const Doctor = require('./models/DoctorDB');
const Patient = require('./models/PatientDB');
const Pharmacy = require('./models/PharmacyDB');
const Appointment = require('./models/AppointmentDB');
const HealthWorker = require('./models/HealthWorkerDB')

// ------------------ PASSPORT CONFIG ------------------

app.use(passport.initialize());
app.use(passport.session());

// Multiple strategies
passport.use('Doctor-local', Doctor.createStrategy());
passport.use('Patient-local', Patient.createStrategy());
passport.use('Pharmacy-local', Pharmacy.createStrategy());
passport.use('HealthWorker-local', HealthWorker.createStrategy());

// Serialize & deserialize
passport.serializeUser((user, done) => {
  let type = 'Patient';
  if (user instanceof Doctor) type = 'Doctor';
  else if (user instanceof Pharmacy) type = 'Pharmacy';
  else if (user instanceof HealthWorker) type = 'HealthWorker';
  done(null, { id: user._id, type });
});

passport.deserializeUser(async (obj, done) => {
  try {
    if (obj.type === 'Doctor') return done(null, await Doctor.findById(obj.id));
    if (obj.type === 'Patient') return done(null, await Patient.findById(obj.id));
    if (obj.type === 'Pharmacy') return done(null, await Pharmacy.findById(obj.id));
    if (obj.type === 'HealthWorker') return done(null, await HealthWorker.findById(obj.id))
  } catch (err) {
    done(err, null);
  }
});

// ------------------ ROUTES ------------------
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const doctorRouter = require('./routes/doctor');
const patientRouter = require('./routes/patient');
const pharmacyRouter = require('./routes/pharmacy');
const healthWorkerRouter = require('./routes/health_worker');

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', doctorRouter);
app.use('/', patientRouter);
app.use('/', pharmacyRouter);
app.use('/',healthWorkerRouter);



// ------------------ ERROR HANDLING ------------------
app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

module.exports = app;
