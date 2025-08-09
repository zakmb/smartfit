import type { CheckinEntry, DailyStats } from '../types/CheckinTypes';

export interface WeeklyDataPoint {
  day: string;
  workouts: number;
  calories: number;
  duration: number;
  water?: number;
  weight?: number;
}

export interface WorkoutTypeData {
  name: string;
  value: number;
  color: string;
}

export interface DashboardStat {
  name: string;
  value: string;
  icon: any;
  change: string;
  changeType: 'positive' | 'negative';
}

export interface StreakInfo {
  type: 'workout' | 'water' | 'weight';
  current: number;
  longest: number;
  isRunningOut: boolean; // Indicates if the streak is running out (no entry today but streak was active until yesterday)
}

export type TimePeriod = 'weekly' | 'monthly' | 'yearly';

export class CheckinDataUtils {
  private static readonly DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  private static readonly WORKOUT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  /**
   * Get entries for a specific date
   */
  static getEntriesByDate(entries: CheckinEntry[], date: Date): CheckinEntry[] {
    const targetDate = date.toDateString();
    return entries.filter(entry => 
      new Date(entry.timestamp).toDateString() === targetDate
    );
  }

  /**
   * Get today's entries
   */
  static getTodayEntries(entries: CheckinEntry[]): CheckinEntry[] {
    const today = new Date().toDateString();
    return entries.filter(entry => 
      new Date(entry.timestamp).toDateString() === today
    );
  }

  /**
   * Get entries for a date range
   */
  static getEntriesByDateRange(entries: CheckinEntry[], startDate: Date, endDate: Date): CheckinEntry[] {
    return entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  /**
   * Calculate daily statistics
   */
  static calculateDailyStats(entries: CheckinEntry[]): DailyStats {
    const todayEntries = this.getTodayEntries(entries);

    const totalWorkoutTime = todayEntries
      .filter(entry => entry.duration && (entry.type === 'workout' || entry.type === 'exercise'))
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);

    const totalWater = todayEntries
      .filter(entry => entry.water)
      .reduce((sum, entry) => sum + (entry.water || 0), 0);

    const totalActivities = todayEntries
      .filter(entry => entry.type === 'workout' || entry.type === 'exercise')
      .length;

    const totalCaloriesIn = todayEntries
      .filter(entry => entry.type === 'meal')
      .reduce((sum, entry) => sum + (entry.calories || 0), 0);

    const totalCaloriesBurned = todayEntries
      .filter(entry => entry.type === 'exercise')
      .reduce((sum, entry) => sum + (entry.calories || 0), 0);

    return {
      totalWorkoutTime,
      totalActivities,
      totalWater,
      totalCaloriesIn,
      totalCaloriesBurned
    };
  }

  /**
   * Get weekly data for charts
   */
  static getWeeklyData(entries: CheckinEntry[]): WeeklyDataPoint[] {
    const today = new Date();
    const weekData: WeeklyDataPoint[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayEntries = this.getEntriesByDate(entries, date);
      
      const workouts = dayEntries.filter(entry => 
        entry.type === 'workout' || entry.type === 'exercise'
      ).length;
      
      const calories = dayEntries.reduce((sum, entry) => 
        sum + (entry.calories || 0), 0
      );
      
      const duration = dayEntries.reduce((sum, entry) => 
        sum + (entry.duration || 0), 0
      );

      const water = dayEntries.reduce((sum, entry) => 
        sum + (entry.water || 0), 0
      );

      weekData.push({
        day: this.DAYS[date.getDay()],
        workouts,
        calories,
        duration,
        water
      });
    }

    return weekData;
  }

  /**
   * Get monthly data for charts (last 30 days)
   */
  static getMonthlyData(entries: CheckinEntry[]): WeeklyDataPoint[] {
    const today = new Date();
    const monthData: WeeklyDataPoint[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayEntries = this.getEntriesByDate(entries, date);
      
      const workouts = dayEntries.filter(entry => 
        entry.type === 'workout' || entry.type === 'exercise'
      ).length;
      
      const calories = dayEntries.reduce((sum, entry) => 
        sum + (entry.calories || 0), 0
      );
      
      const duration = dayEntries.reduce((sum, entry) => 
        sum + (entry.duration || 0), 0
      );

      const water = dayEntries.reduce((sum, entry) => 
        sum + (entry.water || 0), 0
      );

      monthData.push({
        day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        workouts,
        calories,
        duration,
        water
      });
    }

    return monthData;
  }

