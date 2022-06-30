const router = require("express").Router();
const verify = require("./verifyToken");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const user = require("../model/User");
const { json } = require("express");

//UPDATE
router.put("/update/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      console.log(updatedUser);
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json(`You can only update your account`);
  }
});

//DELETE
router.delete("/delete/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      console.log(`User Deleted!`);
      res.status(200).json(`User Deleted!`);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json(`You can only update your account`);
  }
});

//GET
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, createdAt, ...info } = user._doc;
    console.log(user);
    res.status(200).json({ ...info });
  } catch (err) {
    res.status(500).json(err);
  }
});

//FOLLOW A USER
router.post("/follow/:id", verify, async (req, res) => {
  if (req.user.id !== req.params.id) {
    const followingUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!followingUser.followers.includes(req.user.id)) {
      await currentUser.updateOne({
        $push: { followings: req.params.id },
      });
      await followingUser.updateOne({
        $push: { followers: req.user.id },
      });

      res.status(200).json(`User has been followed!`);
    } else {
      console.log(`You already followed this user!`);
      res.status(403).json(`You already followed this user!`);
    }
  } else {
    console.log(`You can not follow yourself!`);
    res.status(403).json(`You can not follow yourself!`);
  }
});

//UNFOLLOW A USER
router.post("/unfollow/:id", verify, async (req, res) => {
  if (req.user.id !== req.params.id) {
    const unFollowingUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (unFollowingUser.followers.includes(req.user.id)) {
      await currentUser.updateOne({
        $pull: { followings: req.params.id },
      });
      await unFollowingUser.updateOne({
        $pull: { followers: req.user.id },
      });

      res.status(200).json(`User has been unfollowed!`);
    } else {
      console.log(`You don't follow this user!`);
      res.status(403).json(`You already followed this user!`);
    }
  } else {
    console.log(`You can not follow yourself!`);
    res.status(403).json(`You can not follow yourself!`);
  }
});

module.exports = router;
