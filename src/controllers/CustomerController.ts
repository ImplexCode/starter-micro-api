import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import express, { Request, Response, NextFunction } from 'express';
import { CartItem, CreateCustomerInput, EditCustomerProfileInput, OrderInputs, UserLoginInput } from '../dto';
import {Customer, DeliveryUser, Food, Vendor} from '../models';
import { Offer } from '../models/Offer';
import { Order } from '../models/Order';
import { Transaction } from '../models/Transaction';
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOTP, ValidatePassword } from '../utility';
import moment from 'moment-timezone';
import { v4 } from 'uuid';
import { signFunction } from '../utility/signFunction';
import fs from 'fs';
import { Category } from '../models/category';

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInput, req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { email, phone, password } = customerInputs;

    

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp();

    const existingCustomer =  await Customer.find({ email: email});

    const existingCustomerMobile =  await Customer.find({ phone: phone});
    
    if(existingCustomer.length !== 0){
        return res.status(400).json({message: 'Email already exist!'});
    }
    
    if(existingCustomerMobile.length !== 0){
        return res.status(400).json({message: 'Mobile Number already exist!'});
    }

    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0,
        orders: []
    })

    if(result){
        // send OTP to customer
        await onRequestOTP(otp, phone);
        
        //Generate the Signature
        const signature = await GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })
        // Send the result
        return res.status(201).json({signature, verified: result.verified, email: result.email})

    }

    return res.status(400).json({ msg: 'Error while creating user'});


}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {

    
    const customerInputs = plainToClass(UserLoginInput, req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { email, password } = customerInputs;
    const customer = await Customer.findOne({ email: email});
    if(customer){
        const validation = await ValidatePassword(password, customer.password, customer.salt);
        
        if(validation){
            GenerateSignature({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            }).then(signature => {
                return res.status(200).json({
                    signature,
                    email: customer.email,
                    verified: customer.verified
                });
            })
            .catch(err => {
                console.log(err);
                return res.status(400).json({ msg: 'Error With Login'});
            })
            
            return 0;       
        }
    }

    return res.json({ msg: 'Error With Login'});

}


export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {


    const { otp } = req.body;
    const customer = req.user;

    if(customer){
        const profile = await Customer.findById(customer._id);
        if(profile){
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()){
                profile.verified = true;

                const updatedCustomerResponse = await profile.save();

                const signature = await GenerateSignature({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })

                return res.status(200).json({
                    signature,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })
            }
            
        }

    }

    return res.status(400).json({ msg: 'Unable to verify Customer'});
}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if(customer){

        const profile = await Customer.findById(customer._id);

        if(profile){
            const { otp, expiry } = GenerateOtp();
            profile.otp = otp;
            profile.otp_expiry = expiry;

            await profile.save();
            const sendCode = await onRequestOTP(otp, profile.phone);
            
            

            if (!sendCode) {
                console.log('Send code log', sendCode);
                return res.status(400).json({ message: 'Failed to verify your phone number' })
            }

            return res.status(200).json({ message: 'OTP sent to your registered Mobile Number!'})

        }
    }

    return res.status(400).json({ msg: 'Error with Requesting OTP'});
}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;
 
    if(customer){
        
        const profile =  await Customer.findById(customer._id);
        
        if(profile){
             
            return res.status(201).json(profile);
        }

    }
    return res.status(400).json({ msg: 'Error while Fetching Profile'});

}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {


    const customer = req.user;

    const customerInputs = plainToClass(EditCustomerProfileInput, req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { firstName, lastName, address } = customerInputs;

    if(customer){
        
        const profile =  await Customer.findById(customer._id);
        
        if(profile){
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = await profile.save()
            
            return res.status(201).json(result);
        }

    }
    return res.status(400).json({ msg: 'Error while Updating Profile'});

}

/* ------------------- Delivery Notification --------------------- */

const assignOrderForDelivery = async(orderId: string, vendorId: string) => {

    // find the vendor
    const vendor = await Vendor.findById(vendorId);
    if(vendor){
        const areaCode = vendor.pincode;
        const vendorLat = vendor.lat;
        const vendorLng = vendor.lng;
        

        //find the available Delivery person
        const deliveryPerson = await DeliveryUser.find({ pincode: areaCode, verified: true, isAvailable: true});
        
        if(deliveryPerson.length > 0){
            // Check the nearest delivery person and assign the order

            const currentOrder = await Order.findById(orderId);
            if(currentOrder){
                //update Delivery ID
                currentOrder.deliveryId = deliveryPerson[0]._id;
                deliveryPerson[0].isAvailable = false;
                 
                await currentOrder.save();
                await deliveryPerson[0].save();


                //Notify to vendor for received new order firebase push notification
            }

        }else{
            // Notify to vendor for no delivery person available
            console.log('No delivery person available');
            console.log('No delivery person available');
            console.log('No delivery person available');
            console.log('No delivery person available');
            
        }


    }

}


// Inform Delivery Person
const informDeliveryPerson = async(order:any, vendorId:string) => {
    const currentOrder = order;
    // inform delivery person
}

/* ------------------- Order Section --------------------- */

const validateTransaction = async(txnId: string) => {
    
    const currentTransaction = await Transaction.findById(txnId);

    if(currentTransaction){
        if(currentTransaction.status.toLowerCase() !== 'failed'){
            return {status: true, currentTransaction};
        }
    }
    return {status: false, currentTransaction};
}


export const CreateOrder_ = async (req: Request, res: Response, next: NextFunction) => {


    const customer = req.user;

    const { txnId, amount, items } = <OrderInputs>req.body;

    
    if(customer){

        const { status, currentTransaction } =  await validateTransaction(txnId);

        if(!status){
            return res.status(404).json({ message: 'Error while Creating Order!'})
        }

        const profile = await Customer.findById(customer._id);


        const orderId = `${Math.floor(Math.random() * 89999)+ 1000}`;

        const {cart} = req.body;

        let cartItems = Array();

        let netAmount = 0.0;

        let vendorId: string;

        try{
            const IDs = await cart.map((item: { _id: any; }) => item._id);
            
            const foods = await Food.find().where('_id').in(IDs).exec();
            foods.map((food: { _id: any; vendorId: any; price: number; }) => {
                cart.map(({ _id, unit}) => {
                    if(food._id == _id){
                        vendorId = food.vendorId;
                        netAmount += (food.price * unit);
                        cartItems.push({ food, unit})
                    }
                })
            })
            
        }
        catch(err){
            console.log(err);
            return res.status(400).json({ msg: 'Error while Creating Order'});
        }

        if(cartItems){

            const currentOrder = await Order.create({
                orderId: orderId,
                vendorId: vendorId,
                items: cartItems,
                totalAmount: netAmount,
                paidAmount: amount,
                orderDate: new Date(),
                orderStatus: 'Waiting',
                remarks: '',
                deliveryId: '',
                readyTime: 45
            })

            profile.cart = [] as any;
            profile.orders.push(currentOrder);
 

            currentTransaction.vendorId = vendorId;
            currentTransaction.orderId = orderId;
            currentTransaction.status = 'CONFIRMED'
            
            await currentTransaction.save();

            // await assignOrderForDelivery(currentOrder._id, vendorId);
            await informDeliveryPerson(currentOrder, vendorId);

            const profileResponse =  await profile.save();

            return res.status(200).json(profileResponse);

        }

    }

    return res.status(400).json({ msg: 'Error while Creating Order'});
}


export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {

    const { body } = req;

    if(!body) return res.status(400).json({ msg: 'Error while Creating Order', reason: 'Body not found'});

    const{


        req_card_number,
        req_locale,
        signature,
        req_card_type_selection_indicator,
        auth_trans_ref_no,
        req_bill_to_surname,
        req_bill_to_address_city,
        req_card_expiry_date,
        req_bill_to_address_postal_code,
        card_type_name,
        reason_code,
        auth_amount,
        auth_response,
        bill_trans_ref_no,
        req_bill_to_forename,
        req_payment_method,
        request_token,
        req_device_fingerprint_id,
        auth_time,
        req_amount,
        req_bill_to_email,
        transaction_id,
        req_currency,
        req_card_type,
        decision,
        message,
        signed_field_names,
        req_transaction_uuid,
        auth_avs_code,
        auth_code,
        req_bill_to_address_country,
        req_transaction_type,
        req_access_key,
        req_profile_id,
        req_reference_number,
        signed_date_time,
        req_bill_to_address_line1


    } = body;


    if(
        !req_card_number ||
        !req_locale ||
        !signature ||
        !req_card_type_selection_indicator ||
        !auth_trans_ref_no ||
        !req_bill_to_surname ||
        !req_bill_to_address_city ||
        !req_card_expiry_date ||
        !req_bill_to_address_postal_code ||
        !card_type_name ||
        !reason_code ||
        !auth_amount ||
        !auth_response ||
        !bill_trans_ref_no ||
        !req_bill_to_forename ||
        !req_payment_method ||
        !request_token ||
        !req_device_fingerprint_id ||
        !auth_time ||
        !req_amount ||
        !req_bill_to_email ||
        !transaction_id ||
        !req_currency ||
        !req_card_type ||
        !decision ||
        !message ||
        !signed_field_names ||
        !req_transaction_uuid ||
        !auth_avs_code ||
        !auth_code ||
        !req_bill_to_address_country ||
        !req_transaction_type ||
        !req_access_key ||
        !req_profile_id ||
        !req_reference_number ||
        !signed_date_time ||
        !req_bill_to_address_line1


    ) return res.status(400).json({ msg: 'Error while Creating Order', reason: 'Body item not found'});
    



    if(decision.toLowerCase() === 'accept' ){


        const orderId = `${Math.floor(Math.random() * 89999)+ 1000}`;


        const transaction = await Transaction.findOne({ reference_number: req_reference_number});

        if(!transaction) return res.status(400).json({ msg: 'Error while Creating Order', reason: 'Transaction not found'});
            
        transaction.paymentResponse = "payment is successful";
        transaction.payedAmount = auth_amount;
        transaction.status = 'paid';
        transaction.orderId = orderId;
        transaction.req_bill_to_forename = req_bill_to_forename;
        transaction.req_bill_to_surname = req_bill_to_surname;
        transaction.req_bill_to_address_line1 = req_bill_to_address_line1;
        transaction.req_bill_to_address_postal_code = req_bill_to_address_postal_code;
        transaction.req_bill_to_address_city = req_bill_to_address_city;
        transaction.req_bill_to_email = req_bill_to_email;
        transaction.auth_time = auth_time;
        transaction.req_payment_method = req_payment_method;
        transaction.req_currency = req_currency;
        transaction.decision = decision;
        transaction.req_transaction_uuid = req_transaction_uuid;
        transaction.request_token = request_token;
        transaction.card_type_name = card_type_name;
        transaction.req_card_number = req_card_number;
        transaction.req_device_fingerprint_id = req_device_fingerprint_id;
        transaction.auth_trans_ref_no = auth_trans_ref_no;
        transaction.bill_trans_ref_no = bill_trans_ref_no;
        transaction.signature = signature;


        const updatedTransaction = await transaction.save();
       
        // Create Order
        const profile = await Customer.findById(updatedTransaction.customer);
    

        const customer = await Customer.findById(updatedTransaction.customer).populate('cart').exec();
        const cart = customer.cart;
 
        if(
            !updatedTransaction.vendorId ||
            !updatedTransaction.amountForItems ||
            !updatedTransaction.orderValue ||
            !updatedTransaction.payedAmount ||
            !updatedTransaction.lat ||
            !updatedTransaction.lng ||
            !updatedTransaction.addressLineOne ||
            !updatedTransaction.addressLineTwo ||
            !updatedTransaction.city ||
            !updatedTransaction.postalCode
        ){
            return res.status(400).json({ msg: 'Error while Creating Order', reason: 'vendorId, updatedTransaction.amountForItems, updatedTransaction.orderValue, updatedTransaction.payedAmount, updatedTransaction.lat, updatedTransaction.lng, updatedTransaction.addressLineOne, updatedTransaction.addressLineTwo, updatedTransaction.city, updatedTransaction.postalCode Fields are not found'});
        }

        const currentOrder = await Order.create({
            orderId: orderId,
            vendorId: updatedTransaction.vendorId,
            items: cart,
            amountForItems: updatedTransaction.amountForItems,
            totalAmount: updatedTransaction.orderValue,
            paidAmount: updatedTransaction.payedAmount,
            orderType: 'OnlinePayment',
            deliveryStatus: "",
            orderDate: new Date(),
            orderStatus: 'Waiting',
            remarks: '',
            deliveryId: '',
            lat: updatedTransaction.lat,
            lng: updatedTransaction.lng,
            addressLineOne: updatedTransaction.addressLineOne,
            addressLineTwo: updatedTransaction.addressLineTwo,
            city: updatedTransaction.city,
            postalCode: updatedTransaction.postalCode,
            readyTime: 45
        })

        profile.cart = [] as any;
        profile.orders.push(currentOrder);
 

        // await assignOrderForDelivery(currentOrder._id, vendorId);
        await informDeliveryPerson(currentOrder, updatedTransaction.vendorId);

        const profileResponse =  await profile.save();

        return res.status(200).json(profileResponse);


    }

    const transaction = await Transaction.findOne({ reference_number: req_reference_number});

    transaction.status = decision;
    await transaction.save();

    return res.status(400).json({ msg: 'Error while Creating Order', reason: 'Transaction Failed'});
}



export const createTransactionInstance = async (req:any, res: Response, next: NextFunction) => {
    
    const customer = req.user;


    const { vendorId, addressLineOne, addressLineTwo, city, postalCode } = req.body;
    


    if(!customer) return res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: 'Customer not found'});
    
    if( !vendorId || !addressLineOne || !addressLineTwo || !city || !postalCode ) return res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: "vendorId, addressLineOne, addressLineTwo, city, postalCode are Require fields"});


    let amount_for_items = 0.0;
    let tax = 0.0;
    let deliveryFee = 0.0;
    let netAmount = 0.0;

    
    try{
        const user = await Customer.findById(customer._id).populate('cart').exec();
        
        if(user.cart.length === 0) return res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: 'Cart is Empty'});

        const IDs = await user.cart.map((item:any) => item.food);

        
        const vendorFood = await Vendor.findById(vendorId).populate('foods').exec();


        const vendorFoodIDs = await vendorFood.foods.map((item: { _id: any; }) => item._id);


        // check food available or not in vendor
        IDs.map((IDs: any) => {
            if(!vendorFoodIDs.includes(IDs)){
                return res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: 'Food not found in vendor'});
                
            }
        });

        const foods = await Food.find().where('_id').in(IDs).exec();
        
        // Calculate Food Price
        user.cart.map(({ food, unit}) => {
            const price = foods.find( item => {
                return  food.toString() == item._id.toString()
            });
            const item_price = price.price;
            netAmount += (item_price * unit);
        })
        

        amount_for_items = netAmount;
        deliveryFee = req.body.deliveryFee;
        netAmount += req.body.deliveryFee;
        netAmount += tax;
        
    }
    catch(err){
        console.log(err);
        return res.status(400).json({ msg: 'Error while Creating Order'});
    }




    const reference_number = `${Math.floor(Math.random() * 89999)+ 1000}`;
    
    const transaction = await Transaction.create({
        reference_number: reference_number,
        customer: customer._id,
        vendorId: vendorId,


        lat: req.body.lat,
        lng: req.body.lng,
        addressLineOne: req.body.addressLineOne,
        addressLineTwo: req.body.addressLineTwo,
        city: req.body.city,
        postalCode:req.body.postalCode,

        orderId: '',
        amountForItems: amount_for_items,
        deliveryFee:deliveryFee,
        tax: tax,
        orderValue: netAmount,
        payedAmount: -999,
        status: 'OPEN',
        paymentMode: "ONLINE PAYMENT",
        paymentResponse: '',
        req_bill_to_forename: '',
        req_bill_to_surname: '', 
        req_bill_to_address_line1: '', 
        req_bill_to_address_postal_code: '', 
        req_bill_to_address_city: '', 
        req_bill_to_email: '',
        auth_time: '',
        req_payment_method: '',
        req_currency: '',
        decision: '', 
        req_transaction_uuid: '',
        request_token: '',
        card_type_name: '',
        req_card_number: '',
        req_device_fingerprint_id: '',
        auth_trans_ref_no: '',
        bill_trans_ref_no: '',
        signature: ''

    });


    req.body.cyberSourceData = {};

    const _customer = await Customer.findById(customer._id); 

    req.body.cyberSourceData.access_key = '26d2d2d38a123aac9f8d6076b99febea';
    req.body.cyberSourceData.profile_id = '305FCC81-2209-4726-AC56-9BD8444EFD99';
    req.body.cyberSourceData.reference_number = transaction.reference_number;
    req.body.cyberSourceData.amount = transaction.orderValue;
    req.body.cyberSourceData.transaction_uuid = v4();
    req.body.cyberSourceData.signed_field_names = 'access_key,profile_id,reference_number,amount,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,currency,bill_to_address_city,bill_to_address_country,bill_to_address_line1,bill_to_address_postal_code,bill_to_email,bill_to_forename,bill_to_surname';
    req.body.cyberSourceData.unsigned_field_names = '';
    req.body.cyberSourceData.signed_date_time = moment().utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    req.body.cyberSourceData.locale = 'en';
    req.body.cyberSourceData.transaction_type = 'sale';
    req.body.cyberSourceData.currency = 'USD';

    // need to add as user
    req.body.cyberSourceData.bill_to_address_city = transaction.city;
    req.body.cyberSourceData.bill_to_address_country = 'LK';
    req.body.cyberSourceData.bill_to_address_line1 = transaction.addressLineOne;
    req.body.cyberSourceData.bill_to_address_postal_code = transaction.postalCode;
    req.body.cyberSourceData.bill_to_email = _customer.email;
    req.body.cyberSourceData.bill_to_forename = _customer.firstName;
    req.body.cyberSourceData.bill_to_surname  = _customer.lastName;

    const signData = signFunction(req.body.cyberSourceData);
    
    const cyberSourceData = {
        ...req.body.cyberSourceData,
        signature: signData
    }

    const current_transaction = transaction;

    const resData = {
        cyberSourceData,
        transaction
    }

    

    return res.status(200).json(resData);
}


