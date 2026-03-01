import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Clock,
  Users,
  CalendarDays,
  TrendingUp
} from 'lucide-react';

const ScheduleSlots = () => {
  // Generate dummy slots data for next 14 days
  const generateDummySlots = () => {
    const slots = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    let slotId = 1;
    
    // Generate slots for next 14 days
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Add 1-3 slots per day (including weekends)
      const numSlots = Math.floor(Math.random() * 3) + 1;
      const times = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
      const durations = [30, 45, 60];
      
      // Use a set to avoid duplicate times on same day
      const usedTimes = new Set();
      
      for (let j = 0; j < numSlots; j++) {
        let time;
        do {
          time = times[Math.floor(Math.random() * times.length)];
        } while (usedTimes.has(time));
        usedTimes.add(time);
        
        const duration = durations[Math.floor(Math.random() * durations.length)];
        const maxStudents = 5;
        const students = Math.floor(Math.random() * (maxStudents + 1));
        
        slots.push({
          id: slotId++,
          date: dateStr,
          time: time,
          duration: duration,
          students: students,
          maxStudents: maxStudents
        });
      }
    }
    
    return slots;
  };

  // Initialize slots once
  const initialSlots = React.useMemo(() => generateDummySlots(), []);
  const [slots, setSlots] = useState(initialSlots);
  
  // Set default selected date to first date with slots, or tomorrow
  const getDefaultDate = (slotsArray) => {
    if (slotsArray.length > 0) {
      const sortedDates = [...new Set(slotsArray.map(s => s.date))].sort();
      return sortedDates[0];
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  
  const [selectedDate, setSelectedDate] = useState(() => getDefaultDate(initialSlots));
  
  // Update selected date when slots change
  useEffect(() => {
    if (slots.length > 0 && !slots.some(s => s.date === selectedDate)) {
      const sortedDates = [...new Set(slots.map(s => s.date))].sort();
      if (sortedDates.length > 0) {
        setSelectedDate(sortedDates[0]);
      }
    }
  }, [slots, selectedDate]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  const [newSlot, setNewSlot] = useState({
    date: '',
    time: '',
    duration: 30,
    maxStudents: 5
  });

  // Get slots for selected date
  const dateSlots = slots.filter(slot => slot.date === selectedDate);
  
  // Get upcoming sessions (next 7 days)
  const upcomingSessions = slots
    .filter(slot => new Date(slot.date) >= new Date())
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    })
    .slice(0, 10);

  // Summary stats
  const totalSlots = slots.length;
  const totalScheduled = slots.filter(s => s.students > 0).length;
  const totalAvailable = slots.filter(s => s.students === 0).length;
  const totalStudents = slots.reduce((sum, s) => sum + s.students, 0);
  const utilizationRate = totalSlots > 0 ? Math.round((totalScheduled / totalSlots) * 100) : 0;

  // Calendar view - sessions per day
  const calendarDays = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const daySlots = slots.filter(s => s.date === dateStr);
    calendarDays.push({
      date: dateStr,
      displayDate: date.getDate(),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      slotsCount: daySlots.length,
      isToday: dateStr === today.toISOString().split('T')[0]
    });
  }

  const handleAddSlot = () => {
    if (newSlot.date && newSlot.time) {
      const slot = {
        id: slots.length + 1,
        ...newSlot,
        students: 0
      };
      setSlots([...slots, slot]);
      setNewSlot({ date: '', time: '', duration: 30, maxStudents: 5 });
      setShowAddModal(false);
    }
  };

  const handleDeleteSlot = (id) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      setSlots(slots.filter(slot => slot.id !== id));
    }
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setNewSlot({
      date: slot.date,
      time: slot.time,
      duration: slot.duration,
      maxStudents: slot.maxStudents
    });
    setShowAddModal(true);
  };

  const handleUpdateSlot = () => {
    if (editingSlot && newSlot.date && newSlot.time) {
      setSlots(slots.map(slot => 
        slot.id === editingSlot.id 
          ? { ...slot, ...newSlot }
          : slot
      ));
      setEditingSlot(null);
      setNewSlot({ date: '', time: '', duration: 30, maxStudents: 5 });
      setShowAddModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
            <p className="text-gray-600 mt-1.5 text-sm">Manage interview slots and sessions</p>
          </div>
          <button
            onClick={() => {
              setEditingSlot(null);
              setNewSlot({ date: '', time: '', duration: 30, maxStudents: 5 });
              setShowAddModal(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Slot</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Slots</p>
                <p className="text-2xl font-bold text-gray-900">{totalSlots}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Scheduled</p>
                <p className="text-2xl font-bold text-green-600">{totalScheduled}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Available</p>
                <p className="text-2xl font-bold text-gray-900">{totalAvailable}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Utilization</p>
                <p className="text-2xl font-bold text-purple-600">{utilizationRate}%</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions Overview (Next 14 Days)</h3>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                onClick={() => setSelectedDate(day.date)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedDate === day.date
                    ? 'border-blue-600 bg-blue-50'
                    : day.isToday
                    ? 'border-blue-300 bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">{day.dayName}</div>
                <div className={`text-lg font-semibold mb-1 ${day.isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {day.displayDate}
                </div>
                <div className="flex items-center justify-center">
                  {day.slotsCount > 0 ? (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      {day.slotsCount}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Slots */}
        {selectedDate && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Slots for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            {dateSlots.length > 0 ? (
              <div className="space-y-3">
                {dateSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{slot.time}</p>
                        <p className="text-sm text-gray-500">{slot.duration} minutes</p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{slot.students}/{slot.maxStudents} students</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditSlot(slot)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No slots scheduled for this date</p>
            )}
          </div>
        )}

        {/* Upcoming Sessions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Upcoming Sessions
            </h2>
            <span className="text-sm text-gray-500">{upcomingSessions.length} sessions</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Time</th>
                  <th className="py-3 px-6 text-left">Duration</th>
                  <th className="py-3 px-6 text-left">Students</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingSessions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-500">
                      No upcoming sessions scheduled
                    </td>
                  </tr>
                ) : (
                  upcomingSessions.map((slot) => (
                    <tr key={slot.id} className="border-b hover:bg-green-50 transition-colors">
                      <td className="py-3 px-6 text-gray-700">
                        {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-6 text-gray-700">{slot.time}</td>
                      <td className="py-3 px-6 text-gray-700">{slot.duration} min</td>
                      <td className="py-3 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          slot.students === slot.maxStudents 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {slot.students}/{slot.maxStudents}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSlot(slot);
                          }}
                          className="p-1.5 text-gray-400 hover:text-green-600"
                          aria-label="Edit slot"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlot(slot.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600"
                          aria-label="Delete slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingSlot ? 'Edit Slot' : 'Add New Slot'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newSlot.time}
                    onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newSlot.duration}
                    onChange={(e) => setNewSlot({ ...newSlot, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
                  <input
                    type="number"
                    value={newSlot.maxStudents}
                    onChange={(e) => setNewSlot({ ...newSlot, maxStudents: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingSlot(null);
                      setNewSlot({ date: '', time: '', duration: 30, maxStudents: 5 });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingSlot ? handleUpdateSlot : handleAddSlot}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingSlot ? 'Update' : 'Add'} Slot
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleSlots;

