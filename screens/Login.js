import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { saveToken } from "../redux/actions";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSubmitPress = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://dev.profescipta.co.id/so-api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=profes-api&client_secret=P@ssw0rd`,
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        dispatch(saveToken(token));
        setLoading(false);
        navigation.navigate("OrderScreen");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Username" onChangeText={setUsername} value={username} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <TouchableOpacity style={styles.loginButton} onPress={handleSubmitPress} disabled={loading}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    width: 300,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  loginButton: {
    backgroundColor: "#000",
    width: 300,
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LoginScreen;
