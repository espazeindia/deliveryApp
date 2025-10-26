import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  RefreshControl,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { deliveryAPI, profileAPI, earningsAPI } from '../../services/api';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    todayDeliveries: 0,
    todayEarnings: 0,
    activeOrders: 0,
    weeklyDeliveries: 0,
  });
  const [activeOrders, setActiveOrders] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ordersResponse, earningsResponse] = await Promise.all([
        deliveryAPI.getActiveOrders(),
        earningsAPI.getEarnings('today'),
      ]);

      setActiveOrders(ordersResponse.orders || []);
      setStats({
        todayDeliveries: earningsResponse.deliveriesCount || 0,
        todayEarnings: earningsResponse.totalEarnings || 0,
        activeOrders: ordersResponse.orders?.length || 0,
        weeklyDeliveries: earningsResponse.weeklyCount || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const toggleAvailability = async (value) => {
    setIsAvailable(value);
    try {
      await profileAPI.toggleAvailability(value);
    } catch (error) {
      console.error('Error updating availability:', error);
      setIsAvailable(!value);
    }
  };

  const StatCard = ({ icon, label, value, color }) => (
    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );

  const OrderCard = ({ order }) => (
    <TouchableOpacity
      style={[styles.orderCard, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('Orders', { screen: 'OrderDetails', params: { orderId: order.id } })}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={[styles.orderId, { color: colors.text }]}>Order #{order.orderId}</Text>
          <Text style={[styles.orderTime, { color: colors.textSecondary }]}>
            {new Date(order.createdAt).toLocaleTimeString()}
          </Text>
        </View>
        <View style={[styles.orderBadge, { backgroundColor: colors.warning + '20' }]}>
          <Text style={[styles.orderBadgeText, { color: colors.warning }]}>In Progress</Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <View style={styles.orderRow}>
          <MaterialCommunityIcons name="map-marker" size={16} color={colors.textSecondary} />
          <Text style={[styles.orderAddress, { color: colors.textSecondary }]} numberOfLines={1}>
            {order.address}
          </Text>
        </View>
        <View style={styles.orderRow}>
          <MaterialCommunityIcons name="package-variant" size={16} color={colors.textSecondary} />
          <Text style={[styles.orderItems, { color: colors.textSecondary }]}>
            {order.itemsCount} items
          </Text>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <Text style={[styles.orderAmount, { color: colors.primary }]}>
          ₹{order.amount}
        </Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{user?.name || 'Delivery Partner'}</Text>
          </View>
          <View style={styles.availabilityContainer}>
            <Text style={styles.availabilityLabel}>
              {isAvailable ? 'Available' : 'Offline'}
            </Text>
            <Switch
              value={isAvailable}
              onValueChange={toggleAvailability}
              trackColor={{ false: '#9CA3AF', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard
              icon="truck-delivery"
              label="Today's Deliveries"
              value={stats.todayDeliveries}
              color={colors.primary}
            />
            <StatCard
              icon="cash-multiple"
              label="Today's Earnings"
              value={`₹${stats.todayEarnings}`}
              color={colors.success}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              icon="package-variant-closed"
              label="Active Orders"
              value={stats.activeOrders}
              color={colors.warning}
            />
            <StatCard
              icon="chart-line"
              label="This Week"
              value={stats.weeklyDeliveries}
              color={colors.secondary}
            />
          </View>
        </View>

        {/* Active Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {activeOrders.length > 0 ? (
            activeOrders.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
              <MaterialCommunityIcons name="package-variant" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No active orders
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                {isAvailable ? 'New orders will appear here' : 'Turn on availability to receive orders'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  availabilityContainer: {
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 4,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
  },
  orderBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderAddress: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  orderItems: {
    fontSize: 14,
    marginLeft: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DashboardScreen;

