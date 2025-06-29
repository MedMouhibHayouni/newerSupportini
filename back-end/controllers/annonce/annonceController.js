const { Op, where } = require("sequelize");
const {
  annonce,
  trainingday,
  planing,
  coach,
  trainer,
  user,
  suiviModel,
} = require("../../models");
const parse = require("date-fns/parse");
const add = require("date-fns/add");
const { Json } = require("sequelize/lib/utils");
const { serializeUser } = require("../../utils/Auth");
const endOfToday = require("date-fns/endOfToday");
//create annonce

const createAnnonce = async (req, res) => {
    const idc = req.user.id;
    
    if (!req.files || !req.files[0]) {
        return res.status(400).json({ error: "Image is required" });
    }

    let dates;
    try {
        dates = JSON.parse(req.body.trainingday);
        if (!Array.isArray(dates)) {
            throw new Error("Training days must be an array");
        }
    } catch (err) {
        return res.status(400).json({ error: "Invalid trainingday JSON: " + err.message });
    }

    const { titre, discipline, prix, type, description, ville, capacite, rue, codePostal, dateDebut, dateFin } = req.body;

    // Validate required fields
    if (!titre || !discipline || !prix || !type || !description || !ville || !capacite || !rue || !codePostal || !dateDebut || !dateFin) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const coachbyid = await coach.findOne({ where: { fk_idUser: idc } });
        if (!coachbyid) {
            return res.status(404).json({ error: "Coach not found" });
        }

        const imagesss = req.files[0].filename;

        const newAnnonce = await annonce.create({
            titre, 
            discipline, 
            prix, 
            type, 
            description, 
            ville, 
            image: imagesss,
            capacite, 
            rue, 
            codePostal, 
            dateDebut, 
            dateFin, 
            fk_idcoach: coachbyid.id
        });

        // Create training days
        const trainingDayPromises = dates.map(day => {
            return trainingday.create({
                day: parse(day.day, 'yyyy-MM-dd', new Date()),
                heureDebut: day.heureDebut,
                heureFin: day.heureFin,
                fk_idannonce: newAnnonce.id,
                discipline: newAnnonce.discipline,
                fk_idcoach: coachbyid.id
            });
        });

        await Promise.all(trainingDayPromises);

        return res.status(201).json({ 
            message: "Annonce created successfully", 
            annonce: newAnnonce 
        });

    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ 
            error: "Internal server error",
            details: error.message 
        });
    }
};

