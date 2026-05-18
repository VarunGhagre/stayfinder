# 🏡 StayFinder

StayFinder is a full-stack room booking platform inspired by Airbnb. Users can explore rooms, book stays, and owners can list their properties with images and details.

---

## 🚀 Feature

### 👤 User

* Register & Login (JWT Authentication)
* Browse available rooms
* Book rooms
* View booking history
* Receive notifications

### 🏠 Owner

* Add new rooms with images
* Manage room listings
* View bookings for their rooms
* Confirm bookings

### 🛡️ Admin

* Approve or reject room listings
* Manage platform data

---

## 💳 Booking & Payment Flow

* User books a room → Booking status = `pending`
* Owner confirms booking → Status = `confirmed`
* Payment integration (Razorpay – test mode)

---

## 🔔 Notification System

* Owner gets notified when a booking is made
* Users get updates on booking status

---

## 🖼️ Image Upload

* Cloudinary integration for room images

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Other Tools

* JWT Authentication
* Multer + Cloudinary
* Postman (API Testing)

---

## 📁 Project Structure

```
stayfinder/
├── stayfinder-frontend/
├── stayfinder-backend/
```

---

## ⚙️ Environment Variables

Create a `.env` file in backend:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret

CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

---

## ▶️ Run Locally

### 1️⃣ Clone repo

```
git clone https://github.com/your-username/stayfinder.git
cd stayfinder
```

### 2️⃣ Backend setup

```
cd stayfinder-backend
npm install
npm run dev
```

### 3️⃣ Frontend setup

```
cd stayfinder-frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints (Sample)

* `POST /api/users/register`
* `POST /api/users/login`
* `POST /api/rooms/add`
* `GET /api/rooms`
* `POST /api/bookings/:roomId`
* `GET /api/notifications`

---

## 🎯 Future Improvements

* Payment verification system
* Review & rating system
* Wishlist feature
* Advanced search & filters

---

## 📸 Screenshots

(Add your project screenshots)

---

## 🤝 Contributing

Feel free to fork and contribute to this project.

---

## ⭐ Support

If you like this project, please ⭐ the repository!

---

## 👨‍💻 Author

**Varun Ghagre**
