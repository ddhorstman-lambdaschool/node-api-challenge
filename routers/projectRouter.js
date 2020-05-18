const router = require("express").Router();
const actionRouter = require("./actionRouter");
const database = require("../data/helpers/projectModel");
const Validator = require("jsonschema").Validator;

router.get("/", async (req, res) => {
  try {
    res.status(200).json(await database.get());
  } catch (e) {
    next({ e, status: 500, message: "Database error" });
  }
});

router.get("/:id", validateID, (req, res) => {
  res.status(200).json(req.project);
});

router.post("/", validateProject, async (req, res) => {
  try {
    res.status(201).json(await database.insert(req.body));
  } catch (e) {
    next({ e, status: 500, message: "Database error" });
  }
});

router.delete("/:id", validateID, async (req, res, next) => {
  try {
    const { id } = req.project;
    const countRemoved = await database.remove(id);
    countRemoved == 1
      ? res.status(200).json(req.project)
      : next({
          status: 500,
          message: "There was an error while deleting the record.",
        });
  } catch (e) {
    next({ e, status: 500, message: "Database error" });
  }
});

router.put("/:id", validateID, validateProject, async (req, res) => {
  try {
    const { id } = req.project;
    res.status(200).json(await database.update(id, req.body));
  } catch (e) {
    next({ e, status: 500, message: "Database error" });
  }
});

router.use("/:id/actions", validateID, actionRouter);

/*----------------------------------------------------------------------------*/
/* Middleware
/*----------------------------------------------------------------------------*/
async function validateID(req, res, next) {
  const { id } = req.params;
  try {
    req.project = await database.get(id);
    req.project
      ? next()
      : next({ status: 404, message: `${id} is not a valid project ID` });
  } catch (e) {
    next({ e, status: 500, message: "Database error" });
  }
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
  errors.length === 0
    ? next()
    : next({
        status: 400,
        message: "Projects require both 'name' and 'description' fields.",
        e: errors,
      });
}

module.exports = router;
