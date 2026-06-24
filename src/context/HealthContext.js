import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, doc, getDoc, setDoc, updateDoc,
  addDoc, query, where, orderBy, getDocs,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const HealthContext = createContext({});
export const useHealth = () => useContext(HealthContext);

const todayKey = () => new Date().toISOString().split('T')[0];

export const HealthProvider = ({ children }) => {
  const { user } = useAuth();

  const [hydration, setHydration] = useState({ today: 0, goal: 2500 });
  const [sleep, setSleep]         = useState({ lastNight: 0, weeklyAvg: 0, history: [] });
  const [habits, setHabits]       = useState([]);
  const [nutrition, setNutrition] = useState({ meals: [], calories: 0, protein: 0, carbs: 0, fat: 0 });

  useEffect(() => { if (user) loadAll(); }, [user]);

  const loadAll = async () => {
    await Promise.all([loadHydration(), loadSleep(), loadHabits(), loadNutrition()]);
  };

  /* ── HYDRATION ─────────────────────────────────────────── */
  const loadHydration = async () => {
    const snap = await getDoc(doc(db, 'users', user.uid, 'hydration', todayKey()));
    if (snap.exists()) setHydration(prev => ({ ...prev, ...snap.data() }));
  };

  const addWater = async (amount) => {
    const newAmt = (hydration.today || 0) + amount;
    await setDoc(doc(db, 'users', user.uid, 'hydration', todayKey()),
      { today: newAmt, goal: hydration.goal, date: todayKey() }, { merge: true });
    setHydration(prev => ({ ...prev, today: newAmt }));
    return newAmt;
  };

  /* ── SLEEP ─────────────────────────────────────────────── */
  const loadSleep = async () => {
    const q = query(collection(db, 'users', user.uid, 'sleep'), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    const history = snap.docs.map(d => d.data());
    const avg = history.slice(0, 7).reduce((s, d) => s + (d.hours || 0), 0) / Math.max(history.length, 1);
    setSleep({ lastNight: history[0]?.hours || 0, weeklyAvg: Math.round(avg * 10) / 10, history });
  };

  const logSleep = async (hours, bedtime = '', wakeTime = '') => {
    await setDoc(doc(db, 'users', user.uid, 'sleep', todayKey()), {
      hours, bedtime, wakeTime, date: todayKey(),
      quality: hours >= 7 ? 'good' : hours >= 6 ? 'fair' : 'poor',
      createdAt: new Date().toISOString(),
    });
    setSleep(prev => ({ ...prev, lastNight: hours, history: [{ hours, date: todayKey() }, ...prev.history] }));
  };

  /* ── HABITS ────────────────────────────────────────────── */
  const loadHabits = async () => {
    const q = query(collection(db, 'users', user.uid, 'habits'), where('active', '==', true));
    const snap = await getDocs(q);
    const today = todayKey();
    setHabits(snap.docs.map(d => ({
      id: d.id, ...d.data(),
      completedToday: (d.data().completedDates || []).includes(today),
    })));
  };

  const createHabit = async (name, frequency = 'daily', icon = '⭐') => {
    const ref = await addDoc(collection(db, 'users', user.uid, 'habits'), {
      name, frequency, icon, active: true, streak: 0,
      completedDates: [], createdAt: new Date().toISOString(),
    });
    const newH = { id: ref.id, name, frequency, icon, active: true, streak: 0, completedDates: [], completedToday: false };
    setHabits(prev => [...prev, newH]);
    return newH;
  };

  const completeHabit = async (habitId) => {
    const today = todayKey();
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.completedToday) return;
    const newDates  = [...(habit.completedDates || []), today];
    const newStreak = (habit.streak || 0) + 1;
    await updateDoc(doc(db, 'users', user.uid, 'habits', habitId),
      { completedDates: newDates, streak: newStreak, lastCompleted: today });
    setHabits(prev => prev.map(h =>
      h.id === habitId ? { ...h, completedToday: true, streak: newStreak } : h));
  };

  /* ── NUTRITION ─────────────────────────────────────────── */
  const loadNutrition = async () => {
    const snap = await getDoc(doc(db, 'users', user.uid, 'nutrition', todayKey()));
    if (snap.exists()) setNutrition(snap.data());
  };

  const logMeal = async (type, description, calories = 0, protein = 0, carbs = 0, fat = 0) => {
    const meal    = { type, description, calories, protein, carbs, fat, time: new Date().toISOString() };
    const updated = {
      meals:    [...(nutrition.meals || []), meal],
      calories: (nutrition.calories || 0) + calories,
      protein:  (nutrition.protein  || 0) + protein,
      carbs:    (nutrition.carbs    || 0) + carbs,
      fat:      (nutrition.fat      || 0) + fat,
      date:     todayKey(),
    };
    await setDoc(doc(db, 'users', user.uid, 'nutrition', todayKey()), updated, { merge: true });
    setNutrition(updated);
  };

  /* ── DERIVED ───────────────────────────────────────────── */
  const getDailyInsight = () => {
    const hydPct  = (hydration.today / hydration.goal) * 100;
    const doneH   = habits.filter(h => h.completedToday).length;
    if (hydPct >= 100)        return '🎉 Hydration goal smashed! You\'re crushing it today.';
    if (sleep.lastNight >= 8) return `Great sleep last night (${sleep.lastNight}h)! You're well-rested.`;
    if (sleep.lastNight < 6 && sleep.lastNight > 0)
      return `You only slept ${sleep.lastNight}h. Prioritize rest tonight!`;
    if (habits.length > 0 && doneH === habits.length) return '🔥 All habits done! Perfect day so far.';
    if (hydPct < 50)          return `Only ${Math.round(hydPct)}% hydrated. Drink up!`;
    return '✨ Keep going — every healthy action counts!';
  };

  const getHealthContext = () => ({
    date:      todayKey(),
    hydration: { today: hydration.today, goal: hydration.goal, percentage: Math.round((hydration.today / hydration.goal) * 100) },
    sleep:     { lastNight: sleep.lastNight, weeklyAvg: sleep.weeklyAvg },
    habits:    { total: habits.length, completed: habits.filter(h => h.completedToday).length,
      list: habits.map(h => ({ name: h.name, completed: h.completedToday, streak: h.streak })) },
    nutrition: { calories: nutrition.calories, protein: nutrition.protein, mealsLogged: (nutrition.meals || []).length },
  });

  return (
    <HealthContext.Provider value={{
      hydration, sleep, habits, nutrition,
      addWater, logSleep, createHabit, completeHabit, logMeal,
      loadAll, getDailyInsight, getHealthContext,
    }}>
      {children}
    </HealthContext.Provider>
  );
};