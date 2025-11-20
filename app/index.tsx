import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from "react-native";
import { useActivity } from "../context/ActivityContext";

export default function HomeScreen() {
  const [seconds, setSeconds] = useState(0);

  const {
    selectedActivityId,
    activities,
    addDurationToSelected,
    isRunning,
    startTimer,
    stopTimer,
  } = useActivity();

  // Reset timer when selecting a new activity
  useEffect(() => {
    setSeconds(0);
  }, [selectedActivityId]);

  

  // Tick timer
  useEffect(() => {
    let intervalId: number; //changed intervalId to type number to resolve any type issue
    if (isRunning && selectedActivityId) {
      intervalId = setInterval(() => {
        setSeconds((s) => s + 1);
        addDurationToSelected(1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, selectedActivityId]);

  function formatTime(totalSeconds: number) {
    let hours = Math.trunc(totalSeconds / 3600);
    let minutes = Math.trunc((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  const selectedActivity = activities.find((a) => a.id === selectedActivityId);

  return (
    <View style={styles.container}>
      <Text style={styles.activity}>
        {selectedActivity ? `Tracking: ${selectedActivity.name}` : "No activity selected"}
      </Text>

      <Text style={styles.timer}>{formatTime(seconds)}</Text>

      <TouchableOpacity
        style={[styles.bigButton, { backgroundColor: isRunning ? "red" : "green" }]}
        onPress={() => {
          if (!selectedActivityId) {
            Alert.alert("Select an activity first!");
            return;
          }
          isRunning ? stopTimer() : startTimer();
        }}
      >
        <Text style={styles.bigButtonText}>
          {isRunning ? "Stop Activity" : "Start Activity"}
        </Text>
      </TouchableOpacity>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timer: {
    fontSize: 48,
    marginBottom: 20,
  },
  activity: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  bigButton: {
    paddingVertical: 25,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginBottom: 20,
  },
  bigButtonText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});
