const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Todo title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    trim: true,
    default: 'general'
  },
  dueDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

todoSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.completed) return false;
  return new Date() > this.dueDate;
});

todoSchema.statics.getByStatus = function(completed) {
  return this.find({ completed }).sort({ createdAt: -1 });
};

todoSchema.statics.getByPriority = function(priority) {
  return this.find({ priority }).sort({ createdAt: -1 });
};

todoSchema.methods.toggleComplete = function() {
  this.completed = !this.completed;
  return this.save();
};

todoSchema.index({ completed: 1, createdAt: -1 });
todoSchema.index({ priority: 1, createdAt: -1 });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo; 