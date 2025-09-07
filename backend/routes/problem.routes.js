

const problemRouter = Router()

//create problem
//fetch problem
//update problem
//delete problem

//requires admin access only
problemRouter.post("/create",)
problemRouter.patch("/:id",) 
problemRouter.delete("/:id",)


//user can access
problemRouter.get("/:id",)  // to fetch individual problem
problemRouter.get("/")   // to fetch al problems
problemRouter.get("/user")  // to get total no of solved problem