export const createOderCashOnDelivery = async (req: Request, res: Response, next: NextFunction) => {
    
    const customer = req.user;

    const { vendorId, lat, lng, addressLineOne, addressLineTwo, city, postalCode } = req.body;

    if(!customer) return res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: 'Customer not found'});
    
    if( !vendorId || !lat || !lng || !addressLineOne || !addressLineTwo || !city || !postalCode ) return res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: "vendorId, lat, lng, addressLineOne, addressLineTwo, city, postalCode, are Require fields"});


    let amount_for_items = 0.0;
    let tax = 0.0;
    let deliveryFee = 0.0;
    let netAmount = 0.0

    const user = await Customer.findById(customer._id).populate('cart').exec();

    try{
        
        if(user.cart.length === 0) return res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: 'Cart is Empty'});

        const IDs = await user.cart.map((item:any) => item.food);

        
        const vendorFood = await Vendor.findById(vendorId).populate('foods').exec();


        const vendorFoodIDs = await vendorFood.foods.map((item: { _id: any; }) => item._id);


        // check food available or not in vendor
        IDs.map((IDs: any) => {
            if(!vendorFoodIDs.includes(IDs)){
                return res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: 'Food not found in vendor'});
                
            }
        });

        const foods = await Food.find().where('_id').in(IDs).exec();
        
        // Calculate Food Price
        user.cart.map(({ food, unit}) => {
            const price = foods.find( item => {
                return  food.toString() == item._id.toString()
            });
            const item_price = price.price;
            netAmount += (item_price * unit);
        })
        

        amount_for_items = netAmount;
        deliveryFee = req.body.deliveryFee;
        netAmount += req.body.deliveryFee;
        netAmount += tax;
        
    }
    catch(err){
        console.log(err);
        return res.status(400).json({ msg: 'Error while Creating Order'});
    }


    // Create Order
    const currentOrder = await Order.create({
        orderId: `${Math.floor(Math.random() * 89999)+ 1000}`,
        vendorId: vendorId,
        items:  user.cart,
        amountForItems: amount_for_items,
        totalAmount: netAmount,
        paidAmount: -999,
        orderType: 'COD',
        orderDate: new Date(),
        orderStatus: 'Waiting',
        deliveryStatus: "",
        remarks: '',
        deliveryId: '',
        lat: lat,
        lng: lng,
        addressLineOne: addressLineOne,
        addressLineTwo: addressLineTwo,
        city: city,
        postalCode: postalCode,
        readyTime: 45
    })


    user.cart = [] as any;
    user.orders.push(currentOrder);

    // await assignOrderForDelivery(currentOrder._id, vendorId);
    await informDeliveryPerson(currentOrder, vendorId);

    const profileResponse =  await user.save();

    return res.status(200).json(profileResponse);

}

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;
    
    if(customer){

 
        const profile = await Customer.findById(customer._id).populate("orders");
        if(profile){
            return res.status(200).json(profile.orders);
        }

    }

    return res.status(400).json({ msg: 'Orders not found'});
}


