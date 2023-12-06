# MYFOOD.lk

## Customer APIs

### 1. Sign Up
```
POST /customer/signup
```
```
Body:
    {
        "email": "akila@gmail.com",
        "password": "123456",
        "phone": "0716654153"
    }

RESPONSE:
    {
        "signature": "eyJhbGciOiJIUzI ...",
        "verified": false,
        "email": "akila@gmail.com"
    }
```

### 2. Login
```
POST /customer/login
```
```

Body:
    {
        "email": "akila@gmail.com",
        "password": "123456"
    }

RESPONSE:
    {
        "signature": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ....",
        "email": "akila@gmail.com",
        "verified": true OR false
    }
```

### 3. Request OTP
```
GET /customer/otp
```
```

HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

RESPONSE:
    {
        "message": "OTP sent to your registered Mobile Number!"
    }
```

### 4. Verify OTP (Customer Validation)
```
PATCH /customer/verify
```
```

HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

BODY:
    {
        "otp": "123456"
    }

RESPONSE:
    {
        "signature": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ....",
        "email": "akila@gmail.com",
        "verified": true
    }
    
```

### 5. Get Customer profile
```
GET /customer/profile
```
```

HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

RESPONSE:
   {
        "orders": [],
        "_id": "649e91daf73a1a1254cdaf97",
        "email": "akila@gmail.com",
        "phone": "0716654153",
        "otp": 526765,
        "otp_expiry": "2023-07-04T07:01:37.352Z",
        "firstName": "Ushan",
        "lastName": "Chamod",
        "address": "Bandara",
        "verified": true,
        "lat": 0,
        "lng": 0,
        "cart": []
    }
```

### 6. Update Customer profile
```
PATCH /customer/profile
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

BODY:
    {
        "firstName": "Ushan",
        "lastName": "Chamod",
        "address": "Bandara"
    }

RESPONSE:
    {
        "orders": [],
        "_id": "649e91daf73a1a1254cdaf97",
        "email": "akila@gmail.com",
        "phone": "0716654153",
        "otp": 526765,
        "otp_expiry": "2023-07-04T07:01:37.352Z",
        "firstName": "Ushan",
        "lastName": "Chamod",
        "address": "Bandara",
        "verified": true,
        "lat": 0,
        "lng": 0,
        "cart": []
    }  
```

### 7. Add to cart
```
POST /customer/cart
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

BODY:
    {
    "_id": "64acf3458b7f9a1e40f6e57a", 
        "unit": 15
    }

RESPONSE:
    [
        {
            "_id": "64ad3d252a8cba0580d8e9d4",
            "food": {
                "images": [
                    "2023-07-11T06-14-28.941Z_Sample Image.jpg"
                ],
                "_id": "64acf3458b7f9a1e40f6e57a",
                "vendorId": "64acf2de8b7f9a1e40f6e579",
                "name": " Delicious Pizza",
                "description": " A mouth-watering pizza topped with cheese, tomatoes, and pepperoni.",
                "category": " Italian",
                "price": 1200,
                "rating": 0,
                "readyTime": 30,
                "foodType": " Pizza"
            },
            "unit": 15
        }
    ]
```

### 8. Get cart
```
GET /customer/cart
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

RESPONSE:
    [
        {
            "_id": "64ad3d252a8cba0580d8e9d4",
            "food": "64acf3458b7f9a1e40f6e57a",
            "unit": 15
        },
        {
            "_id": "64ad3e7f2a8cba0580d8e9d6",
            "food": "64ad3d9b2a8cba0580d8e9d5",
            "unit": 20
        }
    ]
```

### 9. Remove all from cart (Clear cart)
```
DELETE /customer/cart
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

RESPONSE:
    {
        "orders": [],
        "_id": "649e91daf73a1a1254cdaf97",
        "email": "akila@gmail.com",
        "phone": "0716654153",
        "otp": 526765,
        "otp_expiry": "2023-07-04T07:01:37.352Z",
        "firstName": "Ushan",
        "lastName": "Chamod",
        "address": "Bandara",
        "verified": true,
        "lat": 0,
        "lng": 0,
        "cart": []
    }
```

### 10. Verify offer ***(NOT FINISHED)***
```
GET /customer/offer/verify/:id
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

RESPONSE:
{
    "msg": "Offer is Not Valid"
}

(Positive response is pending)
```

