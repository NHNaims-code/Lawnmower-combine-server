const express = require('express')
const router = express.Router()
const auth = require('../auth')
const ContentController = require('../controllers/content-controller-generalized')

router.post('/map', auth.verify, ContentController.createMap)
router.delete('/map/:mapId', auth.verify, ContentController.deleteMap)
router.get('/map/:mapId', auth.verify, ContentController.getMapById)
// Handles updating a map without needing editing privileges (for updating likes, dislikes, comments)
router.put('/map/:mapId/general', ContentController.updateMapGeneral);

router.post('/tileset', auth.verify, ContentController.createTileset)
router.delete('/tileset/:tilesetId', auth.verify, ContentController.deleteTileset)
router.get('/tileset/:tilesetId', auth.verify, ContentController.getTilesetById)
// Handles updating a tileset without needing editing privileges (for updating likes, dislikes, comments)
router.put('/tileset/:tilesetId/general', ContentController.updateTilesetGeneral);

router.get('/maps', ContentController.getMaps)
router.get('/tilesets', ContentController.getTilesets)

module.exports = router