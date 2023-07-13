const express = require('express');
const router = express.Router();

const TagController = require("../Controllers/tag");

router.get('/', TagController.get_all);

router.post('/', TagController.create_tag);

router.get('/:tagId', TagController.get_tag);

router.patch('/:tagId', TagController.update_tag);

router.delete('/:tagId', TagController.delete_tag);

module.exports = router; 