### 11. Create Payment
```
POST /customer/create-payment
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

BODY:
    {
        "amount": 1500,
        "paymentMode": "",
        "offerId": "649e91acf73a1a1254cdaf96" (If has offer)
    }

RESPONSE:
    {
        "_id": "64a3f13a5b164c2f4c80d64f",
        "customer": "649e91daf73a1a1254cdaf97",
        "vendorId": "",
        "orderId": "",
        "orderValue": 1500,
        "offerUsed": "NA",
        "status": "OPEN",
        "paymentMode": "",
        "paymentResponse": "Payment is cash on Delivery",
        "createdAt": "2023-07-04T10:15:22.585Z",
        "updatedAt": "2023-07-04T10:15:22.585Z"
    }
```

### 12. Create Order ***(NOT FINISHED)***
```
POST /customer/create-order
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

BODY:
    {
        "txnId":"64a68b9b53b3aa182410cd87",
        "amount": 1500,
        "cart": [
            {
                "_id": "food id",
                "unit": 10
            }
        ]
    }

RESPONSE:
    p e n d i n g . . .
```

### 13. Get All Orders
```
GET /customer/orders
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

RESPONSE:
    [
        {
            "_id": "64ad1a328dfe991d4caec1a1",
            "orderId": "66001",
            "vendorId": "64acf2de8b7f9a1e40f6e579",
            "items": [
                {
                    "_id": "64ad1a328dfe991d4caec1a2",
                    "food": "64acf3458b7f9a1e40f6e57a",
                    "unit": 15
                }
            ],
            "totalAmount": 18000,
            "paidAmount": 10000,
            "orderDate": "2023-07-11T09:00:34.776Z",
            "orderStatus": "Waiting",
            "remarks": "",
            "deliveryId": "64ad196a7b030633ec9c0f90",
            "readyTime": 45
        },
        {
            "_id": "64ad1d7b08eee42db0ee4dd4",
            "orderId": "34969",
            "vendorId": "64acf2de8b7f9a1e40f6e579",
            "items": [
                {
                    "_id": "64ad1d7b08eee42db0ee4dd5",
                    "food": "64acf3458b7f9a1e40f6e57a",
                    "unit": 15
                }
            ],
            "totalAmount": 18000,
            "paidAmount": 10000,
            "orderDate": "2023-07-11T09:14:35.516Z",
            "orderStatus": "Waiting",
            "remarks": "",
            "deliveryId": "64ad196a7b030633ec9c0f90",
            "readyTime": 45
        }
    ]
```

### 14. Get Order By ID
```
GET /customer/order/:id
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

RESPONSE:
    {
        "orders": [],
        "_id": "64a680bc16045f0c80d18c70",
        "email": "akila@gmail.com",
        "phone": "0716654153",
        "otp": 616290,
        "otp_expiry": "2023-07-06T09:22:12.247Z",
        "firstName": "",
        "lastName": "",
        "address": "",
        "verified": true,
        "lat": 0,
        "lng": 0,
        "cart": []
    }
```


## Admin APIs

### 1. Create Admin
```
POST /admin/signup
```
```
BODY:
    {
        "email": "",
        "password": "",
        "firstName": ""
    }

RESPONSE:
    {
        "message": "Admin Created Successfully",
        "admin": {
            "email": "MAHA@gmail.com",
            "firstName": "Ushan"
        }
    }
```

### 2. Login Admin
```
POST /admin/login
```
```
BODY:
    {
        "email": "",
        "password": ""
    }

RESPONSE:
    {
        "cookie": {
            "originalMaxAge": false,
            "expires": false,
            "httpOnly": true,
            "path": "/"
        },
        "admin": {
            "_id": "64a5205091c4f529701eb7f2",
            "email": "ushan@gmail.com",
            "firstName": "Ushan"
        }
    }
```

### 3. Create Vendor
```
POST /admin/vendor
```
```
BODY:
    {
    "name": "John's Restaurant",
    "address": "123 Main Street",
    "pincode": "12345",
    "foodType": ["Italian", "Chiness"],
    "email": "Akila@example.com",
    "password": "********",
    "ownerName": "John Doe",
    "phone": "123-456-7890"
    }

RESPONSE:
    {
        "foodType": [
            "Italian",
            "Chiness"
        ],
        "coverImages": [],
        "foods": [],
        "_id": "64a53bccf360231dd8a8fd70",
        "name": "John's Restaurant",
        "address": "123 Main Street",
        "pincode": "12345",
        "email": "SS@example.com",
        "ownerName": "John Doe",
        "phone": "123-456-7890",
        "rating": 0,
        "serviceAvailable": false,
        "lat": 0,
        "lng": 0
    }
```