export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
    const orderId = req.params.id;
    
    
    if(orderId){

 
        try{
            const order = await Customer.findById(customer._id).populate({
                path: 'orders',
                match: { orderId: orderId }
            });
        
        if(order){
            return res.status(200).json(order);
        }
        }
        catch(err){
            console.log(err);
            return res.status(400).json({ msg: 'Invalid Order Id'});
        }

    }

    return res.status(400).json({ msg: 'Order not found'});
}

/* ------------------- Cart Section --------------------- */
export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;
    
    if(customer){

        const profile = await Customer.findById(customer._id);
        let cartItems = Array();

        const { _id, unit } = <CartItem>req.body;

        const food = await Food.findById(_id);

        if(food){

            if(profile != null){
                cartItems = profile.cart;

                if(cartItems.length > 0){
                    // check and update
                    let existFoodItems = cartItems.filter((item) => item.food._id.toString() === _id);
                    if(existFoodItems.length > 0){
                        
                        const index = cartItems.indexOf(existFoodItems[0]);
                        
                        if(unit > 0){
                            cartItems[index] = { food, unit };
                        }else{
                            cartItems.splice(index, 1);
                        }

                    }else{
                        cartItems.push({ food, unit})
                    }

                }else{
                    // add new Item
                    cartItems.push({ food, unit });
                }

                if(cartItems){
                    profile.cart = cartItems as any;
                    const cartResult = await profile.save();
                    return res.status(200).json(cartResult.cart);
                }

            }
        }

    }

    return res.status(404).json({ msg: 'Unable to add to cart!'});
}

