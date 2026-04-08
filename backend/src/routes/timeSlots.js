// backend/routes/timeSlots.ts (or similar)
app.post('/api/timeslots/:id/confirm', authenticateTeacher, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // from auth middleware
    
    // Verify teacher owns this slot
    const slot = await TimeSlot.findById(id);
    if (!slot || slot.teacher_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Update confirmation
    slot.teacher_confirmed = true;
    slot.confirmed_at = new Date();
    await slot.save();
    
    res.json({ success: true, slot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});