### 4. Get All Vendors
```
GET /admin/vendors
```
```
RESPONSE:
    [
        {
            "foodType": [
                "Italian"
            ],
            "coverImages": [],
            "foods": [],
            "_id": "64a5001a4b0c1d253c70629b",
            "name": "John's Restaurant",
            "address": "123 Main Street",
            "pincode": "12345",
            "email": "johnsrestaurant@example.com",
            "ownerName": "John Doe",
            "phone": "123-456-7890",
            "rating": 0,
            "serviceAvailable": false,
            "lat": 0,
            "lng": 0
        },
        {
            "foodType": [
                "Italian"
            ],
            "coverImages": [],
            "foods": [],
            "_id": "64a52f6027c9dd2bf8593bfb",
            "name": "John's Restaurant",
            "address": "123 Main Street",
            "pincode": "12345",
            "email": "hello@example.com",
            "ownerName": "John Doe",
            "phone": "123-456-7890",
            "rating": 0,
            "serviceAvailable": false,
            "lat": 0,
            "lng": 0
        }
    ]
```

### 5. Get Vendor By ID
```
GET /admin/vendor/:id
```
```
RESPONSE:
    {
        "foodType": [
            "Italian"
        ],
        "coverImages": [],
        "foods": [],
        "_id": "64a5001a4b0c1d253c70629b",
        "name": "John's Restaurant",
        "address": "123 Main Street",
        "pincode": "12345",
        "email": "johnsrestaurant@example.com",
        "ownerName": "John Doe",
        "phone": "123-456-7890",
        "rating": 0,
        "serviceAvailable": false,
        "lat": 0,
        "lng": 0
    }
```

### 6. Get All Transactions
```
GET /admin/transactions
```
```
RESPONSE:
    [
        {
            "_id": "64a41875f0cabe1a68400fac",
            "customer": "64a41804f0cabe1a68400fab",
            "vendorId": "",
            "orderId": "",
            "orderValue": 1500,
            "offerUsed": "NA",
            "status": "OPEN",
            "paymentMode": "",
            "paymentResponse": "Payment is cash on Delivery",
            "createdAt": "2023-07-04T13:02:45.040Z",
            "updatedAt": "2023-07-04T13:02:45.040Z"
        },
        {
            "_id": "64a41aca84e11917a0e0d5c4",
            "customer": "64a41804f0cabe1a68400fab",
            "vendorId": "",
            "orderId": "",
            "orderValue": 1500,
            "offerUsed": "NA",
            "status": "OPEN",
            "paymentMode": "",
            "paymentResponse": "Payment is cash on Delivery",
            "createdAt": "2023-07-04T13:12:42.048Z",
            "updatedAt": "2023-07-04T13:12:42.048Z"
        }
    ]
```

### 7. Get Transaction By ID
```
GET /admin/transaction/:id
```
```
RESPONSE:
    {
        "_id": "64a41875f0cabe1a68400fac",
        "customer": "64a41804f0cabe1a68400fab",
        "vendorId": "",
        "orderId": "",
        "orderValue": 1500,
        "offerUsed": "NA",
        "status": "OPEN",
        "paymentMode": "",
        "paymentResponse": "Payment is cash on Delivery",
        "createdAt": "2023-07-04T13:02:45.040Z",
        "updatedAt": "2023-07-04T13:02:45.040Z"
    }
```

### 8. Verify delivery User
```
PUT /admin/delivery/verify
```
```
BODY:
    {
    " _id": "64a41875f0cabe1a68400fac",
    "status": true
    }

RESPONSE:
    {
        "isAvailable": true,
        "_id": "64ad196a7b030633ec9c0f90",
        "email": "ushan@gmail.com",
        "phone": "07166541533",
        "firstName": "Ushan",
        "lastName": "Chamod",
        "address": "lisdufhadhsicjdov",
        "pincode": "12345",
        "verified": true,
        "lat": 0,
        "lng": 0
    }
```

### 9. Get All Delivery Users
```
GET /admin/delivery/users
```
```
RESPONSE:
    [
        {
            "isAvailable": true,
            "_id": "64ad196a7b030633ec9c0f90",
            "email": "ushan@gmail.com",
            "phone": "07166541533",
            "firstName": "Ushan",
            "lastName": "Chamod",
            "address": "lisdufhadhsicjdov",
            "pincode": "12345",
            "verified": true,
            "lat": 0,
            "lng": 0
        },
        {
            "isAvailable": true,
            "_id": "64ad196a7b030633edfgtrfg",
            "email": "ushan@gmail.com",
            "phone": "07166557486",
            "firstName": "Ushan",
            "lastName": "Chamod",
            "address": "lisdufhadhsicjdov",
            "pincode": "12345",
            "verified": true,
            "lat": 0,
            "lng": 0
        }
    ]
```