export const GetCart = async (req: Request, res: Response, next: NextFunction) => {

      
    const customer = req.user;
    
    if(customer){
        const profile = await Customer.findById(customer._id);

        if(profile){
            return res.status(200).json(profile.cart);
        }
    
    }

    return res.status(400).json({message: 'Cart is Empty!'})

}

export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {

   
    const customer = req.user;

    if(customer){

        const profile = await Customer.findById(customer._id).populate('cart.food').exec();

        if(profile != null){
            profile.cart = [] as any;
            const cartResult = await profile.save();

            return res.status(200).json(cartResult);
        }

    }

    return res.status(400).json({message: 'cart is Already Empty!'})

}



export const VerifyOffer = async (req: Request, res: Response, next: NextFunction) => {

    const offerId = req.params.id;
    const customer = req.user;
    
    if(customer){

        const appliedOffer = await Offer.findById(offerId);
        
        if(appliedOffer){
            if(appliedOffer.isActive){
                return res.status(200).json({ message: 'Offer is Valid', offer: appliedOffer});
            }
        }

    }

    return res.status(400).json({ msg: 'Offer is Not Valid'});
}


export const CreatePayment = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    const { amount, paymentMode, offerId} = req.body;

    let payableAmount = Number(amount);

    if(offerId){

        try{
            const appliedOffer = await Offer.findById(offerId);

            if(appliedOffer.isActive){
                payableAmount = (payableAmount - appliedOffer.offerAmount);
            }
        }
        catch(err){
            console.log(err);
            return res.status(400).json({ msg: 'Cannot found offer'});
        }
    }
    // perform payment gateway charge api

    // create record on transaction
    const transaction = await Transaction.create({
        customer: customer._id,
        vendorId: '',
        orderId: '',
        orderValue: payableAmount,
        offerUsed: offerId || 'NA',
        status: 'OPEN',
        paymentMode: paymentMode,
        paymentResponse: 'Payment is cash on Delivery'
    })


    //return transaction
    return res.status(200).json(transaction);

}

export const GetCategory_ = async (req: Request, res: Response, next: NextFunction) => {
    
    const categories = await Category.find();

    if(categories.length > 0){
        return res.json(categories)
    }

    return res.json({"message": "Category data not available"})
}

export const GetCategoryByID_ = async (req: Request, res: Response, next: NextFunction) => {
    
    const categoryId = req.params.id;
    
        const category = await Category.findById(categoryId);
        
        if(category){
            return res.json(category)
        }
    
        return res.json({"message": "Category not available"})
}