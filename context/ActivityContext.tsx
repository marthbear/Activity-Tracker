import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


type Activity = {
  id: string;
  name: string;
  duration: number;
};

type ActivityContextType = {
  activities: Activity[];
  selectedActivityId: string | null;
  addActivity: (name: string) => void;
  selectActivity: (id: string) => void;
  addDurationToSelected: (seconds: number) => void;
  deleteActivity: (id: string) => void;
  isRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
};

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider = ({ children }: { children: React.ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    AsyncStorage.setItem("selectedActivityId", JSON.stringify(selectedActivityId));
  },
  [selectedActivityId]);

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("activities");
      const savedId = await AsyncStorage.getItem("selectedActivityId");
      console.log("loading saved data:", {saved, savedId});

      if (saved) setActivities(JSON.parse(saved));
      if (savedId) setSelectedActivityId(JSON.parse(savedId));
      
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      console.log("Saving activities:", activities);
    AsyncStorage.setItem("activities", JSON.stringify(activities));
    }
    
  }, [activities, isLoaded]);

  

  const addActivity = (name: string) => {
    const newActivity = { id: Date.now().toString(), name, duration: 0 };
    setActivities((prev) => [...prev, newActivity]);
  };

  function startTimer(){
    if (!selectedActivityId) return;
    setIsRunning(true);
  }

  function stopTimer() {
    setIsRunning(false);
  }
  //added interface to try to resolve any type issue but it looks like it isnt necessary
  interface deleteActivityProps{
   id: string;
  }
  //changed id type to string to resolve 'any type' error
  function deleteActivity(id: string) {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }

  const selectActivity = (id: string) => {
    setSelectedActivityId(id);
  };

  const addDurationToSelected = (seconds: number) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === selectedActivityId
          ? { ...a, duration: a.duration + seconds }
          : a
      )
    );
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        selectedActivityId,
        addActivity,
        selectActivity,
        addDurationToSelected,
        deleteActivity,
        isRunning,
        startTimer,
        stopTimer,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
};