## Vendor APIs


### 1. Vendor Login
```
GET /vendor/login
```
```
BODY:
    {
        "email": "Akila@example.com",
        "password": "********"
    }

RESPONSE:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGE1MmZmZTI3YzlkZDJiZjg1OTNiZmMiLCJl..."
```

### 2. Get Vendor Profile
```
GET /vendor/profile
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

RESPONSE:
    {
        "foodType": [
            "Pizza",
            "Burger",
            "Sushi"
        ],
        "coverImages": [],
        "foods": [],
        "_id": "64a52ffe27c9dd2bf8593bfc",
        "name": "Example Restaurant",
        "address": "123 Main Street",
        "pincode": "12345",
        "email": "Akila@example.com",
        "ownerName": "John Doe",
        "phone": "555-1234",
        "rating": 0,
        "serviceAvailable": true,
        "lat": 10,
        "lng": 50
    }
```

### 3. Update Vendor Profile
```
PATCH /vendor/profile
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

BODY:
    {
        "foodType": ["Pizza", "Burger", "Sushi"],
        "name": "Example Restaurant",
        "address": "123 Main Street",
        "phone": "555-1234"
    }

RESPONSE:
    {
        "foodType": [
            "Pizza",
            "Burger",
            "Sushi"
        ],
        "coverImages": [],
        "foods": [],
        "_id": "64a52ffe27c9dd2bf8593bfc",
        "name": "Example Restaurant",
        "address": "123 Main Street",
        "pincode": "12345",
        "email": "Akila@example.com",
        "ownerName": "John Doe",
        "phone": "555-1234",
        "rating": 0,
        "serviceAvailable": true,
        "lat": 10,
        "lng": 50
    }
```

### 4. Update Cover Image 
```
PATCH /vendor/coverimage
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ....",
        "Content-Type": "multipart/form-data"
    }

BODY:
    images: [file1, file2, file3]

RESPONSE:
    {
        "foodType": [
            "Pizza",
            "Burger",
            "Sushi"
        ],
        "coverImages": [
            "2023-07-06T08-16-14.956Z_Sample Image.jpg",
            "2023-07-06T08-17-35.993Z_Sample Image - Copy (2).jpg",
            "2023-07-06T08-17-36.044Z_Sample Image - Copy.jpg",
            "2023-07-06T08-17-36.069Z_Sample Image.jpg"
        ],
        "foods": [
            "64a67711fc8d3e282c536f07"
        ],
        "_id": "64a52ffe27c9dd2bf8593bfc",
        "name": "Example Restaurant",
        "address": "123 Main Street",
        "pincode": "12345",
        "email": "Akila@example.com",
        "ownerName": "John Doe",
        "phone": "555-1234",
        "rating": 0,
        "serviceAvailable": false,
        "lat": 10,
        "lng": 50
    }
```

### 5. Update Vendor Service Status
```
PATCH /vendor/service
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

BODY:
    {
        "lat": 10,
        "lng": 50
    }

RESPONSE:
    {
        "foodType": [
            "Pizza",
            "Burger",
            "Sushi"
        ],
        "coverImages": [],
        "foods": [],
        "_id": "64a52ffe27c9dd2bf8593bfc",
        "name": "Example Restaurant",
        "address": "123 Main Street",
        "pincode": "12345",
        "email": "Akila@example.com",
        "ownerName": "John Doe",
        "phone": "555-1234",
        "rating": 0,
        "serviceAvailable": false,
        "lat": 10,
        "lng": 50
    }
```

### 6. Add Food
```
POST /vendor/food
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
        "Content-Type": "multipart/form-data"
    }

BODY:
    name: Delicious Pizza
    description: A mouth-watering pizza topped with cheese, tomatoes, and pepperoni.
    category: Italian
    foodType: Pizza
    readyTime: 30
    price: 1200

RESPONSE:

    {
        "foodType": [
            "Pizza",
            "Burger",
            "Sushi"
        ],

        "coverImages": [],
        
        "foods": [
            {
                "images": [
                    "2023-07-06T08-10-57.317Z_Sample Image.jpg"
                ],
                "_id": "64a67711fc8d3e282c536f07",
                "vendorId": "64a52ffe27c9dd2bf8593bfc",
                "name": " Delicious Pizza",
                "description": " A mouth-watering pizza topped with cheese, tomatoes, and pepperoni.",
                "category": " Italian",
                "price": 1200,
                "rating": 0,
                "readyTime": 30,
                "foodType": " Pizza"
            }
        ],

        "_id": "64a52ffe27c9dd2bf8593bfc",
        "name": "Example Restaurant",
        "address": "123 Main Street",
        "pincode": "12345",
        "email": "Akila@example.com",
        "ownerName": "John Doe",
        "phone": "555-1234",
        "rating": 0,
        "serviceAvailable": false,
        "lat": 10,
        "lng": 50
    }
```

