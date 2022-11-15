const databaseManager = require("./AWSManager/AWStagseditor-manager");

function createTag(req, res) {
    const {name} = req.body;
    if (!name) {
        return res.status(400).json({
            success: false,
            errorMessage: 'Improperly formatted request'
        });
    }
    databaseManager.createTag(name).then((newTag) => {
        if (newTag) {
            return res.status(200).json({
                success: true,
                tag: newTag
            });
        } else {
            return res.status(400).json({
                success:false,
                errorMessage: "Unable to create tag"
            });
        }
    });
}

function getTag(req, res) {
    if (!req.params.tagId) {
        return res.status(400).json({
            success: false,
            errorMessage: 'Improperly formatted request'
        });
    } else {
        databaseManager.getTag(req.params.tagId).then((tag) => {
            if (tag) {
                return res.status(200).json({
                    success: true,
                    tag: tag
                });
            } else {
                return res.status(400).json({
                    success:false,
                    errorMessage: "Unable to find tag"
                });
            }
        });  
    }
}

function updateTag(req, res) {
    const {name} = req.body;
    if (!req.params.tagId || !name) {
        return res.status(400).json({
            success: false,
            errorMessage: 'Improperly formatted request'
        });
    } else {
        databaseManager.updateTag(name, req.params.tagId).then((tag) => {
            if (tag) {
                return res.status(200).json({
                    success: true,
                    tag: tag
                });
            } else {
                return res.status(400).json({
                    success: false,
                    errorMessage: "Unable to update tag"
                });
            }
        });
    }
}

function deleteTag(req, res) {
    if (!req.params.tagId) {
        return res.status(400).json({
            success: false,
            errorMessage: 'Improperly formatted request'
        });
    } else {
        databaseManager.deleteTag(req.params.tagId).then((tag) => {
            if (tag) {
                return res.status(200).json({
                    success: true,
                    tag: tag
                });
            } else {
                return res.status(400).json({
                    success:false,
                    errorMessage: 'Unable to delete tag'
                });
            }
        });
    }
}

module.exports = {
    createTag,
    getTag,
    updateTag,
    deleteTag
}
