const router = require("express").Router();
const actionRouter = require("./actionRouter");
const database = require("../data/helpers/projectModel");
const { Validator } = require("jsonschema");
const { AppError, catchAsync } = require("../errors");

const validateID = catchAsync(validateProjectID);

router.get(
  "/",
  catchAsync(async (req, res) => {
    res.status(200).json(await database.get());
  })
);

router.get("/:id", validateID, (req, res) => {
  res.status(200).json(req.project);
});

router.post(
  "/",
  validateProject,
  catchAsync(async (req, res) => {
    res.status(201).json(await database.insert(req.body));
  })
);

router.delete(
  "/:id",
  validateID,
  catchAsync(async (req, res, next) => {
    const { id } = req.project;
    const countRemoved = await database.remove(id);
    countRemoved == 1
      ? res.status(200).json(req.project)
      : next(
          new AppError("There was an error while deleting the record.", 500)
        );
  })
);

router.put(
  "/:id",
  validateID,
  validateProject,
  catchAsync(async (req, res, next) => {
    const { id } = req.project;
    res.status(200).json(await database.update(id, req.body));
  })
);

router.use("/:id/actions", validateID, actionRouter);

/*----------------------------------------------------------------------------*/
/* Middleware
/*----------------------------------------------------------------------------*/
async function validateProjectID(req, res, next) {
  const { id } = req.params;
  req.project = await database.get(id);
  req.project
    ? next()
    : next(new AppError(`${id} is not a valid project ID`, 404));
}

const projectSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
    completed: {
      type: "boolean",
    },
  },
  required: ["name", "description"],
};

function validateProject(req, res, next) {
  const v = new Validator();
  const { errors } = v.validate(req.body, projectSchema);
  errors.length !== 0 ? next(errors) : next();
}

module.exports = router;