### 7. Get All Food From Vendor
```
GET /vendor/food
```

```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

RESPONSE:
    [
        {
            "images": [
                "2023-07-06T08-20-52.331Z_Sample Image.jpg"
            ],
            "_id": "64a67964fc8d3e282c536f09",
            "vendorId": "64a52ffe27c9dd2bf8593bfc",
            "name": " Delicious Pizza",
            "description": " A mouth-watering pizza topped with cheese, tomatoes, and pepperoni.",
            "category": " Italian",
            "price": 1200,
            "rating": 0,
            "readyTime": 30,
            "foodType": " Pizza"
        },
        {
            "images": [
                "2023-07-06T08-21-49.355Z_Sample Image.jpg"
            ],
            "_id": "64a6799dfc8d3e282c536f0a",
            "vendorId": "64a52ffe27c9dd2bf8593bfc",
            "name": " Sri Lankan Pizza",
            "description": " A mouth-watering pizza topped with cheese, tomatoes, and pepperoni.",
            "category": " Italian",
            "price": 1200,
            "rating": 0,
            "readyTime": 30,
            "foodType": " Burger"
        }
    ]
```

### 8. Get All Order of Vendor
```
GET /vendor/orders
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

RESPONSE:
    [
        {
            "_id": "64a68e84ba127918285867a7",
            "orderId": "71484",
            "vendorId": "64a67fda16045f0c80d18c6d",
            "items": [
                {
                    "_id": "64a68e84ba127918285867a8",
                    "food": {
                        "images": [
                            "2023-07-06T08-51-28.653Z_Sample Image.jpg"
                        ],
                        "_id": "64a6809116045f0c80d18c6e",
                        "vendorId": "64a67fda16045f0c80d18c6d",
                        "name": " Delicious Pizza",
                        "description": " A mouth-watering pizza topped with cheese, tomatoes, and pepperoni.",
                        "category": " Italian",
                        "price": 1200,
                        "rating": 0,
                        "readyTime": 30,
                        "foodType": " Pizza"
                    },
                    "unit": 10
                }
            ],
            "totalAmount": 12000,
            "paidAmount": 1500,
            "orderDate": "2023-07-06T09:51:00.521Z",
            "orderStatus": "Waiting",
            "remarks": "",
            "deliveryId": "",
            "readyTime": 45
        }
    ]
```

### 9. Get Current Orders Copy
```
PUT /vendor/order/:id/process
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

BODY:
    {
        "status": "Pending",
        "remarks": "Waiting for payment",
        "time": 2000
    }

RESPONSE:
    {
        "_id": "64a68e84ba127918285867a7",
        "orderId": "71484",
        "vendorId": "64a67fda16045f0c80d18c6d",
        "items": [
            {
                "_id": "64a68e84ba127918285867a8",
                "food": "64a6809116045f0c80d18c6e",
                "unit": 10
            }
        ],
        "totalAmount": 12000,
        "paidAmount": 1500,
        "orderDate": "2023-07-06T09:51:00.521Z",
        "orderStatus": "Pending",
        "remarks": "Waiting for payment",
        "deliveryId": "",
        "readyTime": 2000
    }
```

### 10. Get Order Details By ID
```
GET /vendor/order/:id
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

RESPONSE:
    {
        "_id": "64a68e84ba127918285867a7",
        "orderId": "71484",
        "vendorId": "64a67fda16045f0c80d18c6d",
        "items": [
            {
                "_id": "64a68e84ba127918285867a8",
                "food": {
                    "images": [
                        "2023-07-06T08-51-28.653Z_Sample Image.jpg"
                    ],
                    "_id": "64a6809116045f0c80d18c6e",
                    "vendorId": "64a67fda16045f0c80d18c6d",
                    "name": " Delicious Pizza",
                    "description": " A mouth-watering pizza topped with cheese, tomatoes, and pepperoni.",
                    "category": " Italian",
                    "price": 1200,
                    "rating": 0,
                    "readyTime": 30,
                    "foodType": " Pizza"
                },
                "unit": 10
            }
        ],
        "totalAmount": 12000,
        "paidAmount": 1500,
        "orderDate": "2023-07-06T09:51:00.521Z",
        "orderStatus": "Pending",
        "remarks": "Waiting for payment",
        "deliveryId": "",
        "readyTime": 2000
    }
```