  /**
   * Get yearly data for charts (last 12 months)
   */
  static getYearlyData(entries: CheckinEntry[]): WeeklyDataPoint[] {
    const today = new Date();
    const yearData: WeeklyDataPoint[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const monthEntries = this.getEntriesByDateRange(entries, date, endDate);
      
      const workouts = monthEntries.filter(entry => 
        entry.type === 'workout' || entry.type === 'exercise'
      ).length;
      
      const calories = monthEntries.reduce((sum, entry) => 
        sum + (entry.calories || 0), 0
      );
      
      const duration = monthEntries.reduce((sum, entry) => 
        sum + (entry.duration || 0), 0
      );

      const water = monthEntries.reduce((sum, entry) => 
        sum + (entry.water || 0), 0
      );

      yearData.push({
        day: months[date.getMonth()],
        workouts,
        calories,
        duration,
        water
      });
    }

    return yearData;
  }

  /**
   * Get data for any time period
   */
  static getDataForPeriod(entries: CheckinEntry[], period: TimePeriod): WeeklyDataPoint[] {
    switch (period) {
      case 'weekly':
        return this.getWeeklyData(entries);
      case 'monthly':
        return this.getMonthlyData(entries);
      case 'yearly':
        return this.getYearlyData(entries);
      default:
        return this.getWeeklyData(entries);
    }
  }

  /**
   * Get workout type distribution
   */
  static getWorkoutTypes(entries: CheckinEntry[]): WorkoutTypeData[] {
    const workoutEntries = entries.filter(entry => 
      entry.type === 'workout' || entry.type === 'exercise'
    );

    const typeCounts: { [key: string]: number } = {};
    
    workoutEntries.forEach(entry => {
      const type = entry.title.toLowerCase();
      if (type.includes('strength') || type.includes('weight') || type.includes('lift')) {
        typeCounts['Strength'] = (typeCounts['Strength'] || 0) + 1;
      } else if (type.includes('cardio') || type.includes('run') || type.includes('cycle') || type.includes('swim')) {
        typeCounts['Cardio'] = (typeCounts['Cardio'] || 0) + 1;
      } else if (type.includes('flexibility') || type.includes('yoga') || type.includes('stretch')) {
        typeCounts['Flexibility'] = (typeCounts['Flexibility'] || 0) + 1;
      } else if (type.includes('sport') || type.includes('basketball') || type.includes('tennis')) {
        typeCounts['Sports'] = (typeCounts['Sports'] || 0) + 1;
      } else {
        typeCounts['Other'] = (typeCounts['Other'] || 0) + 1;
      }
    });

    return Object.entries(typeCounts).map(([name, value], index) => ({
      name,
      value,
      color: this.WORKOUT_COLORS[index % this.WORKOUT_COLORS.length]
    }));
  }

  /**
   * Calculate dashboard statistics with week-over-week comparison
   */
  static calculateDashboardStats(entries: CheckinEntry[], icons: {
    BoltIcon: any;
    ClockIcon: any;
    FunnelIcon: any;
    CakeIcon: any;
    FireIcon: any;
  }): DashboardStat[] {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    // Calculate how many days to subtract to get Monday
    const diffToMonday = (dayOfWeek === 0) ? 6 : dayOfWeek - 1; 

    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    
    const thisWeekEntries = this.getEntriesByDateRange(entries, monday, today);
    
    const twoWeeksAgo = new Date(monday);
    twoWeeksAgo.setDate(monday.getDate() - 7);
    const lastWeekEntries = this.getEntriesByDateRange(entries, twoWeeksAgo, monday);

    const totalActivities = thisWeekEntries.filter(entry => 
      entry.type === 'workout' || entry.type === 'exercise'
    ).length;
    
    const lastWeekActivities = lastWeekEntries.filter(entry => 
      entry.type === 'workout' || entry.type === 'exercise'
    ).length;

    const totalCaloriesIn = thisWeekEntries.filter(entry => entry.type === 'meal')
      .reduce((sum, entry) => sum + (entry.calories || 0), 0);
    const lastWeekCaloriesIn = lastWeekEntries.filter(entry => entry.type === 'meal')
      .reduce((sum, entry) => sum + (entry.calories || 0), 0);

    const avgDuration = thisWeekEntries.filter(entry => entry.type === 'workout' || entry.type === 'exercise').length > 0
      ? Math.round(
          thisWeekEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 
          thisWeekEntries.filter(entry => entry.type === 'workout' || entry.type === 'exercise').length)
      : 0;

    const lastWeekAvgDuration = lastWeekEntries.length > 0
      ? Math.round(
          lastWeekEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 
          lastWeekEntries.filter(entry => entry.type === 'workout' || entry.type === 'exercise').length)
      : 0;

    const totalCalories = thisWeekEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
    const lastWeekCalories = lastWeekEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);

