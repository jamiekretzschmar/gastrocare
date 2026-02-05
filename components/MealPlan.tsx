import React, { useState } from 'react';
import { RECIPES } from '../constants';
import { Clock, Info, CheckCircle2, Circle, ChefHat, Droplet, Utensils, Filter, Plus, X, Sun, Moon, Coffee, Milk, Soup } from 'lucide-react';
import { MealItem, MealTexture } from '../types';
import { safeLocalStorage } from '../utils/storage';

interface MealPlanProps {
  flareMode: boolean;
  mealPlan: MealItem[];
  setMealPlan: React.Dispatch<React.SetStateAction<MealItem[]>>;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'Sun': <Sun className="w-4 h-4" />,
  'Moon': <Moon className="w-4 h-4" />,
  'Coffee': <Coffee className="w-4 h-4" />,
  'Milk': <Milk className="w-4 h-4" />,
  'Soup': <Soup className="w-4 h-4" />,
  'Utensils': <Utensils className="w-4 h-4" />,
};

const MealPlan: React.FC<MealPlanProps> = ({ flareMode, mealPlan, setMealPlan }) => {
  const [checkedMeals, setCheckedMeals] = useState<Record<string, boolean>>({});
  const [textureFilter, setTextureFilter] = useState<'All' | MealTexture>('All');
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<MealItem>>({
    time: '12:00 PM',
    title: '',
    items: [],
    notes: '',
    icon: 'Utensils',
    flareFriendly: false
  });
  const [tempItems, setTempItems] = useState('');

  const toggleMeal = (title: string) => {
    setCheckedMeals(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleAddMeal = () => {
    if (!newMeal.title) return;
    const itemsArray = tempItems.split(',').map(i => i.trim()).filter(i => i);
    const mealToAdd: MealItem = {
      time: newMeal.time || '12:00 PM',
      title: newMeal.title,
      items: itemsArray,
      notes: newMeal.notes || '',
      icon: newMeal.icon || 'Utensils',
      flareFriendly: newMeal.flareFriendly || false
    };
    
    // Sort logic could go here, but appending is fine for now
    // Or we could sort by time string
    const updated = [...mealPlan, mealToAdd].sort((a, b) => {
      // Simple parse for sorting (not perfect for 12 vs 1, but okay for basic use)
      return new Date('1970/01/01 ' + a.time).getTime() - new Date('1970/01/01 ' + b.time).getTime();
    });

    setMealPlan(updated);
    safeLocalStorage.setItem('gastroMealPlan', updated); // Persist custom meals safely
    setShowAddMeal(false);
    setNewMeal({ time: '12:00 PM', title: '', items: [], notes: '', icon: 'Utensils', flareFriendly: false });
    setTempItems('');
  };

  // Filter Meals
  const filteredMeals = mealPlan.filter(m => flareMode ? m.flareFriendly : !m.flareFriendly);

  // Filter Recipes
  const filteredRecipes = RECIPES.filter(r => {
    const matchesFlare = flareMode ? r.isLiquid : true;
    const matchesTexture = textureFilter === 'All' ? true : r.texture === textureFilter;
    return matchesFlare && matchesTexture;
  });

  return (
    <div className="space-y-8">
      
      {/* Meal Plan Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-lg font-bold text-slate-800">Daily Schedule</h3>
           <button 
             onClick={() => setShowAddMeal(!showAddMeal)}
             className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-100 flex items-center gap-2"
           >
             {showAddMeal ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
             Add Custom Meal
           </button>
        </div>

        {showAddMeal && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-semibold text-slate-800 mb-3">New Meal Entry</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Title (e.g. Late Snack)" className="p-2 border rounded-lg text-sm" value={newMeal.title} onChange={e => setNewMeal({...newMeal, title: e.target.value})} />
              <input type="time" className="p-2 border rounded-lg text-sm" value={newMeal.time ? undefined : ''} onChange={e => {
                 // Convert 24h to 12h format roughly
                 const [h, m] = e.target.value.split(':');
                 const date = new Date();
                 date.setHours(Number(h));
                 date.setMinutes(Number(m));
                 setNewMeal({...newMeal, time: date.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})});
              }} />
              <input type="text" placeholder="Items (comma separated)" className="md:col-span-2 p-2 border rounded-lg text-sm" value={tempItems} onChange={e => setTempItems(e.target.value)} />
              <input type="text" placeholder="Notes (e.g. Chew well)" className="md:col-span-2 p-2 border rounded-lg text-sm" value={newMeal.notes} onChange={e => setNewMeal({...newMeal, notes: e.target.value})} />
              
              <div className="flex items-center gap-4">
                <label className="text-sm text-slate-600 font-medium">Icon:</label>
                <select className="p-2 border rounded-lg text-sm bg-white" value={newMeal.icon} onChange={e => setNewMeal({...newMeal, icon: e.target.value})}>
                  {Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2">
                 <input type="checkbox" id="flareFriendly" checked={newMeal.flareFriendly} onChange={e => setNewMeal({...newMeal, flareFriendly: e.target.checked})} className="w-4 h-4 text-teal-600 rounded" />
                 <label htmlFor="flareFriendly" className="text-sm text-slate-700">Flare-Up Friendly? (Liquid/Puree)</label>
              </div>
            </div>
            <button onClick={handleAddMeal} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700">Add to Plan</button>
          </div>
        )}

        <div className="grid gap-6">
          {filteredMeals.map((meal, index) => {
            const isDone = checkedMeals[meal.title]; 
            return (
              <div 
                key={index} 
                className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                  isDone 
                    ? 'bg-slate-50 border-slate-200 opacity-75' 
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200'
                }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isDone ? 'bg-slate-400' : (flareMode ? 'bg-red-400' : 'bg-teal-500')}`}></div>

                <div className="p-5 pl-7">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold mb-1">
                      <Clock className="w-4 h-4" />
                      {meal.time}
                      {flareMode && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">Liquid/Soft</span>}
                    </div>
                    <button 
                      onClick={() => toggleMeal(meal.title)}
                      className="text-slate-400 hover:text-teal-600 transition-colors"
                    >
                      {isDone ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <Circle className="w-6 h-6" />}
                    </button>
                  </div>

                  <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 ${isDone ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                    {ICON_MAP[meal.icon] || <Utensils className="w-4 h-4"/>}
                    {meal.title}
                  </h3>

                  <ul className="space-y-1 mb-3">
                    {meal.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${flareMode ? 'bg-red-400' : 'bg-teal-400'}`}></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${flareMode ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-800'}`}>
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {meal.notes}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recipes Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-orange-500" />
            {flareMode ? 'Safe Flare Recipes' : 'Recipes'}
          </h2>
          
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            {(['All', 'Liquid', 'Pureed', 'Soft Solid'] as const).map(tex => (
              <button
                key={tex}
                onClick={() => setTextureFilter(tex)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  textureFilter === tex 
                    ? 'bg-white text-orange-600 shadow-sm border border-slate-100' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tex}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredRecipes.length === 0 ? (
             <p className="col-span-2 text-center text-slate-400 italic py-8">No recipes match the selected texture filters.</p>
          ) : filteredRecipes.map((recipe, idx) => (
            <div key={idx} className="bg-slate-50 rounded-lg p-5 border border-slate-100">
              <div className="flex justify-between items-start mb-1">
                 <h3 className="font-bold text-lg text-slate-800">{recipe.name}</h3>
                 <span className={`text-xs px-2 py-1 rounded-full border ${
                   recipe.texture === 'Liquid' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                   recipe.texture === 'Pureed' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                   'bg-green-100 text-green-700 border-green-200'
                 }`}>
                   {recipe.texture}
                 </span>
              </div>
              <p className="text-sm text-slate-500 italic mb-4">{recipe.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Ingredients</h4>
                  <ul className="text-sm space-y-1 text-slate-700">
                    {recipe.ingredients.map((ing, i) => <li key={i}>• {ing}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Instructions</h4>
                  <ol className="text-sm space-y-2 text-slate-700 list-decimal pl-4">
                    {recipe.instructions.map((inst, i) => <li key={i}>{inst}</li>)}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealPlan;