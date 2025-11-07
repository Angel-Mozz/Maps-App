import { StatusBar } from "expo-status-bar";
import { useState, useEffect, use } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permiso a acceder ubicación denegado");
        setLoading(false);
        return;
      }
      let lastKnown = await Location.getLastKnownPositionAsync({});
      if (lastKnown) {
        setLocation(lastKnown.coords);
        setLoading(false);
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        maximumAge: 10000,
      });
      setLocation(currentLocation.coords);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>📍 Obteniendo ubicación...</Text>
      </View>
    );
  }
  if (error || !location) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Error desconocido"}</Text>
        <TouchableOpacity onPress={getLocation} style={styles.button}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="tu ubicacion"
          description={
            "Long: " + location.longitude + "Lat: " + location.latitude
          }
          pinColor="red"
        />
      </MapView>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>📍 Tu Ubicacion</Text>
        <Text style={styles.infoText}>Lat: {location.latitude}</Text>
        <Text style={styles.infoText}>Long: {location.longitude}</Text>
      </View>

      <TouchableOpacity style={styles.refreshFab}>
        <Text style={styles.buttonText}> 🔄️ Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#222222",
  },
  errorText: {
    fontSize: 14,
    color: "#B00020",
    textAlign: "center",
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  map: {
    flex: 1,
    width: "100%",
  },

  infoContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    padding: 30,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5E5",
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#333333",
  },

  refreshFab: {
    position: "absolute",
    bottom: 40,
    right: 16,
    alignSelf: "center",
    backgroundColor: "#1E88E5",
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderRadius: 24,
    elevation: 10,
  },
});
