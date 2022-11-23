const { Router } = require("express")
const router = Router()
const authControllers = require("../controllers/authControllers")

/* Sign up route */
router.post('/signup', authControllers.signup)

/* Login route */
router.post('/login', authControllers.login)


module.exports = router