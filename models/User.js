const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại'],
      unique: true,
      trim: true,
      match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ']
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
    },
    username: {
      type: String,
      required: [true, 'Vui lòng nhập username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username phải có ít nhất 3 ký tự'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username chỉ chứa chữ cái, số và dấu gạch dưới']
    },
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
      trim: true,
      minlength: [2, 'Tên phải có ít nhất 2 ký tự']
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
      select: false // Không trả về password khi query
    },
    role: {
      type: String,
      enum: {
        values: ['buyer', 'seller', 'manager'],
        message: 'Role phải là buyer, seller hoặc manager'
      },
      default: 'buyer'
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved'],
        message: 'Status phải là pending hoặc approved'
      },
      default: 'approved'
    },
    // Các trường bổ sung - không bắt buộc
    height: {
      type: Number,
      min: [0, 'Chiều cao phải lớn hơn 0'],
      max: [300, 'Chiều cao không hợp lệ'],
      required: false
    },
    weight: {
      type: Number,
      min: [0, 'Cân nặng phải lớn hơn 0'],
      max: [500, 'Cân nặng không hợp lệ'],
      required: false
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: 'Giới tính phải là male, female hoặc other'
      },
      required: false
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, 'Địa chỉ không được vượt quá 500 ký tự'],
      required: false
    }
  },
  {
    timestamps: true // Tự động thêm createdAt và updatedAt
  }
);

// Middleware: Hash password trước khi lưu
userSchema.pre('save', async function (next) {
  // Chỉ hash nếu password được modify
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method: So sánh password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Lỗi khi so sánh mật khẩu');
  }
};

// Method: Ẩn password khi convert sang JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
