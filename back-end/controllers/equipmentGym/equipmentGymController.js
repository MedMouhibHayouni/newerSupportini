const { materialsalle, sallesport } = require("../../models");

const { string } = require("yup");

// add equipment //
const createEquipmentGym = async (req, res, next) => {
    try {
        const { id } = req.params; // Gym ID
        const { nomMaterial, specialite, quantite, description } = req.body;

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        const newEquipmentGym = await materialsalle.create({
            nomMaterial,
            specialite,
            quantite,
            description,
            imageVitrine: req.file.filename,
            fk_idSalle: id
        });

        return res.status(201).json({ 
            message: "Materiel ajouté avec succès", 
            equipment: newEquipmentGym 
        });

    } catch (error) {
        console.error("Error creating equipment:", error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
//delete equipmnt //
const deleteEquipmentGym = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await materialsalle.destroy({
      where: { id },
    });
    if (!deleted) {
      res.status(404).json({ message: "Equipment n'existe pas" });
    }
    res.status(204).json({ message: "Equipment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update EquipmentGym //
const updateEquipmentGym = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await materialsalle.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updated = await materialsalle.findOne({ where: { id } });
      res.status(200).json({ updated });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getEquipementGym = async (req, res, next) => {
  try {
    const { id } = req.params;
    const equipement = await materialsalle.findAll(req.body, {
      where: { id },
    });
    if (!equipement) {
      return res.status(404).json({ message: "equipement n'existe pas" });
    }
    return res.status(200).json({ message: "existe", equipement });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  createEquipmentGym,
  deleteEquipmentGym,
  updateEquipmentGym,
  getEquipementGym,
};
