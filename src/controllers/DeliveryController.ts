import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import express, { Request, Response, NextFunction } from "express";
import {
  CartItem,
  CreateCustomerInput,
  CreateDeliveryUserInput,
  EditCustomerProfileInput,
  OrderInputs,
  UserLoginInput,
} from "../dto";
import { Customer, DeliveryUser, Food, Vendor } from "../models";
import { Offer } from "../models/Offer";
import { Order } from "../models/Order";
import { Transaction } from "../models/Transaction";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  onRequestOTP,
  onRequestOTPForEmail,
  ValidatePassword,
} from "../utility";

export const DeliverySignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUserInputs = plainToClass(CreateDeliveryUserInput, req.body);

  const validationError = await validate(deliveryUserInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { email, phone, password, address, firstName, lastName, pincode } =
    deliveryUserInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const existingDeliveryUser = await DeliveryUser.findOne({ email: email });

  if (existingDeliveryUser !== null) {
    return res
      .status(400)
      .json({ message: "A Delivery User exist with the provided email ID!" });
  }

  const result = await DeliveryUser.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    firstName: firstName,
    lastName: lastName,
    address: address,
    pincode: pincode,
    verified: false,
    lat: 0,
    lng: 0,
    isAvailable: false,
    vehicle: null,
  });

  if (result) {
    //Generate the Signature
    const signature = await GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });
    // Send the result
    return res
      .status(201)
      .json({ signature, verified: result.verified, email: result.email });
  }

  return res.status(400).json({ msg: "Error while creating Delivery user" });
};

export const DeliveryLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(UserLoginInput, req.body);

  const LoginErrors = await validate(loginInputs, {
    validationError: { target: true },
  });

  if (LoginErrors.length > 0) {
    return res.status(400).json(LoginErrors);
  }

  const { email, password } = loginInputs;

  const deliveryUser = await DeliveryUser.findOne({ email: email });
  if (deliveryUser) {
    const validation = await ValidatePassword(
      password,
      deliveryUser.password,
      deliveryUser.salt
    );

    if (validation) {
      const signature = await GenerateSignature({
        _id: deliveryUser._id,
        email: deliveryUser.email,
        verified: deliveryUser.verified,
      });

      return res.status(201).json({
        signature: signature,
        verified: deliveryUser.verified,
        email: deliveryUser.email,
      });
    }
  }

  return res.json({ msg: "Error Login" });
};

export const GetDeliveryProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;

  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id).populate('vehicle');

    if (profile) {
      return res.status(200).json(profile);
    }
  }
  return res.status(400).json({ msg: "Error while Fetching Profile" });
};

export const EditDeliveryProfile = async ( req: Request, res: Response, next: NextFunction ) => {
  const deliveryUser = req.user;

  const customerInputs = plainToClass(EditCustomerProfileInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { firstName, lastName, address } = customerInputs;

  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

    const files = req.files as [Express.Multer.File];
    const images = files.map((file: Express.Multer.File) => file.filename);

    if (profile && images.length > 0) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
      profile.profile_pic = images[0];
      const result = await profile.save();

      return res.status(200).json(result);
    }
    if(profile){
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
      const result = await profile.save();

      return res.status(200).json(result);
    }
  }
  return res.status(400).json({ msg: "Error with  Updating Profile" });
};

export const GetOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;

  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      const otp = GenerateOtp();

      const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + 5);

      profile.otp = otp.otp;
      profile.otp_expires = currentTime;

      const result = await profile.save();

      const message = `Your OTP is ${result.otp}`;

      await onRequestOTPForEmail(result.email, message)
        .then((response) => {
          return res.status(200).json({ msg: "OTP Sent" });
        })
        .catch((err) => {
          return res.status(400).json({ msg: "Error with  Requesting OTP" });
        });
    }
  }
};

export const VerifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  const deliveryUser = req.user;

  if(deliveryUser) {
    const {otp} = req.body;

    const profile = await DeliveryUser.findById(deliveryUser._id);

    if(profile) {
      if(profile.otp === otp && profile.otp_expires > new Date()) {
        profile.email_verified = true;
        const result = await profile.save();
        return res.status(200).json(result);
      }

      return res.status(400).json({msg: "OTP is not valid"});

    }

    return res.status(400).json({msg: "Error with Verifying OTP"});


  }
}