### 11. Add Offer for Vendor
```
POST /vendor/offer
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

BODY:
    {
        "title": "Summer Sale 2",
        "description": "Get 20% off on all summer items",
        "offerType": "Percentage",
        "offerAmount": 20,
        "pincode": "12345",
        "promocode": "SUMMER20",
        "promoType": "Public",
        "startValidity": "2023-07-01",
        "endValidity": "2023-07-31",
        "bank": "ABC Bank",
        "bins": ["123456", "234567", "345678"],
        "minValue": 1000,
        "isActive": true
    }


RESPONSE:
    {
        "vendors": [
            {
                "foodType": [
                    "Italian",
                    "Chiness"
                ],
                "coverImages": [
                    "2023-07-06T08-51-10.436Z_Sample Image - Copy (2).jpg",
                    "2023-07-06T08-51-10.498Z_Sample Image - Copy.jpg",
                    "2023-07-06T08-51-10.547Z_Sample Image.jpg"
                ],
                "foods": [
                    "64a6809116045f0c80d18c6e"
                ],
                "_id": "64a67fda16045f0c80d18c6d",
                "name": "John's Restaurant",
                "address": "123 Main Street",
                "pincode": "12345",
                "email": "vendor@vendor.com",
                "ownerName": "John Doe",
                "phone": "123-456-7890",
                "rating": 0,
                "serviceAvailable": true,
                "lat": 10,
                "lng": 50
            }
        ],
        "bank": [
            "ABC Bank"
        ],
        "bins": [],
        "_id": "64a7df6f86852715c48a5139",
        "title": "Summer Sale 2",
        "description": "Get 20% off on all summer items",
        "offerType": "Percentage",
        "offerAmount": 20,
        "pincode": "12345",
        "promoType": "Public",
        "startValidity": "2023-07-01T00:00:00.000Z",
        "endValidity": "2023-07-31T00:00:00.000Z",
        "isActive": true,
        "minValue": 1000
    }
```

### 12. Get all Offer from Vendor
```
GET /vendor/offer
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

RESPONSE:
    [
        {
            "vendors": [
                {
                    "foodType": [
                        "Italian",
                        "Chiness"
                    ],
                    "coverImages": [
                        "2023-07-06T08-51-10.436Z_Sample Image - Copy (2).jpg",
                        "2023-07-06T08-51-10.498Z_Sample Image - Copy.jpg",
                        "2023-07-06T08-51-10.547Z_Sample Image.jpg"
                    ],
                    "foods": [
                        "64a6809116045f0c80d18c6e"
                    ],
                    "_id": "64a67fda16045f0c80d18c6d",
                    "name": "John's Restaurant",
                    "address": "123 Main Street",
                    "pincode": "12345",
                    "email": "vendor@vendor.com",
                    "ownerName": "John Doe",
                    "phone": "123-456-7890",
                    "rating": 0,
                    "serviceAvailable": true,
                    "lat": 10,
                    "lng": 50
                }
            ],
            "bank": [
                "ABC Bank"
            ],
            "bins": [],
            "_id": "64a7df5c86852715c48a5138",
            "title": "Summer Sale 1",
            "description": "Get 20% off on all summer items",
            "offerType": "Percentage",
            "offerAmount": 20,
            "pincode": "12345",
            "promoType": "Public",
            "startValidity": "2023-07-01T00:00:00.000Z",
            "endValidity": "2023-07-31T00:00:00.000Z",
            "isActive": true,
            "minValue": 1000
        },
        {
            "vendors": [
                {
                    "foodType": [
                        "Italian",
                        "Chiness"
                    ],
                    "coverImages": [
                        "2023-07-06T08-51-10.436Z_Sample Image - Copy (2).jpg",
                        "2023-07-06T08-51-10.498Z_Sample Image - Copy.jpg",
                        "2023-07-06T08-51-10.547Z_Sample Image.jpg"
                    ],
                    "foods": [
                        "64a6809116045f0c80d18c6e"
                    ],
                    "_id": "64a67fda16045f0c80d18c6d",
                    "name": "John's Restaurant",
                    "address": "123 Main Street",
                    "pincode": "12345",
                    "email": "vendor@vendor.com",
                    "ownerName": "John Doe",
                    "phone": "123-456-7890",
                    "rating": 0,
                    "serviceAvailable": true,
                    "lat": 10,
                    "lng": 50
                }
            ],
            "bank": [
                "ABC Bank"
            ],
            "bins": [],
            "_id": "64a7df6f86852715c48a5139",
            "title": "Summer Sale 2",
            "description": "Get 20% off on all summer items",
            "offerType": "Percentage",
            "offerAmount": 20,
            "pincode": "12345",
            "promoType": "Public",
            "startValidity": "2023-07-01T00:00:00.000Z",
            "endValidity": "2023-07-31T00:00:00.000Z",
            "isActive": true,
            "minValue": 1000
        }
    ]
```

