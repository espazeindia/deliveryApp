import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { earningsAPI } from '../../services/api';

const { width } = Dimensions.get('window');

const EarningsScreen = () => {
  const { colors } = useTheme();
  const [period, setPeriod] = useState('week'); // 'today', 'week', 'month'
  const [earnings, setEarnings] = useState({
    total: 0,
    deliveries: 0,
    avgPerDelivery: 0,
  });
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEarnings();
  }, [period]);

  const loadEarnings = async () => {
    try {
      const [earningsResponse, historyResponse] = await Promise.all([
        earningsAPI.getEarnings(period),
        earningsAPI.getEarningsHistory(10),
      ]);

      setEarnings({
        total: earningsResponse.totalEarnings || 0,
        deliveries: earningsResponse.deliveriesCount || 0,
        avgPerDelivery: earningsResponse.avgPerDelivery || 0,
      });

      setHistory(historyResponse.history || []);
    } catch (error) {
      console.error('Error loading earnings:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEarnings();
    setRefreshing(false);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      default:
        return 'This Week';
    }
  };

  const HistoryCard = ({ item }) => (
    <View style={[styles.historyCard, { backgroundColor: colors.card }]}>
      <View style={styles.historyLeft}>
        <View style={[styles.historyIcon, { backgroundColor: colors.success + '20' }]}>
          <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
        </View>
        <View style={styles.historyInfo}>
          <Text style={[styles.historyTitle, { color: colors.text }]}>
            Order #{item.orderId}
          </Text>
          <Text style={[styles.historyDate, { color: colors.textSecondary }]}>
            {new Date(item.completedAt).toLocaleDateString()} • {new Date(item.completedAt).toLocaleTimeString()}
          </Text>
        </View>
      </View>
      <Text style={[styles.historyAmount, { color: colors.success }]}>
        +₹{item.amount}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Earnings</Text>
        
        {/* Period Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.periodSelector}
        >
          <TouchableOpacity
            style={[
              styles.periodButton,
              period === 'today' && { backgroundColor: colors.primary },
              { backgroundColor: period === 'today' ? colors.primary : colors.background },
            ]}
            onPress={() => setPeriod('today')}
          >
            <Text
              style={[
                styles.periodText,
                { color: period === 'today' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              period === 'week' && { backgroundColor: colors.primary },
              { backgroundColor: period === 'week' ? colors.primary : colors.background },
            ]}
            onPress={() => setPeriod('week')}
          >
            <Text
              style={[
                styles.periodText,
                { color: period === 'week' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              This Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              period === 'month' && { backgroundColor: colors.primary },
              { backgroundColor: period === 'month' ? colors.primary : colors.background },
            ]}
            onPress={() => setPeriod('month')}
          >
            <Text
              style={[
                styles.periodText,
                { color: period === 'month' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              This Month
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Earnings Card */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.earningsCard}
        >
          <View style={styles.earningsHeader}>
            <MaterialCommunityIcons name="wallet" size={32} color="#FFFFFF" />
            <Text style={styles.earningsPeriod}>{getPeriodLabel()}</Text>
          </View>
          <Text style={styles.earningsAmount}>₹{earnings.total.toLocaleString()}</Text>
          <Text style={styles.earningsLabel}>Total Earnings</Text>

          <View style={styles.earningsStats}>
            <View style={styles.earningsStat}>
              <MaterialCommunityIcons name="truck-delivery" size={20} color="#FFFFFF" />
              <Text style={styles.earningsStatValue}>{earnings.deliveries}</Text>
              <Text style={styles.earningsStatLabel}>Deliveries</Text>
            </View>
            <View style={styles.earningsStatDivider} />
            <View style={styles.earningsStat}>
              <MaterialCommunityIcons name="chart-line" size={20} color="#FFFFFF" />
              <Text style={styles.earningsStatValue}>₹{earnings.avgPerDelivery}</Text>
              <Text style={styles.earningsStatLabel}>Avg/Delivery</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIconContainer, { backgroundColor: colors.success + '20' }]}>
              <MaterialCommunityIcons name="cash-plus" size={24} color={colors.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>₹{(earnings.total * 0.15).toFixed(0)}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Bonus</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIconContainer, { backgroundColor: colors.primary + '20' }]}>
              <MaterialCommunityIcons name="star" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>4.8</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={[styles.historyTitle, { color: colors.text }]}>Recent Transactions</Text>
          </View>

          {history.length > 0 ? (
            history.map((item, index) => <HistoryCard key={index} item={item} />)
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
              <MaterialCommunityIcons name="cash-remove" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No transactions yet
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
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  periodSelector: {
    marginBottom: 8,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  earningsCard: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  earningsPeriod: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.9,
  },
  earningsAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  earningsLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 24,
  },
  earningsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  earningsStat: {
    alignItems: 'center',
    flex: 1,
  },
  earningsStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  earningsStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  earningsStatLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
  },
  historySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  historyHeader: {
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 12,
    marginTop: 4,
  },
  historyAmount: {
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
    marginTop: 16,
  },
});

export default EarningsScreen;

