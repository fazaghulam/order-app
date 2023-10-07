import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, TextInput } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";

const OrderDetailScreen = () => {
  const token = useSelector((state) => state.auth.token);
  const route = useRoute();
  const order = route.params.order;
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedItemId, setEditedItemId] = useState(null);
  const [editedItemName, setEditedItemName] = useState("");
  const [editedItemQuantity, setEditedItemQuantity] = useState("");
  const [editedItemPrice, setEditedItemPrice] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  const renderItem = ({ item }) => {
    const handleDeleteItem = (itemId) => {
      setSelectedItemId(itemId);
      setDeleteModalVisible(true);
    };
    const handleEditItem = (itemId, itemName, quantity, price) => {
      setEditedItemId(itemId);
      setEditedItemName(itemName);
      setEditedItemQuantity(quantity.toString());
      setEditedItemPrice(price.toString());
      setEditModalVisible(true);
    };
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
          <TouchableOpacity onPress={() => handleEditItem(item.ItemId, item.ItemName, item.Quantity, item.Price)}>
            <Image style={{ width: 18, height: 18, marginRight: 10 }} source={require("../assets/edit.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteItem(item.ItemId)}>
            <Image style={{ width: 18, height: 18 }} source={require("../assets/delete.png")} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch("https://dev.profescipta.co.id/so-api/Order/DeleteItem", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          state: "12345",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ItemId: selectedItemId,
        }),
      });

      if (response.ok) {
        const updatedItems = items.filter((i) => i.ItemId !== selectedItemId);
        setItems(updatedItems);
        setDeleteModalVisible(false);
        setSelectedItemId(null);
      } else {
        // Handle error
        console.error("Failed to delete the item");
      }
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  const handleCreateItem = async () => {
    try {
      const response = await fetch("https://dev.profescipta.co.id/so-api/Order/CreateItem", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          state: "12345",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ItemId: Math.floor(Math.random() * 1000), // Generate a random ItemId
          ItemName: newItemName,
          Quantity: parseInt(newItemQuantity),
          Price: parseInt(newItemPrice),
        }),
      });

      if (response.ok) {
        const newItem = {
          ItemId: Math.floor(Math.random() * 1000), // Generate a random ItemId
          ItemName: newItemName,
          Quantity: parseInt(newItemQuantity),
          Price: parseInt(newItemPrice),
        };
        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        setCreateModalVisible(false);
        setNewItemName("");
        setNewItemQuantity("");
        setNewItemPrice("");
      } else {
        // Handle error
        console.error("Failed to create a new item");
      }
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  const handleEditItemSubmit = async () => {
    try {
      const response = await fetch("https://dev.profescipta.co.id/so-api/Order/UpdateItem", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          state: "12345",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ItemId: editedItemId,
          ItemName: editedItemName,
          Quantity: parseInt(editedItemQuantity),
          Price: parseInt(editedItemPrice),
        }),
      });

      if (response.ok) {
        // Update the item in the local state with the edited data
        const updatedItems = items.map((item) => {
          if (item.ItemId === editedItemId) {
            return {
              ...item,
              ItemName: editedItemName,
              Quantity: parseInt(editedItemQuantity),
              Price: parseInt(editedItemPrice),
            };
          }
          return item;
        });

        setItems(updatedItems);
        setEditModalVisible(false);
        setEditedItemId(null);
        setEditedItemName("");
        setEditedItemQuantity("");
        setEditedItemPrice("");
      } else {
        // Handle error
        console.error("Failed to update the item");
      }
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("https://dev.profescipta.co.id/so-api/Order/GetItems", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            state: "12345",
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
        <TouchableOpacity style={styles.addButton} onPress={() => setCreateModalVisible(true)}>
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
      {(items.length && <FlatList data={items} renderItem={renderItem} keyExtractor={(item) => item.ItemName} />) || (
        <Text style={{ margin: 20 }}>No Data Available</Text>
      )}

      <Modal isVisible={isDeleteModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirm Deletion</Text>
          <Text style={styles.modalText}>Are you sure you want to delete this item?</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.modalButtonCancel}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirmDelete} style={styles.modalButtonDelete}>
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal isVisible={isCreateModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create New Item</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Item Name"
            placeholderTextColor="#ccc"
            value={newItemName}
            onChangeText={(text) => setNewItemName(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Quantity"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={newItemQuantity}
            onChangeText={(text) => setNewItemQuantity(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Price"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={newItemPrice}
            onChangeText={(text) => setNewItemPrice(text)}
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity onPress={() => setCreateModalVisible(false)} style={styles.modalButtonCancel}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreateItem} style={styles.modalButtonCreate}>
              <Text style={styles.modalButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal isVisible={isEditModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Item</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Item Name"
            placeholderTextColor="#ccc"
            value={editedItemName}
            onChangeText={(text) => setEditedItemName(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Quantity"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={editedItemQuantity}
            onChangeText={(text) => setEditedItemQuantity(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Price"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={editedItemPrice}
            onChangeText={(text) => setEditedItemPrice(text)}
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.modalButtonCancel}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEditItemSubmit} style={styles.modalButtonCreate}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
  },
  modalTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  modalButtonCancel: {
    backgroundColor: "steelblue",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 5,
  },
  modalButtonDelete: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  modalButtonCreate: {
    backgroundColor: "green",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalInput: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
});

export default OrderDetailScreen;