### 13. Edit Offer by ID
```
PUT /vendor/offer/:id
```
```
HEADER:
    {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik ...."
    }

RESPONSE
   {
        "vendors": [
            "64a67fda16045f0c80d18c6d"
        ],
        "bank": [
            "ABC Bank"
        ],
        "bins": [],
        "_id": "64a7df5c86852715c48a5138",
        "title": "Chenge Title",
        "description": "Get 20% off on all summer items",
        "offerType": "Percentage",
        "offerAmount": 20,
        "pincode": "12345",
        "promoType": "Public",
        "startValidity": "2023-07-01T00:00:00.000Z",
        "endValidity": "2023-07-31T00:00:00.000Z",
        "isActive": true,
        "minValue": 1000
    } 
```

## Shopping Routes

### 1. Get Food Availability of Vendor
```
GET /:pincode
```
```
RESPONSE:
    [
        {
            "foodType": [
                "Italian",
                "Chiness"
            ],
            "coverImages": [
                "2023-07-06T08-51-10.436Z_Sample Image - Copy (2).jpg",
                "2023-07-06T08-51-10.498Z_Sample Image - Copy.jpg",
                "2023-07-06T08-51-10.547Z_Sample Image.jpg"
            ],
            "foods": [
                {
                    "images": [
                        "2023-07-06T08-51-28.653Z_Sample Image.jpg"
                    ],
                    "_id": "64a6809116045f0c80d18c6e",
                    "vendorId": "64a67fda16045f0c80d18c6d",
                    "name": " Delicious Pizza",
                    "description": " A mouth-watering pizza topped with cheese, tomatoes, and pepperoni.",
                    "category": " Italian",
                    "price": 1200,
                    "rating": 0,
                    "readyTime": 30,
                    "foodType": " Pizza"
                }
            ],
            "_id": "64a67fda16045f0c80d18c6d",
            "name": "John's Restaurant",
            "address": "123 Main Street",
            "pincode": "12345",
            "email": "vendor@vendor.com",
            "ownerName": "John Doe",
            "phone": "123-456-7890",
            "rating": 0,
            "serviceAvailable": true,
            "lat": 10,
            "lng": 50
        }
    ]
```

### 2. Get Top Restaurants
```
GET top-restaurant/:pincode
```
```
RETURN:
    [
        {
            "foodType": [
                "Italian",
                "Chiness"
            ],
            "coverImages": [
                "2023-07-06T08-51-10.436Z_Sample Image - Copy (2).jpg",
                "2023-07-06T08-51-10.498Z_Sample Image - Copy.jpg",
                "2023-07-06T08-51-10.547Z_Sample Image.jpg"
            ],
            "foods": [
                "64a6809116045f0c80d18c6e"
            ],
            "_id": "64a67fda16045f0c80d18c6d",
            "name": "John's Restaurant",
            "address": "123 Main Street",
            "pincode": "12345",
            "email": "vendor@vendor.com",
            "ownerName": "John Doe",
            "phone": "123-456-7890",
            "rating": 0,
            "serviceAvailable": true,
            "lat": 10,
            "lng": 50
        }
    ]
```

### 3. Get Foods In 30 Min
```
GET /foods-in-30-min/:pincode
```
```
RESPONSE:
[
    {
        "images": [
            "2023-07-06T08-51-28.653Z_Sample Image.jpg"
        ],
        "_id": "64a6809116045f0c80d18c6e",
        "vendorId": "64a67fda16045f0c80d18c6d",
        "name": " Delicious Pizza",
        "description": " A mouth-watering pizza topped with cheese, tomatoes, and pepperoni.",
        "category": " Italian",
        "price": 1200,
        "rating": 0,
        "readyTime": 30,
        "foodType": " Pizza"
    }
]
```

