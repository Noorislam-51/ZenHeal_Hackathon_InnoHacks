var express = require('express');
var router = express.Router();


// pharmacy login
router.get('/login/pharmacy', function(req, res, next) {
  res.render('./auth/pharmacy_auth.ejs');
});

router.get('/pharmacy/dashboard', function(req,res,next){
  res.render('./pharmacy/pharmacyDashboard.ejs')
})


module.exports = router;
