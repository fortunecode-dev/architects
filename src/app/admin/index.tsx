import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  status: "Active" | "Inactive" | "Pending";
}

export default function ClientsPage() {
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

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const initialClients: any = [
          {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+1 555-123-4567",
            address: "123 Main St, Anytown, USA",
            status: "Active",
          },
          {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            phone: "+1 555-987-6543",
            address: "456 Oak Ave, Somewhere, USA",
            status: "Inactive",
          },
          {
            id: 3,
            firstName: "Robert",
            lastName: "Johnson",
            email: "robert.j@example.com",
            phone: "+1 555-456-7890",
            address: "789 Pine Rd, Nowhere, USA",
            status: "Active",
          },
          {
            id: 4,
            firstName: "Emily",
            lastName: "Williams",
            email: "emily.w@example.com",
            phone: "+1 555-789-0123",
            address: "321 Elm Blvd, Anywhere, USA",
            status: "Pending",
          },
        ];
        setClients(initialClients);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

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
      client.firstName.toLowerCase().includes(filter.toLowerCase()) ||
      client.lastName.toLowerCase().includes(filter.toLowerCase()) ||
      client.email.toLowerCase().includes(filter.toLowerCase()) ||
      client.phone.toLowerCase().includes(filter.toLowerCase()) ||
      client.address.toLowerCase().includes(filter.toLowerCase()) ||
      client.status.toLowerCase().includes(filter.toLowerCase())
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setClients(clients.filter((client) => client.id !== id));
    } finally {
      setLoading(false);
    }
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

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Clients Management</Text>
        <Link href="/new-client" asChild>
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortButtonsContainer}
        >
          <Text style={styles.sortLabel}>Sort by:</Text>
          {["firstName", "lastName", "email", "status"].map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => requestSort(key as keyof Client)}
              style={styles.sortButton}
            >
              <Text
                style={{
                  ...styles.sortButtonText,
                 ...( sortConfig.key === key && styles.activeSortButtonText),
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
      </View>

      {/* Clients Table */}
      {loading && clients.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <View style={styles.tableOuterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <View style={{...styles.headerCell, ...styles.firstNameCell}}>
                  <Text style={styles.tableHeaderText}>First Name</Text>
                </View>
                <View style={{...styles.headerCell, ...styles.lastNameCell}}>
                  <Text style={styles.tableHeaderText}>Last Name</Text>
                </View>
                <View style={{...styles.headerCell, ...styles.emailCell}}>
                  <Text style={styles.tableHeaderText}>Email</Text>
                </View>
                <View style={{...styles.headerCell, ...styles.phoneCell}}>
                  <Text style={styles.tableHeaderText}>Phone</Text>
                </View>
                <View style={{...styles.headerCell, ...styles.addressCell}}>
                  <Text style={styles.tableHeaderText}>Address</Text>
                </View>
                <View style={{...styles.headerCell, ...styles.statusCell}}>
                  <Text style={styles.tableHeaderText}>Status</Text>
                </View>
                <View style={{...styles.headerCell, ...styles.actionsCell}}>
                  <Text style={styles.tableHeaderText}>Actions</Text>
                </View>
              </View>

              {/* Table Rows */}
              <ScrollView
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
                  filteredClients.map((client) => (
                    <View key={client.id} style={styles.tableRow}>
                      <View style={{...styles.dataCell, ...styles.firstNameCell}}>
                        <Text style={styles.cellText}>{client.firstName}</Text>
                      </View>
                      <View style={{...styles.dataCell, ...styles.lastNameCell}}>
                        <Text style={styles.cellText}>{client.lastName}</Text>
                      </View>
                      <View style={{...styles.dataCell, ...styles.emailCell}}>
                        <Text style={styles.cellText} numberOfLines={1}>
                          {client.email}
                        </Text>
                      </View>
                      <View style={{...styles.dataCell, ...styles.phoneCell}}>
                        <Text style={styles.cellText}>{client.phone}</Text>
                      </View>
                      <View style={{...styles.dataCell, ...styles.addressCell}}>
                        <Text style={styles.cellText} numberOfLines={2}>
                          {client.address}
                        </Text>
                      </View>
                      <View style={{...styles.dataCell, ...styles.statusCell}}>
                        <View
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: getStatusColor(client.status),
                          }}
                        >
                          <Text style={styles.statusText}>{client.status}</Text>
                        </View>
                      </View>
                      <View style={{...styles.dataCell, ...styles.actionsCell}}>
                        <Link href={`/edit-client/${client.id}`} asChild>
                          <TouchableOpacity
                            style={{...styles.actionButton, ...styles.editButton}}
                          >
                            <MaterialIcons
                              name="edit"
                              size={18}
                              color="white"
                            />
                          </TouchableOpacity>
                        </Link>
                        <TouchableOpacity
                          style={{...styles.actionButton, ...styles.deleteButton}}
                          onPress={() => handleDelete(client.id)}
                        >
                          <MaterialIcons
                            name="delete"
                            size={18}
                            color="white"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
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
          </ScrollView>
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
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
    justifyContent: "center",
  },
  dataCell: {
    padding: 16,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: "#E2E8F0",
    borderBottomColor: "#E2E8F0",
    justifyContent: "center",
  },
  tableRow: {
    flexDirection: "row",
  },
  // Column width definitions
  firstNameCell: {
    width: 120,
  },
  lastNameCell: {
    width: 120,
  },
  emailCell: {
    width: 200,
  },
  phoneCell: {
    width: 150,
  },
  addressCell: {
    width: 200,
  },
  statusCell: {
    width: 100,
  },
  actionsCell: {
    width: 120,
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
    minWidth: "100%",
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
  },
  tableHeaderText: {
    fontWeight: "700",
    color: "#334155",
    fontSize: 14,
  },
});