### 4. Search Food
```
GET /search/:pincode
```
```
RESPONSE:
[
    {
        "images": [
            "2023-07-06T08-51-28.653Z_Sample Image.jpg"
        ],
        "_id": "64a6809116045f0c80d18c6e",
        "vendorId": "64a67fda16045f0c80d18c6d",
        "name": " Delicious Pizza",
        "description": " A mouth-watering pizza topped with cheese, tomatoes, and pepperoni.",
        "category": " Italian",
        "price": 1200,
        "rating": 0,
        "readyTime": 30,
        "foodType": " Pizza"
    }
]
```

### 5. Search Offer of vendor
```
GET /offers/:pincode
```
```
RESPONSE:
    [
        {
            "vendors": [
                "64a67fda16045f0c80d18c6d"
            ],
            "bank": [
                "ABC Bank"
            ],
            "bins": [],
            "_id": "64a7df5c86852715c48a5138",
            "title": "Chenge Title",
            "description": "Get 20% off on all summer items",
            "offerType": "Percentage",
            "offerAmount": 20,
            "pincode": "12345",
            "promoType": "Public",
            "startValidity": "2023-07-01T00:00:00.000Z",
            "endValidity": "2023-07-31T00:00:00.000Z",
            "isActive": true,
            "minValue": 1000
        },
        {
            "vendors": [
                "64a67fda16045f0c80d18c6d"
            ],
            "bank": [
                "ABC Bank"
            ],
            "bins": [],
            "_id": "64a7df6f86852715c48a5139",
            "title": "Summer Sale 2",
            "description": "Get 20% off on all summer items",
            "offerType": "Percentage",
            "offerAmount": 20,
            "pincode": "12345",
            "promoType": "Public",
            "startValidity": "2023-07-01T00:00:00.000Z",
            "endValidity": "2023-07-31T00:00:00.000Z",
            "isActive": true,
            "minValue": 1000
        }
    ]
```

### 6. Find restaurant by id
```
GET /restaurant/:id
```
```
RESPONSE:
    {
        "foodType": [
            "Italian",
            "Chiness"
        ],
        "coverImages": [
            "2023-07-06T08-51-10.436Z_Sample Image - Copy (2).jpg",
            "2023-07-06T08-51-10.498Z_Sample Image - Copy.jpg",
            "2023-07-06T08-51-10.547Z_Sample Image.jpg"
        ],
        "foods": [
            {
                "images": [
                    "2023-07-06T08-51-28.653Z_Sample Image.jpg"
                ],
                "_id": "64a6809116045f0c80d18c6e",
                "vendorId": "64a67fda16045f0c80d18c6d",
                "name": " Delicious Pizza",
                "description": " A mouth-watering pizza topped with cheese, tomatoes, and pepperoni.",
                "category": " Italian",
                "price": 1200,
                "rating": 0,
                "readyTime": 30,
                "foodType": " Pizza"
            }
        ],
        "_id": "64a67fda16045f0c80d18c6d",
        "name": "John's Restaurant",
        "address": "123 Main Street",
        "pincode": "12345",
        "email": "vendor@vendor.com",
        "ownerName": "John Doe",
        "phone": "123-456-7890",
        "rating": 0,
        "serviceAvailable": true,
        "lat": 10,
        "lng": 50
    }
```

## Delvery APIs

### 1. Signup / Create Delivery User
```
POST /delivery/signup
```
```
BODY
    {
        "email": "chamidilX@gamail.com",
        "password": "24802480",
        "phone": "077830317",
        "firstName":"dilX",
        "lastName":"wanigase",
        "address":"weligama",
        "pincode":"20005"
    }
RESPONSE:
    {
        "signature": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGFjZTJiM2E0OGRlOTdhYWMzOGU3ODUiLCJlbWFpbCI6ImNoYW1pZGlsWEBnYW1haWwuY29tIiwidmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE2ODkwNTE4MjgsImV4cCI6MTY5NjgyNzgyOH0.lFLSCwGVkFv3ys0LIuGEO4y0IP11GOPkrGZhyRWspBY",
        "verified": false,
        "email": "chamidilX@gamail.com"
    }
```
### 2. Login
```
POST /delivery/login
```
```
BODY:
    {
        "email": "chamidilX@gamail.com",
        "password": "24802480"
    }

RESPONSE:
    {
        "signature": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGFjZTJiM2E0OGRlOTdhYWMzOGU3ODUiLCJlbWFpbCI6ImNoYW1pZGlsWEBnYW1haWwuY29tIiwidmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE2ODkwNTIxMzAsImV4cCI6MTY5NjgyODEzMH0.SdtmCZKj9L7O6Z2ap8Pr4cfdjDuVUgwV5ZSxVyRjH0o",
        "verified": false,
        "email": "chamidilX@gamail.com"
    }