    const totalWater = thisWeekEntries.reduce((sum, entry) => sum + (entry.water || 0), 0);
    const lastWeekWater = lastWeekEntries.reduce((sum, entry) => sum + (entry.water || 0), 0);

    const stats: DashboardStat[] = [
      { 
        name: 'Total Activities', 
        value: totalActivities.toString(), 
        icon: icons.BoltIcon, 
        change: totalActivities > lastWeekActivities ? `+${totalActivities - lastWeekActivities}` : 
                totalActivities < lastWeekActivities ? `${totalActivities - lastWeekActivities}` : '0',
        changeType: totalActivities >= lastWeekActivities ? 'positive' : 'negative' 
      },
      { 
        name: 'Avg Duration', 
        value: `${avgDuration}min`, 
        icon: icons.ClockIcon, 
        change: avgDuration > lastWeekAvgDuration ? `+${avgDuration - lastWeekAvgDuration}min` : 
                avgDuration < lastWeekAvgDuration ? `${avgDuration - lastWeekAvgDuration}min` : '0min',
        changeType: avgDuration >= lastWeekAvgDuration ? 'positive' : 'negative' 
      },
      { 
        name: 'Water Intake',
        value: `${totalWater}ml`,
        icon: icons.FunnelIcon,
        change: totalWater > lastWeekWater ? `+${totalWater - lastWeekWater}ml` :
                totalWater < lastWeekWater ? `${totalWater - lastWeekWater}ml` : '0ml',
        changeType: totalWater >= lastWeekWater ? 'positive' : 'negative'
      },
      { 
        name: 'Calories In', 
        value: totalCaloriesIn.toLocaleString(), 
        icon: icons.CakeIcon, 
        change: totalCaloriesIn > lastWeekCaloriesIn ? `+${(totalCaloriesIn - lastWeekCaloriesIn).toLocaleString()}` : 
                totalCaloriesIn < lastWeekCaloriesIn ? `${(totalCaloriesIn - lastWeekCaloriesIn).toLocaleString()}` : '0',
        changeType: totalCaloriesIn >= lastWeekCaloriesIn ? 'positive' : 'negative' 
      },
      { 
        name: 'Calories Burned', 
        value: totalCalories.toLocaleString(), 
        icon: icons.FireIcon, 
        change: totalCalories > lastWeekCalories ? `+${(totalCalories - lastWeekCalories).toLocaleString()}` : 
                totalCalories < lastWeekCalories ? `${(totalCalories - lastWeekCalories).toLocaleString()}` : '0',
        changeType: totalCalories >= lastWeekCalories ? 'positive' : 'negative' 
      },
    ];