export const UpdateDeliveryUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;

  if (deliveryUser) {
    const { lat, lng } = req.body;

    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      if (lat && lng) {
        profile.lat = lat;
        profile.lng = lng;
      }

      // profile.isAvailable = !profile.isAvailable;
      profile.isAvailable = true;
      profile.last_updated = new Date();

      const result = await profile.save();

      return res.status(200).json(result);
    }
  }
  return res.status(400).json({ msg: "Error with Update Status!" });
};

export const getAllDeliveryRequest = async (req: Request, res: Response, next: NextFunction) => {
  const deliveryUser = req.user;

  if(deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

    if(profile) {
      const order = await Order.find()
        .where('deliveryId').equals("")
        // .where('vendorId.pincode').equals(profile.pincode)
        .where('orderStatus').ne("cancel")
        .sort('-createdAt')
        .populate('vendorId')
        .exec();
      
        const filtered_data = order.filter((item) => {
          if(item.vendorId.pincode === profile.pincode){
            return item
          }
        })
        
      return res.status(200).json(filtered_data);

    }
  }

  return res.status(400).json({msg: "Error with Fetching Delivery Request"});
}

export const cancelDeliveryRequest = async (req: Request, res: Response, next: NextFunction) => {
  const deliveryUser = req.user;

  if(deliveryUser) {

    const {orderId} = req.body;
    

    if(!orderId) return res.status(400).json({msg: "Error with Cancel Delivery Request", reason: "Request all required fields"});


    const order = await Order.findById(orderId);


    if(!order) return res.status(400).json({msg: "Error with Cancel Delivery Request", reason: "Order not found"});


    const deliveryId = order.deliveryId;


    if(!deliveryId) return res.status(400).json({msg: "Error with Cancel Delivery Request", reason: "Delivery person not allocated"});


    if(deliveryId != deliveryUser._id) return res.status(400).json({msg: "Error with Cancel Delivery Request", reason: "delivery person not matched"});


    order.rejectedDeliveryIds.push({id: deliveryId, cancelTime: String(new Date())});
    order.deliveryId = "";
    order.deliveryStatus = "";


    const response = await order.save();


    
    res.status(200).json(response);

  }
}

export const acceptationOfDeliveryRequest = async (req: Request, res: Response, next: NextFunction) => {
  const deliveryUser = req.user;

  const user = await DeliveryUser.findById(deliveryUser._id);

  if(deliveryUser){
    const {orderId, acceptationState} = req.body;

    if(typeof(orderId) === 'undefined' || ( typeof(acceptationState) === 'undefined' || typeof(acceptationState) !== 'boolean' ) ){
      return res.status(400).json({msg: "Error with Acceptation of Delivery Request"});
    }

    const order = await Order.findById(orderId).populate('vendorId');

    if(!order) return res.status(400).json({msg: "Error with Acceptation of Delivery Request" , reason: "Order not found"});

    if(order.vendorId.pincode != user.pincode) return res.status(400).json({msg: "Error with Acceptation of Delivery Request", reason: "This request is not from your area"});

    if(order.deliveryId != "" && order.deliveryStatus == "accepted") return res.status(400).json({msg: "Error with Acceptation of Delivery Request", reason: "This request is already accepted by another delivery person"});

    if (acceptationState === true) {

      order.deliveryStatus = 'accepted';
      order.deliveryId = deliveryUser._id;

      const result = await order.save();

      return res.status(200).json(result);


    }

    if (acceptationState === false) {
      const order = await Order.findById(orderId);
      order.deliveryStatus = '';
      order.deliveryId = '';

      // get all delivery user except order rejected delivery user
      // const deliveryPerson = await DeliveryUser.find({ pincode: areaCode, verified: true, isAvailable: true});
      const deliveryPerson = await DeliveryUser.findById(deliveryUser._id);

      const areaCode = deliveryPerson.pincode;

      const exceptUser = Array();

      exceptUser.push(order.rejectedDeliveryIds);
      exceptUser.push(deliveryUser._id);

      const deliveryPersonList = await DeliveryUser.find({ pincode: areaCode, verified: true, isAvailable: true, _id: { $ne: exceptUser } });

      // assign new delivery person
      if (deliveryPersonList.length > 0) {
        const newDeliveryPerson = deliveryPersonList[0];

        order.deliveryId = newDeliveryPerson._id;
        order.deliveryStatus = '';

        const result = await order.save();

        return res.status(200).json(result);
      }

      const result = await order.save();
      // notify to vendor there are no delivery person available
      console.log('notify to vendor there are no delivery person available');

      return res.status(200).json(result);
      
    }

  }
}