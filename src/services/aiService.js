const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
console.log('API Key loaded:', API_KEY ? 'YES ✓' : 'NO - KEY MISSING ✗');

const SYSTEM_PROMPT = `You are Aurora, a warm and intelligent personal health companion — like a caring friend who knows a lot about health.

You can read and update the user's health data. When they tell you something they did, update it.

Available actions:
- addWater    → data: { amount: number }            e.g. "I drank 500ml"
- logSleep    → data: { hours: number }             e.g. "I slept 7 hours"
- createHabit → data: { name: string, icon: emoji } e.g. "add meditation habit"
- completeHabit → data: { habitName: string }       e.g. "I meditated"
- logMeal     → data: { type: "breakfast"|"lunch"|"dinner"|"snack", description: string, calories: number }

ALWAYS respond with valid JSON (no markdown, no code fences):
{
  "message": "Your warm, conversational response here",
  "action": null
}
OR if there is an action:
{
  "message": "Great! I've updated your data.",
  "action": { "type": "addWater", "data": { "amount": 500 } }
}

Be specific, reference the user's actual numbers. Keep responses short (1-2 sentences).`;

export const sendMessageToAurora = async (userMessage, healthContext, history = []) => {
  try {
    const contextStr = `
User health data right now:
- Hydration: ${healthContext.hydration.today}ml / ${healthContext.hydration.goal}ml (${healthContext.hydration.percentage}%)
- Sleep last night: ${healthContext.sleep.lastNight}h (weekly avg: ${healthContext.sleep.weeklyAvg}h)
- Habits: ${healthContext.habits.completed}/${healthContext.habits.total} done today
  ${healthContext.habits.list.map(h => `  • ${h.name}: ${h.completed ? '✓' : '○'} (streak: ${h.streak}d)`).join('\n')}
- Calories today: ${healthContext.nutrition.calories} kcal
- Meals logged: ${healthContext.nutrition.mealsLogged}

User says: "${userMessage}"`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system:     SYSTEM_PROMPT,
        messages:   [...history.slice(-6), { role: 'user', content: contextStr }],
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const text = data.content[0].text.trim();
    // Strip any accidental markdown fences
    const clean = text.replace(/```json|```/g, '').trim();

    try {
      return JSON.parse(clean);
    } catch {
      return { message: text, action: null };
    }
  } catch (err) {
    console.error('AI error:', err);
    return { message: "I'm having a moment — please try again!", action: null };
  }
};

export const generateInsight = async (healthContext) => {
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 120,
        messages: [{
          role: 'user',
          content: `Give one specific encouraging health insight (1 sentence) based on:
Hydration: ${healthContext.hydration.today}ml/${healthContext.hydration.goal}ml
Sleep: ${healthContext.sleep.lastNight}h last night
Habits: ${healthContext.habits.completed}/${healthContext.habits.total} done
Reply with ONLY the sentence, no quotes, no formatting.`,
        }],
      }),
    });
    const d = await r.json();
    return d.content[0].text;
  } catch {
    return 'Keep going — every healthy choice adds up! 💪';
  }
};