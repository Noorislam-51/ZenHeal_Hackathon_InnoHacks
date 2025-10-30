require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const expressSession = require('express-session');

const connectDB = require('./config/db');
connectDB();

// ------------------ MODELS ------------------
const Doctor = require('./models/DoctorDB');
const Patient = require('./models/PatientDB');
const Pharmacy = require('./models/PharmacyDB');
const AddPatient = require('./models/AddPatientDB');

// ------------------ ROUTERS ------------------
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const addPatientRouter = require('./routes/add_patient');
const appointmentRouter = require('./routes/appointment');
// const doctorRouter = require('./routes/doctor');
// const patientRouter = require('./routes/patient');

const app = express();

// ------------------ VIEW ENGINE ------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



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
// ------------------ MIDDLEWARE ------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------ SESSION & FLASH ------------------
app.use(flash());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'DoctorPatientAppSecret',
  })
);

// ------------------ PASSPORT CONFIG ------------------
app.use(passport.initialize());
app.use(passport.session());

// ✅ Register two authentication strategies
passport.use('Doctor-local', Doctor.createStrategy());
passport.use('Patient-local', Patient.createStrategy());
passport.use('Pharmacy-local', Pharmacy.createStrategy());


// ✅ Serialize user type + id
passport.serializeUser((user, done) => {
  let type = 'Patient';
  if (user instanceof Doctor) type = 'Doctor';
  else if (user instanceof Pharmacy) type = 'Pharmacy';
  done(null, { id: user._id, type });
});


passport.deserializeUser(async (obj, done) => {
  try {
    if (obj.type === 'Doctor') {
      const doctor = await Doctor.findById(obj.id);
      return done(null, doctor);
    } else if (obj.type === 'Patient') {
      const patient = await Patient.findById(obj.id);
      return done(null, patient);
    } else if (obj.type === 'Pharmacy') {
      const pharmacy = await Pharmacy.findById(obj.id);
      return done(null, pharmacy);
    }
  } catch (err) {
    done(err, null);
  }
});

// ------------------ ROUTES ------------------
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/patient', addPatientRouter);
app.use('/', appointmentRouter);
// app.use('/doctor', doctorRouter);
// app.use('/z', patientRouter);

// ------------------ ERROR HANDLING ------------------


app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
