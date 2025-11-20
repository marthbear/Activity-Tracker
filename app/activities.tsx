import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Pressable,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useActivity } from "../context/ActivityContext";

export default function ActivitiesScreen() {
  const {
    activities,
    addActivity,
    deleteActivity,
    selectActivity,
    selectedActivityId,
  } = useActivity();
  const [newActivityName, setNewActivityName] = useState("");

  const handleAddActivity = () => {
    if (newActivityName.trim() === "") {
      Alert.alert("Name Required");
      return;
    }
    addActivity(newActivityName);
    setNewActivityName("");
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.rowFront,
        selectedActivityId === item.id && { backgroundColor: "#def" },
      ]}
    >
      <Pressable
        android_ripple={{ color: "#ccc" }}
        onPress={() => selectActivity(item.id)}
        style={{ flex: 1, padding: 10 }}
      >
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDuration}>{formatDuration(item.duration)}</Text>
      </Pressable>
    </View>
  );

  const renderHiddenItem = ({ item }) => (
    <View style={styles.rowBack}>
      <Pressable
        style={styles.deleteButton}
        onPress={() => deleteActivity(item.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={newActivityName}
        onChangeText={setNewActivityName}
        placeholder="Enter Name"
      />
      <Button title="Add new Activity" onPress={handleAddActivity} />

      <SwipeListView
        data={activities}
        extraData={selectedActivityId}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-80}
        stopRightSwipe={-80}
        disableRightSwipe={true}
        friction={25}
        tension={90}
        swipeToOpenPercent={60} // must swipe at least 60% to open delete
        previewRowKey={undefined}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  rowFront: {
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    marginBottom: 10,
    overflow: "hidden",
  },
  itemName: { fontWeight: "bold", fontSize: 16 },
  itemDuration: { color: "gray" },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#f00",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    borderRadius: 6,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#f55",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
