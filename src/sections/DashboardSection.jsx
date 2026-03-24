import React from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Zap,
  RotateCcw,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Lightbulb,
  ListTodo,
  Target,
  Loader2,
  MessageCircle,
  AlignLeft,
  ChevronUp,
  ArrowRight,
  Wallet,
  Flame,
  Home,
  Smile,
  Dices,
  Sparkles,
  Gamepad2,
} from 'lucide-react';

const DashboardSection = ({
  activeTab,
  timerMode,
  isFocusActive,
  activeHabitStack,
  isTimerMinimized,
  isTimerRunning,
  focusTask,
  isStrategyLoading,
  isBreakingDown,
  setIsFocusActive,
  startPrepare,
  setIsTimerMinimized,
  formatTime,
  timeLeft,
  setFocusTask,
  setRewardSuggestion,
  setTimerMode,
  prepSteps,
  currentPrepStep,
  completeStep,
  getPrepIcon,
  allPrepDone,
  startWorkMode,
  transitionSteps,
  openHelper,
  tasks,
  energyLevel,
  updateEnergyLevel,
  handleSmartRoulette,
  handleSmartReorder,
  isSorting,
  newTask,
  setNewTask,
  addTask,
  updateTasks,
  handleSelectTask,
  taskStrategy,
  toggleSubTask,
  handleTaskRewrite,
  processBrainDump,
  isAILoading,
  brainDump,
  updateBrainDump,
  activeScheduleItem,
  dopamineMenu,
  isDopamineLoading,
  generateDopamineMenu,
  balance,
  expenses,
  updateActiveTab,
  houseChores,
  newChore,
  setNewChore,
  addChore,
  toggleChore,
  deleteChore,
}) => {
  if (activeTab !== 'dashboard') return null;

  const choresCompleted = houseChores.filter((c) => c.completed).length;
  const choresProgress = houseChores.length
    ? Math.round((choresCompleted / houseChores.length) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="lg:col-span-2 space-y-8">
        <section
          className={`text-white shadow-2xl relative overflow-hidden transition-all duration-700 ease-in-out ${
            timerMode === 'hyperfocus'
              ? 'bg-fuchsia-900'
              : timerMode === 'transition'
                ? 'bg-indigo-400'
                : 'bg-slate-900'
          } ${
            (isFocusActive || activeHabitStack) && !isTimerMinimized
              ? 'p-6 rounded-[3rem] opacity-100 min-h-[350px]'
              : 'p-4 rounded-2xl opacity-80 h-20'
          }`}
        >
          <div
            className={`absolute inset-0 bg-white/5 pointer-events-none transition-opacity duration-1000 ${
              isTimerRunning && !isTimerMinimized ? 'opacity-20' : 'opacity-0'
            }`}
          />

          {(!(isFocusActive || activeHabitStack) || isTimerMinimized) ? (
            <div className="relative z-10 flex items-center justify-between h-full px-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg animate-pulse ${
                    timerMode === 'hyperfocus' ? 'bg-fuchsia-600' : 'bg-indigo-600'
                  }`}
                >
                  {timerMode === 'hyperfocus' ? (
                    <Gamepad2 className="text-white" size={16} />
                  ) : (
                    <Target className="text-white" size={16} />
                  )}
                </div>

                <h2 className="text-sm font-black uppercase tracking-widest opacity-60 italic">
                  {isTimerMinimized
                    ? timerMode === 'hyperfocus'
                      ? 'בצלילה עמוקה'
                      : `בעבודה: ${focusTask?.text || activeHabitStack?.name}`
                    : focusTask
                      ? `נבחרה משימה: ${focusTask.text}`
                      : 'מנוע המיקוד ממתין למשימה...'}
                </h2>
              </div>

              {focusTask &&
                !isStrategyLoading &&
                isBreakingDown !== focusTask.id &&
                !isFocusActive &&
                !activeHabitStack &&
                timerMode !== 'hyperfocus' && (
                  <button
                    onClick={() => {
                      setIsFocusActive(true);
                      startPrepare(focusTask);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-50 text-white hover:text-indigo-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg animate-in zoom-in-50 duration-300 transition-colors"
                  >
                    <Zap size={14} fill="currentColor" />
                    התחל סשן מיקוד
                  </button>
                )}

              {isTimerMinimized && (
                <button
                  onClick={() => {
                    setIsTimerMinimized(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-white/60 hover:text-white text-[10px] uppercase font-black tracking-widest bg-white/10 px-4 py-2 rounded-xl transition-colors"
                >
                  הרחב חזרה למעלה
                </button>
              )}

              {!focusTask && !isTimerMinimized && !isFocusActive && !activeHabitStack && timerMode !== 'hyperfocus' && (
                <div className="text-white/30 font-mono text-xl">--:--</div>
              )}
            </div>
          ) : (
            <div className="relative z-10 flex flex-col gap-4 animate-in zoom-in-95 duration-500 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {timerMode === 'prepare' && !activeHabitStack && (
                    <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2 animate-pulse">
                      <Sparkles size={12} />
                      הכנת AI
                    </span>
                  )}

                  {activeHabitStack && (
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2 animate-pulse">
                      <Sparkles size={12} />
                      שגרה פעילה
                    </span>
                  )}

                  {timerMode === 'work' && (
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2">
                      <Zap size={12} />
                      עבודה עמוקה
                    </span>
                  )}

                  {timerMode === 'hyperfocus' && (
                    <span className="bg-fuchsia-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2">
                      <Gamepad2 size={12} />
                      היפר-פוקוס פעיל
                    </span>
                  )}

                  {timerMode === 'transition' && (
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2 animate-pulse">
                      <RotateCcw size={12} />
                      נחיתה רכה
                    </span>
                  )}

                  <button
                    onClick={() => {
                      setFocusTask(null);
                      setIsFocusActive(false);
                      setRewardSuggestion(null);
                      setTimerMode('work');
                      setIsTimerMinimized(false);
                    }}
                    className="text-[10px] text-white/40 hover:text-white transition-colors underline mr-2"
                  >
                    ביטול טיימר
                  </button>
                </div>

                <div className="text-xl font-mono font-black text-white/80 tabular-nums bg-white/10 px-4 py-1 rounded-xl">
                  {formatTime(timeLeft)}
                </div>
              </div>

              {(timerMode === 'prepare' || activeHabitStack) ? (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 flex-1">
                  <div>
                    <h2 className="text-xl font-black italic">
                      {activeHabitStack ? activeHabitStack.name : 'מכינים את המרחב...'}
                    </h2>
                    <p className="text-white/60 text-[10px] truncate">
                      {activeHabitStack ? 'מבצעים את שלבי השגרה' : `הכנה למיקוד ב: ${focusTask?.text}`}
                    </p>
                  </div>

                  {isAILoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white/5 rounded-3xl border border-white/10">
                      <Loader2 className="animate-spin text-white/50" size={32} />
                      <p className="text-xs font-bold text-white/70 animate-pulse uppercase tracking-widest">
                        AI בונה תוכנית הכנה...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {prepSteps.map((step, index) => {
                        const isCurrent = index === currentPrepStep;
                        const isPast = index < currentPrepStep;

                        return (
                          <button
                            key={index}
                            disabled={!isCurrent && !isPast}
                            onClick={() => isCurrent && completeStep(index)}
                            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border-2 text-right ${
                              isCurrent
                                ? 'bg-white/20 border-white/40 shadow-xl scale-[1.02]'
                                : isPast
                                  ? 'bg-emerald-500/20 border-emerald-500/30 opacity-50'
                                  : 'bg-white/5 border-transparent opacity-30'
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isPast ? 'bg-emerald-500' : isCurrent ? 'bg-white/20 text-white' : 'bg-white/10'
                              }`}
                            >
                              {isPast ? <CheckCircle2 size={16} /> : getPrepIcon(step)}
                            </div>

                            <p className={`font-bold text-xs flex-1 ${isCurrent ? 'text-white' : 'text-white/60'}`}>
                              {index + 1}. {step.text}
                            </p>

                            {isCurrent && <ArrowRight className="text-white/80 animate-pulse" size={16} />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {allPrepDone && (
                    <button
                      onClick={startWorkMode}
                      className="w-full bg-white text-indigo-900 py-3 rounded-2xl font-black text-lg shadow-xl animate-bounce mt-4"
                    >
                      {activeHabitStack ? 'סיימתי את השגרה, מתחילים!' : 'אני מוכנה, בואו נתחיל!'}
                    </button>
                  )}
                </div>
              ) : timerMode === 'transition' ? (
                <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                  <RotateCcw size={48} className="text-white/40 mb-4 animate-bounce" />
                  <h2 className="text-2xl font-black italic mb-2">זמן לסיים ברוגע</h2>
                  <p className="text-sm font-medium text-white/80 mb-8 text-center max-w-sm">
                    הפוקוס נגמר. בואי לא נקטע את זה בחדות, הנה מה שעושים עכשיו:
                  </p>

                  <div className="space-y-3 w-full max-w-md">
                    {transitionSteps.map((step, i) => (
                      <div key={i} className="p-4 bg-white/10 border border-white/20 rounded-2xl flex items-center gap-3">
                        <Circle size={16} className="text-white/50" />
                        <span className="font-bold text-sm">{step}</span>
                      </div>
                    ))}
                  </div>

                  <h2 className="text-[60px] font-mono font-black tracking-tighter mt-6 opacity-80">
                    {formatTime(timeLeft)}
                  </h2>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-500 py-2">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-black text-white leading-tight truncate px-4">
                      <span className="ml-2 inline-block align-middle">{focusTask?.emoji}</span>
                      {focusTask?.text || activeHabitStack?.name}
                    </h2>
                  </div>

                  <div className="flex flex-col items-center justify-center flex-1">
                    <h2 className="text-[100px] font-mono font-black tracking-tighter tabular-nums leading-none drop-shadow-2xl">
                      {formatTime(timeLeft)}
                    </h2>
                  </div>

                  {timerMode === 'work' && isTimerRunning && (
                    <div className="mb-8 flex justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openHelper();
                        }}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-lg active:scale-95 group"
                      >
                        <MessageCircle size={18} className="text-indigo-300 group-hover:scale-110 transition-transform" />
                        נתקעתי, אפשר עזרה?
                      </button>
                    </div>
                  )}

                  <div className="flex justify-center gap-4 mt-auto pb-2">
                    <button
                      onClick={() => setIsTimerMinimized(true)}
                      className="px-6 py-3 rounded-[2rem] bg-white/10 hover:bg-white/20 font-black text-sm transition-colors border border-white/20 flex items-center gap-2"
                    >
                      <ChevronUp size={18} />
                      מזער
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800">
              <ListTodo size={24} className="text-indigo-600" />
              מה כדאי לעשות עכשיו?
            </h3>

            <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-3xl">
              <div className="flex flex-col gap-1 pr-1 pl-2">
                <span className="text-[11px] font-bold text-slate-500 leading-none">כמה אנרגיה יש לי עכשיו?</span>
              </div>

              <div className="flex gap-1 bg-slate-200/40 p-1 rounded-2xl">
                {['low', 'medium', 'high'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => updateEnergyLevel(lvl)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                      energyLevel === lvl
                        ? `${lvl === 'low' ? 'bg-rose-500' : lvl === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'} text-white shadow-md font-bold scale-105`
                        : 'text-slate-400 hover:bg-white hover:text-slate-600'
                    }`}
                  >
                    {lvl === 'low' ? (
                      <BatteryLow size={12} />
                    ) : lvl === 'medium' ? (
                      <BatteryMedium size={12} />
                    ) : (
                      <BatteryFull size={12} />
                    )}
                    <span className="text-[10px] font-black">
                      {lvl === 'low' ? 'נמוכה' : lvl === 'medium' ? 'בינונית' : 'גבוהה'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-slate-200 mx-1" />

              <button
                onClick={handleSmartRoulette}
                disabled={isSorting}
                className="p-2 text-indigo-600 hover:bg-white rounded-2xl transition-all disabled:opacity-50"
                title="רולטת החלטות - תחליט בשבילי"
              >
                {isSorting ? <Loader2 size={16} className="animate-spin" /> : <Dices size={16} />}
              </button>

              <button
                onClick={handleSmartReorder}
                disabled={isSorting}
                className="p-2 text-amber-500 hover:bg-white rounded-2xl transition-all"
                title="סידור חכם"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          <form
            onSubmit={addTask}
            className="mb-6 flex gap-3 p-1.5 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 focus-within:border-indigo-300 focus-within:bg-white transition-all duration-300"
          >
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="משהו חדש לעשות? כתבי כאן..."
              className="flex-1 bg-transparent px-4 py-1.5 outline-none font-bold text-slate-700 placeholder:text-slate-300 text-sm"
            />
            <button
              type="submit"
              className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
            >
              <Plus size={18} />
            </button>
          </form>

          <div className="space-y-3">
            {tasks.filter((t) => !t.completed && (t.energyRequired === energyLevel || t.energyRequired === 'analyzing')).length === 0 && (
              <div className="p-10 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold italic text-sm">אין משימות לרמת האנרגיה הזו. אולי זה זמן לנוח? ☕</p>
              </div>
            )}

            {tasks
              .filter((t) => !t.completed && (t.energyRequired === energyLevel || t.energyRequired === 'analyzing'))
              .map((task) => (
                <div
                  key={task.id}
                  className={`rounded-[2rem] border-2 transition-all group ${
                    focusTask?.id === task.id ? 'bg-indigo-50 border-indigo-500 shadow-sm p-4' : 'border-transparent hover:bg-slate-50 p-3'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        updateTasks(tasks.map((t) => (t.id === task.id ? { ...t, completed: true } : t)))
                      }
                      className="transition-transform active:scale-75"
                    >
                      {task.energyRequired === 'analyzing' ? (
                        <Loader2 className="animate-spin text-indigo-400" size={22} />
                      ) : (
                        <Circle
                          className={`hover:text-indigo-500 transition-colors ${
                            task.energyRequired === 'low'
                              ? 'text-rose-500'
                              : task.energyRequired === 'medium'
                                ? 'text-amber-500'
                                : 'text-emerald-500'
                          }`}
                          size={22}
                        />
                      )}
                    </button>

                    <div className="flex-1 cursor-pointer overflow-hidden" onClick={() => handleSelectTask(task)}>
                      <span className={`font-bold text-base block truncate ${focusTask?.id === task.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                        <span className="ml-2 inline-block align-middle">{task.emoji || '📝'}</span>
                        {task.text}
                      </span>

                      {taskStrategy?.taskId === task.id && focusTask?.id === task.id && (
                        <p className="text-[11px] text-indigo-600 font-medium mt-1 italic line-clamp-1">
                          {taskStrategy.message}
                        </p>
                      )}

                      {focusTask?.id === task.id && !isFocusActive && !isStrategyLoading && isBreakingDown !== task.id && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsFocusActive(true);
                              startPrepare(task);
                            }}
                            className="whitespace-nowrap text-[10px] font-black text-white bg-indigo-600 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 hover:scale-105 transition-all"
                          >
                            <ArrowRight size={10} />
                            כניסה לריכוז
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openHelper();
                            }}
                            className="whitespace-nowrap text-[10px] font-black text-indigo-600 bg-white border border-indigo-100 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 hover:bg-indigo-50 transition-colors"
                          >
                            <MessageCircle size={10} />
                            קשה לי להתחיל
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      {focusTask?.id === task.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFocusTask(null);
                            setIsFocusActive(false);
                            setRewardSuggestion(null);
                          }}
                          className="p-1.5 text-indigo-400 hover:bg-white rounded-lg transition-all border border-indigo-100"
                        >
                          <ChevronUp size={16} />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskRewrite(task.id, task.text);
                        }}
                        className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"
                        title="פשט משימה"
                      >
                        <AlignLeft size={18} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTasks(tasks.filter((t) => t.id !== task.id));
                        }}
                        className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                        title="מחק"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {focusTask?.id === task.id && (
                    <div className="mt-3">
                      {isBreakingDown === task.id ? (
                        <div className="mr-8 p-3 bg-white/40 rounded-xl border border-dashed border-indigo-200 flex items-center gap-3 animate-pulse">
                          <Loader2 className="animate-spin text-indigo-400" size={16} />
                          <span className="text-[11px] font-bold text-indigo-500 italic">ה-AI מפרק את המשימה לשלבים קטנים...</span>
                        </div>
                      ) : (
                        task.subTasks &&
                        task.subTasks.length > 0 && (
                          <div className="mr-8 space-y-1.5 border-r-2 border-indigo-100/50 pr-4">
                            {task.subTasks.map((st) => (
                              <div
                                key={st.id}
                                onClick={() => toggleSubTask(task.id, st.id)}
                                className="flex items-center gap-3 cursor-pointer group/sub"
                              >
                                {st.completed ? (
                                  <CheckCircle2 className="text-emerald-500" size={15} />
                                ) : (
                                  <Circle className="text-slate-400 group-hover/sub:text-indigo-500 transition-colors" size={15} />
                                )}
                                <span className={`text-[13px] font-medium transition-all ${st.completed ? 'line-through text-slate-300' : 'text-slate-600'}`}>
                                  {st.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>

        <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Lightbulb size={22} className="text-amber-500" />
              Brain Dump
            </h3>

            <button
              onClick={processBrainDump}
              disabled={isAILoading || !brainDump.trim()}
              className="px-4 py-2 bg-amber-500 text-white rounded-2xl text-xs font-black shadow-md hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAILoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              הפוך למשימות
            </button>
          </div>

          <textarea
            value={brainDump}
            onChange={(e) => updateBrainDump(e.target.value)}
            placeholder="פרוקי פה הכל..."
            className="w-full h-44 bg-slate-50 border-none rounded-[2rem] p-5 text-sm font-medium resize-none outline-none focus:ring-2 focus:ring-amber-200 transition-all custom-scrollbar"
          />
        </section>
      </div>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 mb-4">
            <Wallet size={20} className="text-emerald-500" />
            תקציב מהיר
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-3 rounded-2xl text-center">
              <span className="text-[9px] font-black text-emerald-600 uppercase">נשאר לשימוש</span>
              <p className="text-xl font-black text-emerald-700">₪{balance}</p>
            </div>

            <div className="bg-rose-50 p-3 rounded-2xl text-center">
              <span className="text-[9px] font-black text-rose-600 uppercase">הוצאות</span>
              <p className="text-xl font-black text-rose-700">₪{expenses}</p>
            </div>
          </div>

          <button
            onClick={() => updateActiveTab('finance')}
            className="w-full mt-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black hover:bg-slate-100 transition-all uppercase tracking-widest"
          >
            לניהול מלא
          </button>
        </section>

        <section className="bg-white border border-slate-200/50 rounded-[2.5rem] shadow-sm relative overflow-hidden flex flex-col">
          <div className="p-6">
            <h3 className="text-lg font-black italic flex items-center gap-2 text-slate-800 mb-4">
              <Calendar size={20} className="text-indigo-500" />
              לו"ז קרוב
            </h3>

            <div className="space-y-4">
              {activeScheduleItem ? (
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm">
                  <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
                    <activeScheduleItem.icon size={16} />
                  </div>

                  <div className="flex-1">
                    <span className="text-sm font-black text-indigo-900 block">{activeScheduleItem.activity}</span>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100 px-2 py-0.5 rounded-full inline-block mt-1">
                      {activeScheduleItem.time} • עכשיו בביצוע
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm font-medium text-slate-400 p-2">אין פעילות מוגדרת.</div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/50 group overflow-hidden relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <Flame size={20} className="text-rose-500" />
              תפריט דופמין
            </h3>

            <button
              onClick={generateDopamineMenu}
              disabled={isDopamineLoading}
              className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all shadow-sm flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider disabled:opacity-50"
            >
              {isDopamineLoading ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
              רענן
            </button>
          </div>

          {isDopamineLoading && (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin text-rose-400" size={24} />
            </div>
          )}

          {dopamineMenu && !isDopamineLoading && (
            <div className="space-y-2">
              {dopamineMenu.map((item, i) => (
                <div key={i} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm flex items-start gap-3">
                  <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                    <Smile size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/50 overflow-hidden relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <Home size={20} className="text-teal-500" />
              מטלות בית
            </h3>

            <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              {choresProgress}% הושלם
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${choresProgress}%` }}
            />
          </div>

          <form onSubmit={addChore} className="mb-4 flex gap-2">
            <input
              type="text"
              value={newChore}
              onChange={(e) => setNewChore(e.target.value)}
              placeholder="להוסיף מטלת בית..."
              className="flex-1 bg-slate-50 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-100 font-bold text-sm"
            />
            <button
              type="submit"
              className="w-11 h-11 bg-teal-500 text-white rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
            >
              <Plus size={18} />
            </button>
          </form>

          <div className="space-y-2">
            {houseChores.length === 0 && (
              <div className="text-center py-6 text-slate-400 font-bold italic text-sm">אין מטלות בית כרגע ✨</div>
            )}

            {houseChores.slice(0, 5).map((chore) => (
              <div
                key={chore.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group"
              >
                <button type="button" onClick={() => toggleChore(chore.id)}>
                  {chore.completed ? (
                    <CheckCircle2 size={20} className="text-emerald-500" />
                  ) : (
                    <Circle size={20} className="text-teal-500" />
                  )}
                </button>

                <div className="flex-1">
                  <p className={`text-sm font-bold ${chore.completed ? 'line-through text-slate-300' : 'text-slate-700'}`}>
                    {chore.text}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteChore(chore.id)}
                  className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardSection;
