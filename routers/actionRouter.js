const router = require("express").Router();
const actionDB = require("../data/helpers/actionModel");
const projectDB = require("../data/helpers/projectModel");
const { Validator } = require("jsonschema");
const { AppError, catchAsync } = require("../errors");

const validateID = catchAsync(validateActionID);

/*----------------------------------------------------------------------------*/
/* Sub-routes from projectRouter
/* These routes modify actions using their associated project ID.
/*----------------------------------------------------------------------------*/
router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const { id } = req.project;
    res.status(200).json(await projectDB.getProjectActions(id));
  })
);

router.post(
  "/",
  validateAction,
  catchAsync(async (req, res, next) => {
    const { id: project_id } = req.project;
    const action = await actionDB.insert({ ...req.body, project_id });
    res.status(201).json(action);
  })
);

/*----------------------------------------------------------------------------*/
/* Direct routes from server
/* These routes are used to manage actions using their action ID.
/*----------------------------------------------------------------------------*/
router.get("/:id", validateID, (req, res) => {
  res.status(200).json(req.action);
});

router.put(
  "/:id",
  validateID,
  validateAction,
  catchAsync(async (req, res, next) => {
    const { id, project_id } = req.action;
    const updatedAction = await actionDB.update(id, {
      ...req.body,
      project_id,
    });
    res.status(200).json(updatedAction);
  })
);

router.delete(
  "/:id",
  validateID,
  catchAsync(async (req, res, next) => {
    const { id } = req.action;
    const countRemoved = await actionDB.remove(id);
    countRemoved == 1
      ? res.status(200).json(req.action)
      : next(
          new AppError("There was an error while deleting the record.", 500)
        );
  })
);

/*----------------------------------------------------------------------------*/
/* Middleware
/*----------------------------------------------------------------------------*/
async function validateActionID(req, res, next) {
  const { id } = req.params;

  req.action = await actionDB.get(id);
  req.action
    ? next()
    : next(new AppError(`${id} is not a valid action ID`, 404));
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
  errors.length !== 0 ? next(errors) : next();
}

module.exports = router;
