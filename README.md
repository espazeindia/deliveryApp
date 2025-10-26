# Espaze Delivery Partner App

A modern React Native mobile application for delivery partners built with Expo. This app provides delivery partners with tools to manage orders, track earnings, and maintain their profile.

## Features

- 🔐 **Authentication** - Secure login with PIN and OTP verification
- 📦 **Order Management** - View and manage active deliveries and order history
- 💰 **Earnings Tracking** - Real-time earnings tracking with detailed history
- 📊 **Dashboard** - Comprehensive dashboard with key metrics and statistics
- 👤 **Profile Management** - User profile with settings and preferences
- 🌓 **Dark Mode** - Support for light and dark themes
- 🗺️ **Location Services** - Real-time location tracking for deliveries

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development and build toolchain
- **React Navigation** - Navigation library
- **Axios** - HTTP client
- **AsyncStorage** - Local data persistence
- **React Native Vector Icons** - Icon library
- **Expo Linear Gradient** - Gradient backgrounds
- **Expo Location** - Location services

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)
- Expo Go app on your physical device (optional)

## Installation

1. Clone the repository:
```bash
cd deliveryApp
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoint:
Update the `API_BASE_URL` in `src/services/api.js` with your backend URL:
```javascript
const API_BASE_URL = 'http://your-backend-url:8081/api/v1';
```

## Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
```

This will open the Expo Developer Tools in your browser. From there you can:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan QR code with Expo Go app on your device

### Platform Specific

Run on iOS:
```bash
npm run ios
```

Run on Android:
```bash
npm run android
```

Run on Web:
```bash
npm run web
```

## Project Structure

```
deliveryApp/
├── App.js                      # Root component
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── babel.config.js             # Babel configuration
└── src/
    ├── navigation/             # Navigation configuration
    │   ├── AppNavigator.js     # Main app navigator
    │   └── MainTabNavigator.js # Bottom tab navigator
    ├── screens/                # Screen components
    │   ├── Auth/               # Authentication screens
    │   │   ├── LoginScreen.js
    │   │   └── OTPScreen.js
    │   ├── Dashboard/          # Dashboard screen
    │   │   └── DashboardScreen.js
    │   ├── Orders/             # Order screens
    │   │   ├── OrdersScreen.js
    │   │   └── OrderDetailsScreen.js
    │   ├── Earnings/           # Earnings screen
    │   │   └── EarningsScreen.js
    │   └── Profile/            # Profile screen
    │       └── ProfileScreen.js
    ├── contexts/               # React contexts
    │   ├── AuthContext.js      # Authentication state
    │   └── ThemeContext.js     # Theme management
    └── services/               # API services
        └── api.js              # API client and endpoints
```

## API Integration

The app communicates with the backend API at the following endpoints:

### Authentication
- `POST /api/v1/delivery/login` - Login with phone and PIN
- `POST /api/v1/delivery/request-otp` - Request OTP
- `POST /api/v1/delivery/verify-otp` - Verify OTP

### Deliveries
- `GET /api/v1/delivery/orders/active` - Get active orders
- `GET /api/v1/delivery/orders/history` - Get order history
- `GET /api/v1/delivery/orders/:id` - Get order details
- `POST /api/v1/delivery/orders/:id/accept` - Accept order
- `POST /api/v1/delivery/orders/:id/status` - Update order status
- `POST /api/v1/delivery/orders/:id/complete` - Complete delivery

### Profile
- `GET /api/v1/delivery/profile` - Get profile
- `PUT /api/v1/delivery/profile` - Update profile
- `POST /api/v1/delivery/location` - Update location
- `POST /api/v1/delivery/availability` - Toggle availability

### Earnings
- `GET /api/v1/delivery/earnings` - Get earnings
- `GET /api/v1/delivery/earnings/history` - Get earnings history

## Environment Variables

Create a `.env` file in the root directory (if needed):
```
API_BASE_URL=http://localhost:8081/api/v1
```

## Design

The app follows the design language of the Espaze web application with:
- Modern, clean UI with rounded corners
- Consistent color scheme (Purple/Violet primary colors)
- Smooth transitions and animations
- Responsive layouts
- Dark mode support

## Key Features

### Dashboard
- Real-time availability toggle
- Quick stats (deliveries, earnings, active orders)
- Active orders list
- Swipe to refresh

### Orders
- Active and completed orders tabs
- Order status tracking
- Detailed order information
- One-tap actions (accept, pickup, complete)

### Earnings
- Period-based earnings (today, week, month)
- Transaction history
- Earnings breakdown
- Performance metrics

### Profile
- User information
- Statistics overview
- App settings
- Support links
- Logout functionality

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

For more details on building standalone apps, see [Expo documentation](https://docs.expo.dev/build/introduction/).

## Troubleshooting

### Metro Bundler Issues
```bash
expo start -c
```

### Clear Cache
```bash
npm start -- --reset-cache
```

### iOS Simulator Not Opening
Make sure Xcode is installed and run:
```bash
sudo xcode-select --switch /Applications/Xcode.app
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly on both iOS and Android
4. Submit a pull request

## License

Proprietary - Espaze

## Support

For support, contact the development team or refer to the internal documentation.