    return stats;
  }

  /**
   * Get weight progress data
   */
  static getWeightProgress(entries: CheckinEntry[], days: number = 30): Array<{ date: string; weight: number }> {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    
    const weightEntries = this.getEntriesByDateRange(entries, startDate, today)
      .filter(entry => entry.type === 'weight' && entry.weight)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return weightEntries.map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString(),
      weight: entry.weight!
    }));
  }

  /**
   * Get water intake data
   */
  static getWaterIntake(entries: CheckinEntry[], days: number = 7): Array<{ date: string; water: number }> {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    
    const waterEntries = this.getEntriesByDateRange(entries, startDate, today)
      .filter(entry => entry.type === 'water' && entry.water);

    const dailyWater: { [key: string]: number } = {};
    
    waterEntries.forEach(entry => {
      const date = new Date(entry.timestamp).toDateString();
      dailyWater[date] = (dailyWater[date] || 0) + (entry.water || 0);
    });

    return Object.entries(dailyWater).map(([date, water]) => ({
      date: new Date(date).toLocaleDateString(),
      water
    }));
  }

  /**
   * Get weight data for any time period
   */
  static getWeightDataForPeriod(entries: CheckinEntry[], period: TimePeriod): Array<{ date: string; weight: number }> {
    const today = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'weekly':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'monthly':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case 'yearly':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 365);
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
    }
    
    const weightEntries = this.getEntriesByDateRange(entries, startDate, today)
      .filter(entry => entry.type === 'weight' && entry.weight)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return weightEntries.map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString(),
      weight: entry.weight!
    }));
  }

  /**
   * Calculate streak for a specific type of activity
   */
  static calculateStreak(entries: CheckinEntry[], type: 'workout' | 'water' | 'weight'): StreakInfo {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    // Filter entries by type
    const typeEntries = entries.filter(entry => {
      if (type === 'workout') {
        return entry.type === 'workout' || entry.type === 'exercise';
      } else if (type === 'water') {
        return entry.type === 'water';
      } else if (type === 'weight') {
        return entry.type === 'weight';
      }
      return false;
    });

    // Get unique dates for this type and sort them
    const dates = [...new Set(typeEntries.map(entry => {
      const date = new Date(entry.timestamp);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }))].sort((a, b) => b - a); // Sort descending

    if (dates.length === 0) {
      return { type, current: 0, longest: 0, isRunningOut: false };
    }

         // Calculate current streak - check if streak is running out
     let currentStreak = 0;
     let isRunningOut = false;
     let currentDate = new Date(today);
     const todayTime = today.getTime();
     const yesterdayTime = todayTime - (24 * 60 * 60 * 1000);
     
     // First, check if there's an entry for today
     if (dates.includes(todayTime)) {
       // If there's an entry for today, calculate the streak normally
       while (true) {
         const currentTime = currentDate.getTime();
         if (dates.includes(currentTime)) {
           currentStreak++;
           currentDate.setDate(currentDate.getDate() - 1);
         } else {
           break;
         }
       }
     } else {
       // If no entry for today, check if there's a streak running out
       // A streak is "running out" if the last entry was yesterday or earlier,
       // but there was a consecutive streak before that
       let tempStreak = 0;
       let checkDate = new Date(today);
       checkDate.setDate(checkDate.getDate() - 1); // Start from yesterday
       
       while (true) {
         const checkTime = checkDate.getTime();
         if (dates.includes(checkTime)) {
           tempStreak++;
           checkDate.setDate(checkDate.getDate() - 1);
         } else {
           break;
         }
       }
       
       // If we found a streak ending yesterday, that's our current streak
       if (tempStreak > 0) {
         currentStreak = tempStreak;
         isRunningOut = true; // Mark as running out since no entry today
       }
     }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: number | null = null;

    for (const dateTime of dates) {
      if (prevDate === null) {
        tempStreak = 1;
      } else {
        const diffTime = Math.abs(prevDate - dateTime);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
      prevDate = dateTime;
    }

         return {
       type,
       current: currentStreak,
       longest: longestStreak,
       isRunningOut
     };
  }

  /**
   * Calculate all streaks
   */
  static calculateAllStreaks(entries: CheckinEntry[]): StreakInfo[] {
    return [
      this.calculateStreak(entries, 'workout'),
      this.calculateStreak(entries, 'water'),
      this.calculateStreak(entries, 'weight')
    ];
  }
}

// Export individual functions for backward compatibility
export const calculateDailyStats = (entries: CheckinEntry[]): DailyStats => 
  CheckinDataUtils.calculateDailyStats(entries);

export const getTodayEntries = (entries: CheckinEntry[]): CheckinEntry[] => 
  CheckinDataUtils.getTodayEntries(entries);

export const getEntriesByDate = (entries: CheckinEntry[], date: Date): CheckinEntry[] => 
  CheckinDataUtils.getEntriesByDate(entries, date); 