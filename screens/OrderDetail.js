import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

const OrderDetailScreen = () => {
  const token = useSelector((state) => state.auth.token);
  const route = useRoute();
  const order = route.params.order;
  const [items, setItems] = useState([]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.listItem}>
        <View>
          <Text style={{ fontWeight: "bold" }}>{item.ItemName}</Text>
          <Text>{item.Price}</Text>
        </View>
        <View>
          <Text>QTY</Text>
          <Text>{item.Quantity}</Text>
        </View>
        <View>
          <Text>Total</Text>
          <Text>{item.Price * item.Quantity}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image style={{ width: 15, height: 15, marginRight: 8 }} source={require("../assets/edit.png")} />
          <Image style={{ width: 15, height: 15 }} source={require("../assets/delete.png")} />
        </View>
      </View>
    );
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("https://dev.profescipta.co.id/so-api/Order/GetItems", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            state: "12345", // Add the custom header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          // Handle error
        }
      } catch (error) {
        // Handle error
      }
    };

    fetchItems();
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <View style={{ width: 300 }}>
        <Text style={styles.subTitle}>Sales Information</Text>
      </View>
      <View style={{ width: 300 }}>
        <Text style={styles.infoTitle}>Order Number</Text>
      </View>
      <View style={styles.textContainer}>
        <Text>{order.OrderNo}</Text>
      </View>
      <View style={{ width: 300 }}>
        <Text style={styles.infoTitle}>Order Date</Text>
      </View>
      <View style={styles.textContainer}>
        <Text>{order.OrderDate}</Text>
      </View>
      <View style={{ width: 300 }}>
        <Text style={styles.infoTitle}>Customer Name</Text>
      </View>
      <View style={styles.textContainer}>
        <Text>{order.CustomerName}</Text>
      </View>
      <View style={{ width: 300, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.subTitle}>Detail Sales</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
      {(items.length && <FlatList data={items} renderItem={renderItem} keyExtractor={(item) => item.OrderId} />) || (
        <Text style={{ margin: 20 }}>No Data Available</Text>
      )}
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
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
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
  textContainer: {
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
  infoTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ccc",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginBottom: 5,
  },
});

export default OrderDetailScreen;
