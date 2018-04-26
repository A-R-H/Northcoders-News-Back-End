const express = require("express");

const { sendUsers } = require("../../controllers/users");

const router = express.Router();

router.get("/:username", sendUsers);

module.exports = router;
