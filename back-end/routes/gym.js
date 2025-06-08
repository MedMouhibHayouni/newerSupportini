var express = require("express");
var router = express.Router();
const validate = require("../middlewares/validatorGym");

const gym = require("../controllers/gym/gymController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { sallesport } = require("../models");
const { userAuth, checkRole, serializeUser } = require("../utils/Auth");

// Use absolute path to be safe
const uploadDir = path.resolve(__dirname, '../public/images/salleDeSport');

// Create directory with proper permissions
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { 
    recursive: true,
    mode: 0o777 // Give full permissions (adjust for production)
  });
}

// Add debug output to verify path
console.log('Files will be saved to:', uploadDir);

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Verify directory exists right before saving
    fs.access(uploadDir, fs.constants.W_OK, (err) => {
      if (err) {
        console.error('Directory access error:', err);
        return cb(new Error('Cannot write to upload directory'));
      }
      cb(null, uploadDir);
    });
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Add more detailed file filtering
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    req.fileValidationError = 'Invalid file type';
    return cb(null, false, new Error('Invalid file type'));
  }
  cb(null, true);
};

// In your routes file
const uploadGym = multer({
    storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 10 // Max 10 files
  }
}).any(); // Accepts any files regardless of field name

// Modify the create endpoint to include userAuth middleware
router.post("/create", userAuth, (req, res) => {
  uploadGym(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const files = req.files;
      const {
        nomSalle,
        numTel,
        ville,
        rue,
        codePostal,
        description,
        prix,
        url,
      } = req.body;

      // Get user ID from authenticated user
      const userId = req.user.id; // This comes from userAuth middleware
      
      if (!userId) {
        return res.status(400).json({ error: "User ID not found" });
      }

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "At least one image is required" });
      }

      const newGym = await sallesport.create({
        nomSalle,
        numTel,
        ville,
        rue,
        codePostal,
        description,
        prix,
        url,
        imageVitrine: files[0].filename,
        fk_idUser: userId // Now properly set
      });

      // Save additional images
      if (files.length > 1) {
        await Promise.all(
          files.slice(1).map((file) =>
            imagesalle.create({
              imageVitrine: file.filename,
              fk_idsallesport: newGym.id,
            })
          )
        );
      }

      res.status(201).json({ success: true, gym: newGym });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});
router.get("/affiche", gym.getAllGym);
router.get("/afficheById/:id", gym.getGym);
router.delete("/delete/:id", gym.deleteGym);
router.put("/update/:id", gym.updateGym);
router.get("/get-sorted-desc-price", gym.getSortedGymWithPriceDesc);
router.get("/get-sorted-asc-price", gym.getSortedGymWithPriceAsc);
router.get("/get-gym-par-name", gym.getGymByFullName);
router.get("/get-gym-par-lettre-name?", gym.findGymNameByLettre);
router.get("/afficheByIdUser", userAuth, gym.getAllGymWithIdUser);
router.get("/afficheLastFiveGum", gym.gettLastFiveGym);
router.post("/updateImageGym/:id", uploadGym, gym.postImageGym);
router.get("/imagesGym/:id", gym.getGymImages);

module.exports = router;
