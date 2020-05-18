const router = require("express").Router();
const actionDB = require("../data/helpers/actionModel");
const projectDB = require("../data/helpers/projectModel");
const Validator = require("jsonschema").Validator;

/*----------------------------------------------------------------------------*/
/* Sub-routes from projectRouter
/* These routes modify actions using their associated project ID.
/*----------------------------------------------------------------------------*/
router.get("/", async (req, res, next) => {
  try {
    const { id } = req.project;
    res.status(200).json(await projectDB.getProjectActions(id));
  } catch (e) {
    next({ ...e, status: 500, message: "Database error" });
  }
});

router.post("/", validateAction, async (req, res, next) => {
  try {
    const { id: project_id } = req.project;
    const action = await actionDB.insert({ ...req.body, project_id });
    res.status(201).json(action);
  } catch (e) {
    next({ ...e, status: 500, message: "Database error" });
  }
});

// router.put("/:index", validateAction, async (req, res, next) => {
//   try {
//     const { id } = req.project;
//     const { index } = req.params;
//     const actions = await projectDB.getProjectActions(id);
//     const actionID = actions[index] && actions[index].id;
//     if (!actionID) {
//       next({
//         status: 404,
//         message: `Project ${id} has no action at array index ${index}.`,
//       });
//     } else {
//       const updatedAction = await actionDB.update(actionID, {
//         ...req.body,
//         project_id: id,
//       });
//       res.status(200).json(updatedAction);
//     }
//   } catch (e) {
//     next({ ...e, status: 500, message: "Database error" });
//   }
// });

/*----------------------------------------------------------------------------*/
/* Routes from server
/* These routes are used to modify actions using their action ID.
/*----------------------------------------------------------------------------*/
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json(await actionDB.get(id));
  } catch (e) {
    next({ ...e, status: 500, message: "Database error" });
  }
});

router.put("/:id", validateID, validateAction, async (req, res, next) => {
  try {
    const { id } = req.params;
  } catch (e) {
    next({ ...e, status: 500, message: "Database error" });
  }
});

/*----------------------------------------------------------------------------*/
/* Middleware
/*----------------------------------------------------------------------------*/
async function validateID(req, res, next) {
  const { id } = req.params;
  try {
    const action = await actionDB.get(id);
    console.log(action);
    req.action = action;
    action
      ? next()
      : next({ status: 404, message: `${id} is not a valid action ID` });
  } catch (e) {
    next({ ...e, status: 500, message: "Database error" });
  }
}

const actionSchema = {
  type: "object",
  properties: {
    notes: {
      type: "string",
    },
    description: {
      type: "string",
    },
    completed: {
      type: "boolean",
    },
  },
  required: ["notes", "description"],
};

function validateAction(req, res, next) {
  const v = new Validator();
  const { errors } = v.validate(req.body, actionSchema);
  errors.length === 0
    ? next()
    : next({
        status: 400,
        message: "Actions require both 'description' and 'notes' fields.",
        errors,
      });
}

module.exports = router;
