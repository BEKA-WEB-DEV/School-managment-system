import Parent from '../../models/Parent.js';
import { DatabaseError, ValidationError } from '../../middleware/errorHandler.js';

export const createParent = async (req, res, next) => {
  try {
    const parentData = req.body;
    
    // Validate required fields
    const requiredFields = [
      'parent_id', 'user_id', 'father_first_name', 'father_last_name',
      'mother_first_name', 'mother_last_name', 'relationship'
    ];
    const missingFields = requiredFields.filter(field => !parentData[field]);
    
    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Create parent
    const parent = await Parent.create(parentData);
    
    res.status(201).json(parent);
  } catch (err) {
    next(new DatabaseError('Failed to create parent', err));
  }
};

export const getParentById = async (req, res, next) => {
  try {
    const { parentId } = req.params;
    const parent = await Parent.findById(parentId);

    if (!parent) {
      return res.status(404).json({ error: 'Parent not found' });
    }

    res.json(parent);
  } catch (err) {
    next(new DatabaseError('Failed to fetch parent', err));
  }
};

export const getParentChildren = async (req, res, next) => {
  try {
    const { parentId } = req.params;
    const children = await Parent.getChildren(parentId);

    res.json({
      count: children.length,
      children
    });
  } catch (err) {
    next(new DatabaseError('Failed to fetch parent children', err));
  }
};

export const updateParent = async (req, res, next) => {
  try {
    const { parentId } = req.params;
    const updates = req.body;

    // Validate allowed fields
    const allowedFields = [
      'phone', 'email', 'address', 'relationship',
      'father_middle_name', 'mother_middle_name'
    ];
    const invalidFields = Object.keys(updates).filter(f => !allowedFields.includes(f));

    if (invalidFields.length > 0) {
      throw new ValidationError(`Invalid fields for update: ${invalidFields.join(', ')}`);
    }

    // Update parent
    const [result] = await pool.execute(
      'UPDATE parents SET ? WHERE parent_id = ?',
      [updates, parentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Parent not found' });
    }

    const updatedParent = await Parent.findById(parentId);
    res.json(updatedParent);
  } catch (err) {
    next(new DatabaseError('Failed to update parent', err));
  }
};