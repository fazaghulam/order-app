import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const OrderScreen = () => {
  const token = useSelector((state) => state.auth.token);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    const dateString = item.OrderDate;
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    return (
      <TouchableOpacity onPress={() => handleOrderItemPress(item)}>
        <View style={styles.orderItem}>
          <Text>{item.OrderNo}</Text>
          <Text>{item.CustomerName}</Text>
          <Text>{formattedDate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleFilter = (value) => {
    const filteredOrders = orders.filter((order) => order.CustomerName.toLowerCase().includes(value.toLowerCase()));
    setFilteredOrders(filteredOrders);
  };

  const handleOrderItemPress = (item) => {
    navigation.navigate("OrderDetailScreen", { order: item });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://dev.profescipta.co.id/so-api/Order/GetOrderList", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
          setFilteredOrders(data);
        } else {
        }
      } catch (error) {}
    };

    fetchOrders();
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Order List</Text>
      <View style={styles.searchInputContainer}>
        <TextInput style={styles.searchInput} placeholder="search customer" onChangeText={(text) => handleFilter(text)} />
      </View>
      <View style={styles.subHeader}>
        <Text style={styles.subTitle}>Order List</Text>
        <Text style={styles.totalItems}>Total Items: {orders.length}</Text>
      </View>
      <View style={{ width: 300 }}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList data={filteredOrders} renderItem={renderItem} keyExtractor={(item) => item.OrderNo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
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
    margin: 5,
  },
  searchInput: {
    width: 200,
  },
  orderDatePicker: {
    width: 100,
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
    marginTop: 20,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalItems: {
    fontSize: 14,
    color: "#888",
  },
  addButton: {
    backgroundColor: "#000",
    width: 60,
    height: 30,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 11,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 5,
  },
});

export default OrderScreen;
