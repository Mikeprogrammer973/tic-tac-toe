import e from 'express'
import auth_guardMiddleware from '../middlewares/auth.middleware.js'
import { update_profile_image, update_profile, get_global_ranking, update_profile_privacy, generate_2fa_secret, verify_2fa_code, disable_2fa } from '../controllers/user.controller.js'

const router = e.Router()

router.post("/update-profile", auth_guardMiddleware, update_profile)
router.post("/update-profile-image", auth_guardMiddleware, update_profile_image)
router.post("/update-profile-privacy", auth_guardMiddleware, update_profile_privacy)

router.get('/generate-2fa-secret', auth_guardMiddleware, generate_2fa_secret)
router.post('/verify-2fa-code', auth_guardMiddleware, verify_2fa_code)
router.get('/disable-2fa-auth', auth_guardMiddleware, disable_2fa)

router.get('/global-ranking', auth_guardMiddleware, get_global_ranking)

export default router