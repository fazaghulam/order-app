import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const OrderScreen = () => {
  const [keyword, setKeyword] = useState("");
  const [orderDate, setOrderDate] = useState(new Date());
  const [orders, setOrders] = useState([
    {
      id: "50_001",
      customer: "PROFES",
      date: "24/2/2011",
    },
    {
      id: "50_002",
      customer: "TITAN",
      date: "24/2/2011",
    },
  ]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.orderItem}>
        <Text>{item.id}</Text>
        <Text>{item.customer}</Text>
        <Text>{item.date}</Text>
      </View>
    );
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setOrderDate(selectedDate);
    }
  };

  const handleSearchPress = () => {
    // Implement search logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Order List</Text>
      <View style={styles.searchInputContainer}>
        <TextInput style={styles.searchInput} placeholder="Keyword" onChangeText={setKeyword} value={keyword} />
      </View>
      <View style={styles.searchInputContainer}>
        <DateTimePicker style={styles.orderDatePicker} value={orderDate} onChange={handleDateChange} />
        <Image source={require("../assets/calendar.png")} style={styles.calendarIconImage} />
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Order List</Text>
      <Text style={styles.totalItems}>Total Items: {orders.length}</Text>
      <FlatList data={orders} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  totalItems: {
    fontSize: 16,
    color: "#888",
  },
  searchInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  searchInput: {
    width: 200,
  },
  orderDatePicker: {
    width: 100,
  },
  searchButton: {
    backgroundColor: "#000",
    width: 300,
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  calendarIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  calendarIconImage: {
    width: 20,
    height: 20,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 8,
  },
});

export default OrderScreen;
