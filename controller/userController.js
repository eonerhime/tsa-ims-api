const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "asdf123",
    "role": "admin",
    "phone": "2348022223333"
    "_id": "69d5f35bcb85d89c8739595b",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDVmMzViY2I4NWQ4OWM4NzM5NTk1YiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTYyOTU5OCwiZXhwIjoxNzc1NzE1OTk4fQ.YtpOLBXRNxHKKGvv16m8ZETt-OU0yrCkC2T5ydMN15E",
  },
  {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "storekeeper",
    "phone": "234802223334",
    "_id": "69d5f43ff73f8dbaf4d7a1dc",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDVmNDNmZjczZjhkYmFmNGQ3YTFkYyIsInJvbGUiOiJzdG9yZWtlZXBlciIsImlhdCI6MTc3NTYyOTYxNywiZXhwIjoxNzc1NzE2MDE3fQ.hvmLNiTIG1VAUWY-PMGWAlUrzwPDmGfcyrZBP6rg3UQ",
  },
  {
    "name": "Kid Doe",
    "email": "kid.doe@example.com",
    "role": "salesperson",
    "phone": "234802223335",
    "_id": "69d5f49217d42e8558ded0df",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDVmNDkyMTdkNDJlODU1OGRlZDBkZiIsInJvbGUiOiJzYWxlc3BlcnNvbiIsImlhdCI6MTc3NTYyOTU2MSwiZXhwIjoxNzc1NzE1OTYxfQ.vXh6SPKEfCwLz8niWxxVWKO83tfyqCY6-1P2nfDKVwQ",
  }
*/
// Create user
const createUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "No user data parsed" });
    }

    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({
        message: "Name, email, password, role and phone are required",
      });
    }

    // Check if new user's email and phone already exists

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "User with email already exists" });
    }

    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res
        .status(400)
        .json({ message: "User with phone already exists" });
    }

    // Hash user's password before creating user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Failed to create user, ${error.message}` });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwrod
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (!users) {
      res.status(400).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: "Error retrieving user" });
  }
};

// Find user
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(400).json({ message: "No user found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;

    if (!name && !role) {
      return res.status(400).json({
        message: "At least one of name or role must be provided",
      });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (role) updateFields.role = role;

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  login,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
