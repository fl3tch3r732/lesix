import { timeSlotModels } from '../models/timeSlotModels.js';

export const timeSlotControllers = {
  // Get all time slots
  getAllTimeSlots: async (req, res) => {
    try {
      console.log('Fetching all time slots...');
      const timeSlots = await timeSlotModels.getAllTimeSlots();
      console.log('Time slots fetched:', timeSlots);
      res.json(timeSlots);
    } catch (error) {
      console.error('Error getting time slots:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get time slot by ID
  getTimeSlotById: async (req, res) => {
    try {
      const { id } = req.params;
      const timeSlot = await timeSlotModels.getTimeSlotById(id);
      
      if (!timeSlot) {
        return res.status(404).json({ error: 'Time slot not found' });
      }
      
      res.json(timeSlot);
    } catch (error) {
      console.error('Error getting time slot:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create new time slot
  createTimeSlot: async (req, res) => {
    try {
      const timeSlotData = req.body;
      console.log('Received time slot creation request:', timeSlotData);
      
      const timeSlot = await timeSlotModels.createTimeSlot(timeSlotData);
      console.log('Time slot created successfully:', timeSlot);
      
      res.status(201).json(timeSlot);
    } catch (error) {
      console.error('Error creating time slot:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update time slot
  updateTimeSlot: async (req, res) => {
    try {
      const { id } = req.params;
      const timeSlotData = req.body;
      const timeSlot = await timeSlotModels.updateTimeSlot(id, timeSlotData);
      
      if (!timeSlot) {
        return res.status(404).json({ error: 'Time slot not found' });
      }
      
      res.json(timeSlot);
    } catch (error) {
      console.error('Error updating time slot:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete time slot
  deleteTimeSlot: async (req, res) => {
    try {
      const { id } = req.params;
      const timeSlot = await timeSlotModels.deleteTimeSlot(id);
      
      if (!timeSlot) {
        return res.status(404).json({ error: 'Time slot not found' });
      }
      
      res.json({ message: 'Time slot deleted successfully' });
    } catch (error) {
      console.error('Error deleting time slot:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  ,
  // Teacher confirms presence for a time slot
  confirmTimeSlot: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherId = req.user && req.user.userId;

      if (!teacherId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const confirmed = await timeSlotModels.confirmTimeSlot(id, teacherId);

      if (!confirmed) {
        return res.status(404).json({ error: 'Time slot not found or you are not the assigned teacher' });
      }

      res.json({ message: 'Time slot confirmed', timeSlot: confirmed });
    } catch (error) {
      console.error('Error confirming time slot:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}; 