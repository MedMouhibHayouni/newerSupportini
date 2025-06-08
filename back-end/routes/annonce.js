var express = require('express');
var router = express.Router();
//const validate = require('../middlewares/validatorGym')
const annonces= require('../controllers/annonce/annonceController');
const { annonce } = require("../models");

const {uploadAnnonce} = require("../middlewares/UploadImageAnnonce");
const {
    userAuth,

    checkRole,
    serializeUser
} = require("../utils/Auth");


/* CREATE annonce listing. */
router.post('/create',userAuth,uploadAnnonce, annonces.createAnnonce);
router.get('/participer/:idAnnonce',userAuth, annonces.participer);
router.get('/affiche', annonces.getAllAnnonces);
router.get('/afficheById/:annonceId', annonces.getOneAnnonce);
router.delete('/deleteById/:annonceId', annonces.deleteAnnonce);
router.put('/update/:annonceId', annonces.updateAnnonce);
router.get('/getSortedByPriceDesc', annonces.getSortedByPriceDesc);
router.get('/getSortedByPriceAsc', annonces.getSortedByPriceAsc);
router.get('/getdByVille/:ville', annonces.getByVille);
router.put('/sinscrire/:annonceId', annonces.incremeterInscription);
router.get('/getAnnonceByCoach',userAuth, annonces.getAnnonceByCoach);
router.get('/affichetopten', annonces.gettoptenAnnonce);
router.post('/filter', annonces.filter);
router.get('/afficheTrainerByAnnonce/:annonceId', annonces.getTrainerByAnnonce);
router.get('/getCoachInformationByIdAnnonce/:annonceId', annonces.getCoachInformationByIdAnnonce);

router.get('/debug/all-annonces', async (req, res) => {
  try {
    const results = await annonce.findAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/debug/active-coaches', async (req, res) => {
  try {
    const results = await coach.findAll({
      include: [{
        model: user,
        where: { status: 1 }
      }]
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;