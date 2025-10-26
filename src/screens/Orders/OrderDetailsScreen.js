import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../contexts/ThemeContext';
import { deliveryAPI } from '../../services/api';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const response = await deliveryAPI.getOrderDetails(orderId);
      setOrder(response.order);
    } catch (error) {
      console.error('Error loading order details:', error);
      Alert.alert('Error', 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async () => {
    try {
      await deliveryAPI.acceptOrder(orderId);
      loadOrderDetails();
      Alert.alert('Success', 'Order accepted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to accept order');
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await deliveryAPI.updateOrderStatus(orderId, status, {
        latitude: 0,
        longitude: 0,
      });
      loadOrderDetails();
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const handleCompleteDelivery = () => {
    Alert.alert(
      'Complete Delivery',
      'Are you sure you want to mark this delivery as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              await deliveryAPI.completeDelivery(orderId, {
                latitude: 0,
                longitude: 0,
              });
              navigation.goBack();
              Alert.alert('Success', 'Delivery completed successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to complete delivery');
            }
          },
        },
      ]
    );
  };

  if (loading || !order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  const getStatusSteps = () => {
    const steps = ['pending', 'picked_up', 'in_transit', 'delivered'];
    const currentIndex = steps.indexOf(order.status);
    
    return steps.map((step, index) => ({
      label: step.replace('_', ' ').toUpperCase(),
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Order Info Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.orderId, { color: colors.text }]}>Order #{order.orderId}</Text>
          <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
            {new Date(order.createdAt).toLocaleString()}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Customer Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Customer Details</Text>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{order.customerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{order.customerPhone}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.text, flex: 1 }]}>
                {order.address}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Items</Text>
            {order.items?.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={[styles.itemName, { color: colors.text }]}>
                  {item.name} x {item.quantity}
                </Text>
                <Text style={[styles.itemPrice, { color: colors.textSecondary }]}>
                  ₹{item.price}
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Payment Info */}
          <View style={styles.section}>
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: colors.textSecondary }]}>Subtotal</Text>
              <Text style={[styles.paymentValue, { color: colors.text }]}>₹{order.subtotal}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: colors.textSecondary }]}>Delivery Fee</Text>
              <Text style={[styles.paymentValue, { color: colors.text }]}>₹{order.deliveryFee}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.paymentRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>₹{order.amount}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Status */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Status</Text>
          <View style={styles.statusTrack}>
            {getStatusSteps().map((step, index) => (
              <View key={index} style={styles.statusStep}>
                <View style={styles.statusIconContainer}>
                  <View
                    style={[
                      styles.statusIcon,
                      {
                        backgroundColor: step.completed ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    {step.completed && (
                      <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  {index < getStatusSteps().length - 1 && (
                    <View
                      style={[
                        styles.statusLine,
                        {
                          backgroundColor: step.completed ? colors.primary : colors.border,
                        },
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.statusLabel,
                    { color: step.completed ? colors.text : colors.textSecondary },
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Your Earnings */}
        <View style={[styles.earningsCard, { backgroundColor: colors.success + '20' }]}>
          <MaterialCommunityIcons name="cash-multiple" size={32} color={colors.success} />
          <View style={styles.earningsInfo}>
            <Text style={[styles.earningsLabel, { color: colors.success }]}>Your Earning</Text>
            <Text style={[styles.earningsValue, { color: colors.success }]}>
              ₹{order.deliveryFee || 50}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {order.status === 'pending' && (
        <View style={[styles.footer, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleAcceptOrder}
          >
            <Text style={styles.actionButtonText}>Accept Order</Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === 'picked_up' && (
        <View style={[styles.footer, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => handleUpdateStatus('in_transit')}
          >
            <Text style={styles.actionButtonText}>Start Delivery</Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === 'in_transit' && (
        <View style={[styles.footer, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.success }]}
            onPress={handleCompleteDelivery}
          >
            <Text style={styles.actionButtonText}>Complete Delivery</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderId: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
  },
  paymentValue: {
    fontSize: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusTrack: {
    marginTop: 8,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusIconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  statusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusLine: {
    width: 2,
    height: 24,
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 14,
    paddingTop: 4,
  },
  earningsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  earningsInfo: {
    marginLeft: 16,
  },
  earningsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  earningsValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetailsScreen;

