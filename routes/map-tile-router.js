const express = require('express');
const router = express.Router();
const auth = require('../auth');
const AuthController = require('../controllers/auth-controller');
const ContentController = require('../controllers/content-controller-generalized');
const MapEditorController = require('../controllers/map-editor-controller');
const TilesetEditorController = require('../controllers/tileset-editor-controller');
const LayerEditorController = require('../controllers/layer-editor-controller');
const PropertyEditorController = require('../controllers/property-editor-controller');
const TagsController = require('../controllers/tags-editor-controller');

// gets all basic info about a map needed for editing
router.get('/map/:mapId', AuthController.MapVerify, ContentController.getMapById);
// Handles update a map in the database request
router.put('/map/:mapId', AuthController.MapVerify, MapEditorController.updateMap);
// Gets all tilesets for the maps
router.get('/map/:mapId/tilesets', AuthController.MapVerify, TilesetEditorController.getTilesetsForMapById);

// Layer Routes
router.post('/map/:mapId/layer', AuthController.MapVerify, LayerEditorController.createLayer);
router.get('/map/:mapId/layer/:layerId', AuthController.MapVerify, LayerEditorController.getLayer);
router.put('/map/:mapId/layer/:layerId', AuthController.MapVerify, LayerEditorController.updateLayer);
router.delete('/map/:mapId/layer/:layerId', AuthController.MapVerify, LayerEditorController.deleteLayer);

// Property Routes
router.post('/map/:mapId/layer/:layerId/property', AuthController.MapVerify, PropertyEditorController.createProperty);
router.get('/map/:mapId/layer/:layerId/property/:propertyId', AuthController.MapVerify, PropertyEditorController.getProperty);
router.put('/map/:mapId/layer/:layerId/property/:propertyId', AuthController.MapVerify, PropertyEditorController.updateProperty);
router.delete('/map/:mapId/layer/:layerId/property/:propertyId', AuthController.MapVerify, PropertyEditorController.deleteProperty);

// Tag Routes
router.get('/tag/:tagId', TagsController.getTag);
router.post('/tag', TagsController.createTag);
router.put('/tag/:tagId', TagsController.updateTag);
// ability to delete tag is for backend admins only
router.delete('/tag/:tagId', TagsController.deleteTag);

// Tileset Routes
//router.get('/tileset', AuthController.TilesetVerify, TilesetEditorController.getATileset)l
router.put('/tileset/:tilesetId/image', AuthController.TilesetVerify, TilesetEditorController.uploadTilesetImage);
router.put('/tileset/:tilesetId', AuthController.TilesetVerify, TilesetEditorController.updateTileset);
// router.get('/tileset/:tilesetId/export/:versionId', AuthController.TilesetVerify, TilesetEditorController.export) TODO: LATER
router.get('/tileset/:tilesetId/image', AuthController.TilesetVerify, TilesetEditorController.getTilesetImage);


module.exports = router;