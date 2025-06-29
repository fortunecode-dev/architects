import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { Link, router, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  deleteProspect,
  getActiveProspects,
} from "@/services/prospect.service";

interface Client {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  status: string[];
}

export default function ClientsPage() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768; // Tablet breakpoint
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Client | null;
    direction: "ascending" | "descending";
  }>({
    key: null,
    direction: "ascending",
  });
  const [filter, setFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchClients();
    }, [])
  );

  const fetchClients = async () => {
    setLoading(true);
    try {
      const initialClients = await getActiveProspects();
      setClients(initialClients);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const requestSort = (key: keyof Client) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedClients = [...clients].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredClients = sortedClients.filter(
    (client) =>
      client.name?.toLowerCase().includes(filter.toLowerCase()) ||
      client.lastName?.toLowerCase().includes(filter.toLowerCase()) ||
      client.email?.toLowerCase().includes(filter.toLowerCase()) ||
      client.phone?.toLowerCase().includes(filter.toLowerCase()) ||
      client.address?.toLowerCase().includes(filter.toLowerCase()) ||
      client.status?.toLowerCase().includes(filter.toLowerCase())
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchClients();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteProspect(id);
    } catch {
      setLoading(false);
      alert("An error has occurred deleting this prospect");
    }
    fetchClients();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "#10B981";
      case "Inactive":
        return "#EF4444";
      case "Pending":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const renderClientRow = (client: Client) => {
    if (isSmallScreen) {
      return (
        <View key={client.id} style={styles.mobileCard}>
          <View style={styles.mobileCardHeader}>
            <Text style={styles.mobileCardTitle}>
              {client.name} {client.lastName}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(client.status) },
              ]}
            >
              <Text style={styles.statusText}>{client.status}</Text>
            </View>
          </View>

          <View style={styles.mobileCardRow}>
            <MaterialIcons name="email" size={16} color="#64748B" />
            <Text style={styles.mobileCardText} numberOfLines={1}>
              {client.email}
            </Text>
          </View>

          <View style={styles.mobileCardRow}>
            <MaterialIcons name="phone" size={16} color="#64748B" />
            <Text style={styles.mobileCardText}>{client.phone}</Text>
          </View>

          <View style={styles.mobileCardRow}>
            <MaterialIcons name="location-on" size={16} color="#64748B" />
            <Text style={styles.mobileCardText} numberOfLines={2}>
              {client.address}
            </Text>
          </View>

          <View style={styles.mobileCardActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() =>
                router.push({
                  pathname: "/admin/client",
                  params: { id: client.id },
                })
              }
            >
              <MaterialIcons name="edit" size={18} color="white" />
              <Text style={styles.mobileActionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDelete(client.id)}
            >
              <MaterialIcons name="delete" size={18} color="white" />
              <Text style={styles.mobileActionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View key={client.id} style={styles.tableRow}>
        <View style={{ ...styles.dataCell, ...styles.nameCell }}>
          <Text style={styles.cellText}>{client.name}</Text>
        </View>
        <View style={{ ...styles.dataCell, ...styles.lastNameCell }}>
          <Text style={styles.cellText}>{client.lastName}</Text>
        </View>
        <View style={{ ...styles.dataCell, ...styles.emailCell }}>
          <Text style={styles.cellText} numberOfLines={1}>
            {client.email}
          </Text>
        </View>
        <View style={{ ...styles.dataCell, ...styles.phoneCell }}>
          <Text style={styles.cellText}>{client.phone}</Text>
        </View>
        <View style={{ ...styles.dataCell, ...styles.addressCell }}>
          <Text style={styles.cellText} numberOfLines={2}>
            {client.address}
          </Text>
        </View>
        <View style={{ ...styles.dataCell, ...styles.statusCell }}>
          <View
            style={{
              ...styles.statusBadge,
              backgroundColor: getStatusColor(client.status),
            }}
          >
            <Text style={styles.statusText}>{client.status.join(", ")}</Text>
          </View>
        </View>
        <View style={{ ...styles.dataCell, ...styles.actionsCell }}>
          <TouchableOpacity
            style={{
              ...styles.actionButton,
              ...styles.editButton,
            }}
            onPress={() =>
              router.push({
                pathname: "/admin/client",
                params: { id: client.id,mode:"view" ,}
              },{})
            }
          >
            <MaterialIcons name="edit" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.actionButton,
              ...styles.deleteButton,
            }}
            onPress={() => handleDelete(client.id)}
          >
            <MaterialIcons name="delete" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Clients Management</Text>
        <Link href="/admin/client" asChild>
          <TouchableOpacity style={styles.newClientButton}>
            <MaterialIcons name="add" size={20} color="white" />
            <Text style={styles.newClientButtonText}>New Client</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Filter and Sort Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={20}
            color="#64748B"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients..."
            placeholderTextColor="#94A3B8"
            value={filter}
            onChangeText={setFilter}
          />
        </View>

        {!isSmallScreen && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortButtonsContainer}
          >
            <Text style={styles.sortLabel}>Sort by:</Text>
            {["name", "lastName", "email", "status"].map((key) => (
              <TouchableOpacity
                key={key}
                onPress={() => requestSort(key as keyof Client)}
                style={styles.sortButton}
              >
                <Text
                  style={{
                    ...styles.sortButtonText,
                    ...(sortConfig.key === key && styles.activeSortButtonText),
                  }}
                >
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1")}
                  {sortConfig.key === key && (
                    <MaterialIcons
                      name={
                        sortConfig.direction === "ascending"
                          ? "arrow-upward"
                          : "arrow-downward"
                      }
                      size={16}
                      color="#3B82F6"
                    />
                  )}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Clients Table */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <View style={styles.tableOuterContainer}>
          {isSmallScreen ? (
            <ScrollView
              style={styles.fullWidthScroll}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#3B82F6"]}
                  tintColor="#3B82F6"
                />
              }
            >
              {filteredClients.length > 0 ? (
                filteredClients.map(renderClientRow)
              ) : (
                <View style={styles.noResults}>
                  <MaterialIcons name="search-off" size={40} color="#94A3B8" />
                  <Text style={styles.noResultsText}>
                    {clients.length === 0
                      ? "No clients available"
                      : "No matching clients found"}
                  </Text>
                </View>
              )}
            </ScrollView>
          ) : (
            <View style={styles.fullWidthTableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <View style={{ ...styles.headerCell, ...styles.nameCell }}>
                  <Text style={styles.tableHeaderText}>First Name</Text>
                </View>
                <View style={{ ...styles.headerCell, ...styles.lastNameCell }}>
                  <Text style={styles.tableHeaderText}>Last Name</Text>
                </View>
                <View style={{ ...styles.headerCell, ...styles.emailCell }}>
                  <Text style={styles.tableHeaderText}>Email</Text>
                </View>
                <View style={{ ...styles.headerCell, ...styles.phoneCell }}>
                  <Text style={styles.tableHeaderText}>Phone</Text>
                </View>
                <View style={{ ...styles.headerCell, ...styles.addressCell }}>
                  <Text style={styles.tableHeaderText}>Address</Text>
                </View>
                <View style={{ ...styles.headerCell, ...styles.statusCell }}>
                  <Text style={styles.tableHeaderText}>Status</Text>
                </View>
                <View style={{ ...styles.headerCell, ...styles.actionsCell }}>
                  <Text style={styles.tableHeaderText}>Actions</Text>
                </View>
              </View>

              {/* Table Rows */}
              <ScrollView
                style={styles.fullWidthScroll}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#3B82F6"]}
                    tintColor="#3B82F6"
                  />
                }
              >
                {filteredClients.length > 0 ? (
                  filteredClients.map(renderClientRow)
                ) : (
                  <View style={styles.noResults}>
                    <MaterialIcons
                      name="search-off"
                      size={40}
                      color="#94A3B8"
                    />
                    <Text style={styles.noResultsText}>
                      {clients.length === 0
                        ? "No clients available"
                        : "No matching clients found"}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
  },
  newClientButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  newClientButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  controlsContainer: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: "#1E293B",
    fontSize: 16,
  },
  sortButtonsContainer: {
    alignItems: "center",
    gap: 12,
    paddingRight: 16,
  },
  sortLabel: {
    color: "#64748B",
    fontWeight: "600",
    marginRight: 4,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
  },
  sortButtonText: {
    color: "#64748B",
    fontWeight: "500",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activeSortButtonText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  tableOuterContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: "100%", // Asegura que ocupe todo el ancho disponible
  },
  fullWidthTableContainer: {
    flex: 1,
    width: "100%",
  },
  fullWidthScroll: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: "100%", // Ocupa todo el ancho
  },
  headerCell: {
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
    justifyContent: "center",
    flex: 1, // Hace que las celdas se expandan equitativamente
    minWidth: 100, // Ancho mínimo para cada celda
  },
  dataCell: {
    padding: 16,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: "#E2E8F0",
    borderBottomColor: "#E2E8F0",
    justifyContent: "center",
    flex: 1, // Hace que las celdas se expandan equitativamente
    minWidth: 100, // Ancho mínimo para cada celda
  },
  tableRow: {
    flexDirection: "row",
    width: "100%", // Ocupa todo el ancho
  },
  // Column width definitions (ahora usamos flex en lugar de width fijo)
  nameCell: {
    flex: 1.2,
  },
  lastNameCell: {
    flex: 1.2,
  },
  emailCell: {
    flex: 1.5,
  },
  phoneCell: {
    flex: 1.3,
  },
  addressCell: {
    flex: 1.8,
  },
  statusCell: {
    flex: 1,
  },
  actionsCell: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  cellText: {
    color: "#334155",
    fontSize: 14,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#3B82F6",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  noResults: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  noResultsText: {
    marginTop: 12,
    color: "#64748B",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    width: "100%",
  },
  tableHeaderText: {
    fontWeight: "700",
    color: "#334155",
    fontSize: 14,
  },
  // Mobile styles
  mobileCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    width: "100%",
  },
  mobileCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  mobileCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  mobileCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 4,
  },
  mobileCardText: {
    color: "#334155",
    fontSize: 14,
    flex: 1,
  },
  mobileCardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  mobileActionText: {
    color: "white",
    fontSize: 12,
    marginLeft: 4,
  },
});
