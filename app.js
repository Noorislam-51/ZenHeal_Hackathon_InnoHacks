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
// ------------------ ROUTERS ------------------
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
// const doctorRouter = require('./routes/doctor');
// const patientRouter = require('./routes/patient');

const app = express();

// ------------------ VIEW ENGINE ------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ------------------ MIDDLEWARE ------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
  if (user.doctorId) type = 'Doctor';
  else if (user.pharmacyId) type = 'Pharmacy';
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
// app.use('/doctor', doctorRouter);
// app.use('/patient', patientRouter);

// ------------------ ERROR HANDLING ------------------
app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
