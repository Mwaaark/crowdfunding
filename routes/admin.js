const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAdmin } = require("../middleware");

router.get("/", isLoggedIn, isAdmin, admin.index);

router.get(
  "/projects/pending",
  isLoggedIn,
  isAdmin,
  catchAsync(admin.showPending)
);

router.put(
  "/projects/pending/approve/:id",
  isLoggedIn,
  isAdmin,
  catchAsync(admin.approveProject)
);

router.put(
  "/projects/pending/decline/:id",
  isLoggedIn,
  isAdmin,
  catchAsync(admin.declineProject)
);

router.get(
  "/projects/seeding",
  isLoggedIn,
  isAdmin,
  catchAsync(admin.showSeeding)
);

router.put(
  "/projects/seeding/end/:id",
  isLoggedIn,
  isAdmin,
  catchAsync(admin.endProject)
);

router.get(
  "/projects/burgeoning",
  isLoggedIn,
  isAdmin,
  catchAsync(admin.showBurgeoning)
);

router.get(
  "/projects/declined",
  isLoggedIn,
  isAdmin,
  catchAsync(admin.showDeclined)
);

router.put(
  "/projects/declined/move-to-pending/:id",
  isLoggedIn,
  isAdmin,
  catchAsync(admin.moveToPending)
);

router.get("/users", isLoggedIn, isAdmin, catchAsync(admin.showUsers));

module.exports = router;