const participer = async (req, res, next) => {
  const { idAnnonce } = req.params;
  console.log(idAnnonce);

  const ann = await annonce.findOne({
    where: {
      id: idAnnonce,
    },
  });

  const iduser = req.user.id;
  console.log(iduser);

  const train = await trainer.findOne({
    where: { fk_idUser: iduser },
  });

  console.log(train);

  try {
    // var date_ob = new Date();
    // var day = ("0" + date_ob.getDate()).slice(-2);
    // var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // var year = date_ob.getFullYear();
    // var date = year + "-" + month + "-" + day;

    const idEntr = train.id;
    const nomEntr = req.user.nom;
    const prenomEntr = req.user.prenom;
    const coachId = ann.fk_idcoach;

    var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();

    var date = year + "-" + month + "-" + day;
    heigh = train.taille;
    weigh = train.poids;
    bmi = (weigh / ((heigh * heigh) / 10000)).toFixed(2);

    await suiviModel.create({
      nom: nomEntr,
      prenom: prenomEntr,
      age: train.age,
      poids: weigh,
      taille: heigh,
      imc: bmi,
      date_suivi: date,
      fk_id_entr: idEntr,
      fk_id_coach: coachId,
    });
    await eventsModel.create({
      start: ann.dateDebut,
      end: ann.dateFin,
      title: ann.titre,
      fk_idtrainer: train.id,
      fk_idannonce: ann.id,
      fk_idcoach: ann.fk_idcoach,
    });

    const trainingdays = await trainingday.findAll({
      where: { fk_idannonce: idAnnonce },
    });

    for (const el of trainingdays) {
      // await planing.create({
      //     CoachingDate: el.day,
      //     heureDebut: el.heureDebut,
      //     heureFin: el.heureFin,
      //     discipline: el.discipline,
      //     fk_idcoach: el.fk_idcoach,
      //     fk_idannonce: idAnnonce,
      //     fk_idtrainer: train.id
      // }).catch(err =>
      //     console.log(err))
    }
    res.status(200).json("created");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

///////////////////////////////////////////////////////////////////
//tous les annonces
const getAllAnnonces = async (req, res, next) => {
  try {
    // Debug: Check raw data first
    const allAnnonces = await annonce.findAll();
    console.log('Raw annonces from DB:', allAnnonces);
    
    // Get all active coaches
    const activeCoaches = await coach.findAll({
      include: [{
        model: user,
        where: { status: 1 },
        attributes: []
      }]
    });
    console.log('Active coaches:', activeCoaches.map(c => c.id));

    // Get annonces for active coaches with capacity > 0
    const filteredAnnonces = await annonce.findAll({
      where: {
        fk_idcoach: activeCoaches.map(c => c.id),
        capacite: { [Op.gt]: 0 }
      },
      include: [{
        model: coach,
        include: [{
          model: user,
          attributes: ['id', 'nom', 'prenom']
        }]
      }]
    });

    console.log('Filtered annonces:', filteredAnnonces);
    res.status(200).json({ annonces: filteredAnnonces });
    
  } catch (error) {
    console.error("Complete error stack:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
//annonce by id
const getOneAnnonce = async (req, res) => {
  try {
    const { annonceId } = req.params;
    const annonceData = await annonce.findOne({
      where: { id: annonceId },
    });
    if (!annonceData) {
      throw new Error("User not found");
    }
    res.status(200).json({
      annonceData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
//delete
const deleteAnnonce = async (req, res) => {
  try {
    const { annonceId } = req.params;
    const deleted = await annonce.destroy({
      where: { id: annonceId },
    });

    if (!deleted) {
      throw new Error("Annonce not found");
    }
    res.status(204).send("annonce deleted");
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
//upDate
const updateAnnonce = async (req, res) => {
  try {
    const { annonceId } = req.params;
    const updated = await annonce.update(req.body, {
      where: { id: annonceId },
    });
    console.log(updated);
    if (updated) {
      const updated = await annonce.findOne({ where: { id: annonceId } });
      res.status(200).json({ updated });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  // try {
  //     const { annonceId } = req.params;
  //     const [updated] = await annonce.update(req.body, {
  //         where: { id: annonceId },
  //     });
  //     if (updated) {
  //         const updatedannonce = await annonce.findOne({ where: { id: annonceId } });
  //         res.status(200).json({
  //             annonce: updatedannonce,
  //         });
  //     }
  //     throw new Error("annonce not found");
  // } catch (error) {
  //     res.status(500).json({
  //         error: error.message,
  //     });
  // }
};
////////////////////
const incremeterInscription = async (req, res) => {
  try {
    const { annonceId } = req.params;
    const incrimented = await annonce.findOne({
      where: { id: annonceId },
    });
    incrimented.capacite--;
    incrimented.save();
    if (!incrimented) {
      throw new Error("Annonce not found");
    }
    res.status(200).json({
      incrimented,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
/////////sort by price descendant
const getSortedByPriceDesc = async (req, res, next) => {
  try {
    const annonceByPrice = await annonce.findAll({
      order: [["prix", "DESC"]],
    });

    res.status(200).json({ annonceByPrice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

///////////////  sort by price ascendante
const getSortedByPriceAsc = async (req, res, next) => {
  try {
    const ann = await annonce.findAll({
      order: [["prix", "ASC"]],
    });
    res.status(200).json({ ann });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

///// find by ville
const getByVille = async (req, res, next) => {
  try {
    const { ville } = req.body;
    const annoncee = await annonce.findAll({
      where: {
        ville: ville,
      },
    });
    res.status(200).json({ annoncee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//////////////////
const getAnnonceByCoach = async (req, res) => {
  try {
    const currentUser = await coach.findOne({
      where: { fk_idUser: req.user.id },
    });
    if (!currentUser) {
      return res.status(400).json("not found");
    }
    const idCoach = currentUser.id;

    const mesCoaching = await annonce.findAll({
      where: { fk_idcoach: idCoach },
    });
    res.status(200).json({ mesCoaching });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const gettoptenAnnonce = async (req, res, next) => {
  let tenAnnonce = [];
  try {
    let annonces = await annonce.findAll({});

    if (annonces.length == 0) {
      return res.status(400).json("not found");
    }
    if (annonces.length <= 6) {
      tenAnnonce = annonces.reverse();
      return res.status(200).json({ tenAnnonce });
    }

    annonces = annonces.reverse();
    let h = 6;
    let i = 0;
    while (i < h) {
      tenAnnonce.push(annonces[i]);
      i++;
    }

    return res.status(200).json({ tenAnnonce: tenAnnonce.reverse() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const filter = async (req, res, next) => {
  const ville = req.body.ville;
  const discipline = req.body.discipline;
  const type = req.body.type;
  console.log(req.body);
  try {
    //     const cherche=[]
    //     const annonces = await annonce.findAll(
    //         {where :{
    //                 ville:ville
    // } },
    //     );
    //     res.status(200).json({annonces})

    if (type === "" && discipline === "") {
      const annonces = await annonce.findAll({
        where: { ville: ville },
      });

      return res.status(200).json({ annonces });
    } else if (ville === "" && discipline === "") {
      const annonces = await annonce.findAll({
        where: {
          type: type,
        },
      });

      return res.status(200).json({ annonces });
    } else if (ville === "" && type === "") {
      const annonces = await annonce.findAll({
        where: {
          discipline: discipline,
        },
      });

      return res.status(200).json({ annonces });
    } else if (discipline === "") {
      const annonces = await annonce.findAll({
        where: {
          type: type,
          ville: ville,
        },
      });
      console.log(discipline === "");
      return res.status(200).json({ annonces });
    } else if (type === "") {
      const annonces = await annonce.findAll({
        where: {
          ville: ville,
          discipline: discipline,
        },
      });

      return res.status(200).json({ annonces });
    } else if (ville === "") {
      const annonces = await annonce.findAll({
        where: {
          type: type,
          discipline: discipline,
        },
      });

      return res.status(200).json({ annonces });
    } else {
      const annonces = await annonce.findAll({
        where: {
          type: type,
          discipline: discipline,
        },
      });
      console.log("else");
      return res.status(200).json({ annonces });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
const getTrainerByAnnonce = async (req, res) => {
  try {
    const { annonceId } = req.params;
    let allIdTrainer = await planing.findAll({
      where: { fk_idannonce: annonceId },
      attributes: ["fk_idtrainer"],
    });

    let tableIdTrainer = [];
    for (const el of allIdTrainer) {
      tableIdTrainer.push(el.fk_idtrainer);
    }
    tableIdTrainer = tableIdTrainer.filter(onlyUnique);
    //////unique id trainer
    tableIsUsers = [];
    for (const elm of tableIdTrainer) {
      const isUsers = await trainer.findOne({
        where: { id: elm },
        attributes: ["fk_idUser"],
      });
      tableIsUsers.push(isUsers.fk_idUser);
      console.log(typeof isUsers.fk_idUser);
    }
    let users = [];
    for (const idies of tableIsUsers) {
      const use = await user.findOne({
        where: {
          id: idies,
        },
      });
      users.push(use);
    }

    return res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getCoachInformationByIdAnnonce = async (req, res, next) => {
  const { annonceId } = req.params;
  const annonceData = await annonce.findOne({
    where: { id: annonceId },
  });

  const idC = annonceData.fk_idcoach;
  const coachOfAnnonce = await coach.findOne({
    where: {
      id: idC,
    },
  });
  const idUser = coachOfAnnonce.fk_idUser;
  const CoachInformation = await user.findOne({
    where: {
      id: idUser,
    },
  });

  res.status(200).json({
    CoachInformation,
  });
};

module.exports = {
  createAnnonce,
  getAllAnnonces,
  getOneAnnonce,
  deleteAnnonce,
  updateAnnonce,
  getSortedByPriceDesc,
  getSortedByPriceAsc,
  getByVille,
  incremeterInscription,
  getAnnonceByCoach,
  participer,
  gettoptenAnnonce,
  filter,
  getTrainerByAnnonce,
  getCoachInformationByIdAnnonce,
};
