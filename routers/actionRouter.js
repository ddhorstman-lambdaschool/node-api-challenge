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
    next({ e, status: 500, message: "Database error" });
  }
});

router.post("/", validateAction, async (req, res, next) => {
  try {
    const { id: project_id } = req.project;
    const action = await actionDB.insert({ ...req.body, project_id });
    res.status(201).json(action);
  } catch (e) {
    next({ e, status: 500, message: "Database error" });
  }
});

/*----------------------------------------------------------------------------*/
/* Direct routes from server
/* These routes are used to manage actions using their action ID.
/*----------------------------------------------------------------------------*/
router.get("/:id", validateID, (req, res) => {
  res.status(200).json(req.action);
});

router.put("/:id", validateID, validateAction, async (req, res, next) => {
  try {
    const { id, project_id } = req.action;
    const updatedAction = await actionDB.update(id, {
      ...req.body,
      project_id,
    });
    res.status(200).json(updatedAction);
  } catch (e) {
    next({ e, status: 500, message: "Database error" });
  }
});

router.delete("/:id", validateID, async (req, res, next) => {
  try {
    const { id } = req.action;
    const countRemoved = await actionDB.remove(id);
    countRemoved == 1
      ? res.status(200).json(req.action)
      : next({
          status: 500,
          message: "There was an error while deleting the record.",
        });
  } catch (e) {
    next({ e, status: 500, message: "Database error" });
  }
});

/*----------------------------------------------------------------------------*/
/* Middleware
/*----------------------------------------------------------------------------*/
async function validateID(req, res, next) {
  const { id } = req.params;
  try {
    req.action = await actionDB.get(id);
    req.action
      ? next()
      : next({ status: 404, message: `${id} is not a valid action ID` });
  } catch (e) {
    next({ e, status: 500, message: "Database error" });
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
        e: errors,
      });
}

module.exports = router;
