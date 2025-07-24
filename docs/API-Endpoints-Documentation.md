# LeafWheels API Endpoints Documentation

## Access Control Legend
- 🌐 **Public**: No authentication required
- 🔐 **User**: Authentication required + user ownership validation
- 👑 **Admin**: Admin role required
- 🔒 **Auth**: Authentication required (any user)

---

## AuthController (`/api/v1/auth`)

| Endpoint | Method | Access | Description |
|----------|--------|---------|-------------|
| `/signup` | POST | 🌐 Public | User registration |
| `/signin` | POST | 🌐 Public | User login |
| `/refresh` | POST | 🌐 Public | Token refresh |
| `/signout` | POST | 🌐 Public | User logout |
| `/forgot-password` | POST | 🌐 Public | Password reset initiation |
| `/reset-password` | POST | 🌐 Public | Password reset completion |

---

## VehicleController (`/api/v1/vehicle`)

| Endpoint | Method | Access | Description |
|----------|--------|---------|-------------|
| `/{vehicleId}` | GET | 🌐 Public | Get vehicle details by ID |
| `/all` | GET | 🌐 Public | Get all vehicles |
| `/filter` | GET | 🌐 Public | Filter vehicles with pagination |
| `/by-status` | GET | 🌐 Public | Get vehicles by status |
| `/excluding-status` | GET | 🌐 Public | Get vehicles excluding status |
| `/available` | GET | 🌐 Public | Get available vehicles |
| `/` | POST | 👑 Admin | Create new vehicle |
| `/{vehicleId}` | PUT | 👑 Admin | Update vehicle by ID |
| `/{vehicleId}` | DELETE | 👑 Admin | Delete vehicle by ID |
| `/{vehicleId}/images` | POST | 👑 Admin | Add images to vehicle |

---

## AccessoryController (`/api/v1/accessories`)

| Endpoint | Method | Access | Description |
|----------|--------|---------|-------------|
| `/all` | GET | 🌐 Public | Get all accessories |
| `/{id}` | GET | 🌐 Public | Get accessory by ID |
| `/` | POST | 👑 Admin | Create new accessory |
| `/{id}` | PUT | 👑 Admin | Update accessory by ID |
| `/{id}` | DELETE | 👑 Admin | Delete accessory by ID |
| `/{id}/images` | POST | 👑 Admin | Add images to accessory |

---

## ReviewController (`/api/v1/reviews`)

| Endpoint | Method | Access | Description |
|----------|--------|---------|-------------|
| `/` | GET | 🌐 Public | Get all reviews |
| `/user/{userId}` | GET | 🌐 Public | Get reviews by user |
| `/make/{make}/model/{model}` | GET | 🌐 Public | Get reviews by make/model |
| `/make/{make}/model/{model}/summary` | GET | 🌐 Public | Get review summary |
| `/` | POST | 🔒 Auth | Create review (any authenticated user) |
| `/{reviewId}` | DELETE | 🔐 User | Delete review (owner or admin) |

---

## CartController (`/api/v1/carts`)

| Endpoint | Method | Access | Description |
|----------|--------|---------|-------------|
| `/{userId}` | GET | 🔐 User | Get user's cart (owner or admin) |
| `/{userId}/items` | POST | 🔐 User | Add item to cart (owner or admin) |
| `/{userId}/items/{itemId}` | DELETE | 🔐 User | Remove item from cart (owner or admin) |
| `/{userId}` | DELETE | 🔐 User | Clear cart (owner or admin) |

---

## OrderController (`/api/v1/orders`)

| Endpoint | Method | Access | Description |
|----------|--------|---------|-------------|
| `/{userId}` | POST | 🔐 User | Create order for user (owner or admin) |
| `/{orderId}` | GET | 🔐 User | Get order by ID (owner or admin) |
| `/user/{userId}` | GET | 🔐 User | Get orders for user (owner or admin) |
| `/from-cart/{userId}` | POST | 🔐 User | Create order from cart (owner or admin) |
| `/{orderId}/cancel` | POST | 🔐 User | Cancel order (owner or admin) |

---

## PaymentController (`/api/v1/payment`)

| Endpoint | Method | Access | Description |
|----------|--------|---------|-------------|
| `/session` | POST | 🔐 User | Create payment session (owner or admin) |
| `/process` | POST | 🔒 Auth | Process payment (any authenticated user) |
| `/{orderId}/status` | GET | 🔐 User | Get payment status (order owner or admin) |
| `/user/{userId}` | GET | 🔐 User | Get user payment history (owner or admin) |
| `/{orderId}/cancel` | POST | 🔐 User | Cancel/refund payment (order owner or admin) |

---

## VehicleHistoryController (`/api/v1/vehiclehistory`)

| Endpoint | Method | Access | Description |
|----------|--------|---------|-------------|
| `/{vehicleHistoryId}` | GET | 🌐 Public | Get vehicle history by ID |
| `/vehicle/{vehicleId}` | GET | 🌐 Public | Get vehicle history by vehicle ID |
| `/` | POST | 👑 Admin | Create vehicle history record |
| `/{vehicleHistoryId}` | PUT | 👑 Admin | Update vehicle history record |
| `/{vehicleHistoryId}` | DELETE | 👑 Admin | Delete vehicle history record |

---

## LoanCalculatorController (`/api/v1/loan-calculator`)

| Endpoint | Method | Access | Description |
|----------|--------|---------|-------------|
| `/calculate` | POST | 🌐 Public | Calculate loan payments |
