const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Todo = require('../models/Todo');

const router = express.Router();

const validateTodo = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
];

const validateId = [
  param('id').isMongoId().withMessage('Invalid todo ID')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

router.get('/', async (req, res) => {
  try {
    const { 
      completed, 
      priority, 
      category, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      limit = 50,
      skip = 0
    } = req.query;

    const filter = {};
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    if (priority) {
      filter.priority = priority;
    }
    if (category) {
      filter.category = new RegExp(category, 'i');
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const todos = await Todo.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Todo.countDocuments(filter);

    res.json({
      success: true,
      data: todos,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: (parseInt(skip) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get todos',
      error: error.message
    });
  }
});

router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Todo.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          pending: { $sum: { $cond: ['$completed', 0, 1] } },
          highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
          lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stats',
      error: error.message
    });
  }
});

router.get('/:id', validateId, handleValidationErrors, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get todo',
      error: error.message
    });
  }
});

router.post('/', validateTodo, handleValidationErrors, async (req, res) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;
    
    const todo = new Todo({
      title,
      description,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate) : null
    });

    const savedTodo = await todo.save();

    res.status(201).json({
      success: true,
      message: 'Todo created',
      data: savedTodo
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create todo',
      error: error.message
    });
  }
});

router.put('/:id', 
  validateId, 
  validateTodo, 
  handleValidationErrors, 
  async (req, res) => {
    try {
      const { title, description, priority, category, dueDate, completed } = req.body;
      
      const updateData = {
        title,
        description,
        priority,
        category,
        completed,
        dueDate: dueDate ? new Date(dueDate) : null,
        updatedAt: Date.now()
      };

      const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        updateData,
        { 
          new: true, 
          runValidators: true 
        }
      );

      if (!todo) {
        return res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
      }

      res.json({
        success: true,
        message: 'Todo updated',
        data: todo
      });
    } catch (error) {
      console.error('Update todo error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update todo',
        error: error.message
      });
    }
  }
);

router.patch('/:id/toggle', validateId, handleValidationErrors, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    const updatedTodo = await todo.toggleComplete();

    res.json({
      success: true,
      message: `Todo ${updatedTodo.completed ? 'completed' : 'active'}`,
      data: updatedTodo
    });
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle todo',
      error: error.message
    });
  }
});

router.delete('/:id', validateId, handleValidationErrors, async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.json({
      success: true,
      message: 'Todo deleted',
      data: todo
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete todo',
      error: error.message
    });
  }
});

router.delete('/', async (req, res) => {
  try {
    const result = await Todo.deleteMany({ completed: true });

    res.json({
      success: true,
      message: `${result.deletedCount} todos deleted`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('Delete completed todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete todos',
      error: error.message
    });
  }
});

module.exports = router; 