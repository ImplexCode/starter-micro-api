import { Request, Response, NextFunction } from 'express'
import { CreateVandorInput } from '../dto';
import { DeliveryUser, Vendor } from '../models';
import { Transaction } from '../models/Transaction';
import { GeneratePassword, GenerateSalt } from '../utility';
import { plainToClass } from 'class-transformer';
import { AdminLoginInput } from '../dto/Admin.dto';
import { AdminRegisterInput } from '../dto/Admin.dto';
import { validate } from 'class-validator';
import { Admin } from '../models/Admin';
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import { Vehicle } from '../models/Vehicle';
import { Category } from '../models/category';


export const AdminRegister = async (req: Request, res: Response, next: NextFunction) => {
    const adminInputs = plainToClass(AdminRegisterInput, req.body);
    const adminError = await validate(AdminRegisterInput, {validationError: { target: true}});
    
    if(adminError.length > 0){
        return res.json(adminError);
    }

    const { email, password, firstName } = adminInputs;

    if(!email || !password || !firstName){
        return res.json({ message: "All fields are required"})
    }

    // check if the email is already registered
    const admin = await Admin.findOne({email: email});

    if(admin){
        return res.json({message: "Admin already registered"})
    }

    // encrypt the password by bcrypt
    bcrypt.genSalt(10, (err:any, salt:any) => {
        if(err) return res.json({message: "Validation Process Failed"});

        bcrypt.hash(password, salt, async (err, hash) => {
            if(err) return res.json({message: "Validation Process Failed"});

            const admin = new Admin({
                email: email,
                password: hash,
                firstName: firstName,
            });

            const newAdmin = {
                email: email,
                firstName: firstName,
            }

            await admin.save();

            return res.status(201).json({message: "Admin Created Successfully", admin: newAdmin})

        })
    });


}

export const AdminLogin = async (req , res: Response, next: NextFunction) => {


    const adminInputs = plainToClass(AdminLoginInput, req.body);


    const validationError = await validate(adminInputs, {validationError: { target: true}});


    if(validationError.length > 0){
        return res.json(validationError);
    }


    const { email, password } = adminInputs;


    const admin = await Admin.findOne({email: email});

    

    if(admin === null){
        return res.json({message: "Invalid Credentials"})
    }
    

    // compare the password
    bcrypt.compare(password, admin.password, (err:any, isMatch:boolean) => {
        
        if(err) return res.json({message: "Validation Process Failed"})

        if(isMatch){
            const authPayload = {
                _id: admin._id,
                email: admin.email,
                firstName: admin.firstName,
            }

            req.session.user = authPayload;

            res.statusCode = 200;
            return res.send(req.session)
        }

        return res.json({message: "Can't admin authenticate"})

    });


    
}

export const CheckAuth = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(req.session);
}

// export const FindVendor = async (id: String | undefined, email?: string) => {

//     if(email){
//         return await Vendor.findOne({ email: email})
//     }else{
//         return await Vendor.findById(id);
//     }

// }

export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {

    const { name, address, pincode, foodType, email, password, ownerName, phone }  = <CreateVandorInput>req.body;

    if(!name || !address || !pincode || !foodType || !email || !password || !ownerName || !phone){
        return res.json({ "message": "All fields are required"})
    }
    

    const existingEmail = await Vendor.find({'email': email});
        
    const existingPhone = await Vendor.find({'phone': phone});
        
    const existingPincode = await Vendor.find({'pincode': pincode});
        
    const existingAddress = await Vendor.find({'address': address});


        

    if(existingEmail.length > 0) return res.status(400).json({ "message": "A vendor is exist with this email ID"});
    if(existingPhone.length > 0) return res.status(400).json({ "message": "A vendor is exist with this phone number"});
    if(existingPincode.length > 0) return res.status(400).json({ "message": "A vendor is exist with this pincode"});
    if(existingAddress.length > 0) return res.status(400).json({ "message": "A vendor is exist with this address"});


    //generate a salt

    const salt =  await GenerateSalt()
    const userPassword = await GeneratePassword(password, salt);

    // encrypt the password using the salt
    

    const createdVandor =  await Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        lat: "",
        lng: ""
    })

    return res.status(200).json(createdVandor)

}

export const CreateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    if(!name || !description){
        return res.json({ "message": "All fields are required"})
    }

    const createdCategory = await Category.create({
        name: name,
        description: description
    })

    if(createdCategory){
        return res.status(200).json(createdCategory)
    }

    return res.json({ "message": "Unable to create category"})
}

export const GetCategory = async (req: Request, res: Response, next: NextFunction) => {
    
    const categories = await Category.find();

    if(categories.length > 0){
        return res.json(categories)
    }

    return res.json({"message": "Category data not available"})
}

export const GetCategoryByID = async (req: Request, res: Response, next: NextFunction) => {
    
    const categoryId = req.params.id;
    
        const category = await Category.findById(categoryId);
        
        if(category){
            return res.json(category)
        }
    
        return res.json({"message": "Category not available"})
}

export const UpdateCategory = async (req: Request, res: Response, next: NextFunction) => {
        
            const { id, name, description } = req.body;
        
            if(!id || !name || !description){
                return res.json({ "message": "All fields are required"})
            }
        
            const updatedCategory = await Category.findOneAndUpdate(
                {_id: id}, 
                { name: name, description: description }, 
                { new: true, useFindAndModify: false }
            )
        
            if(updatedCategory){
                return res.status(200).json(updatedCategory)
            }
        
            return res.json({ "message": "Unable to update category"})
}

export const DeleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;

    if(!id) return res.json({ "message": "All fields are required"})

    try{
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (deletedCategory) {
            return res.status(200).json({ deletedCategory, "message": "Category successfully deleted..!" });
          } 
          
    }
    catch(err){
        return res.json({ "message": "Unable to delete category"})
    }

    return res.json({ "message": "Unable to delete category"})
}

export const GetVanndors = async (req: Request, res: Response, next: NextFunction) => {

    const vendors = await Vendor.find().populate('foodType');

    if(vendors !== null){
        return res.json(vendors)
    }

    return res.json({"message": "Vendors data not available"})
    

}

export const GetVandorByID = async (req: Request, res: Response, next: NextFunction) => {

    const vendorId = req.params.id;

    const vendors = await Vendor.findById(vendorId).populate('foodType');

    if(vendors !== null){
        return res.json(vendors)
    }

    return res.json({"message": "Vendors data not available"})

}

export const GetTransactionsByPage = async (req: Request, res: Response, next: NextFunction) => {

    const page = parseInt(req.params.page);
    const perPage = 10;
    const rowCount = (page + 1) * perPage;
 
    const transactions = await Transaction.find()
        .where('decision').equals("ACCEPT")
        .sort({ createdAt: -1 }) // Sort in descending order by createdAt field
        .limit(rowCount);

    if(transactions){
        return res.status(200).json(transactions)
    }

    return res.json({"message": "Transactions data not available"})

}

export const GetTransactions = async (req: Request, res: Response, next: NextFunction) => {

    const transactions = await Transaction.find()
        .where('decision').equals("ACCEPT")
        .sort({ createdAt: -1 })
        

    if(transactions){
        return res.status(200).json(transactions)
    }

    return res.json({"message": "Transactions data not available"})

}

export const GetTransactionsByCondition = async (req: Request, res: Response, next: NextFunction) => {


    const page = parseInt(req.params.page);
    const perPage = 10;


    const rowCount = (page + 1) * perPage;
    const searchBy = req.params.searchBy;
    const searchValue = req.params.searchValue;

    if(searchBy === "reference_number"){

        const transactions = await Transaction.find({
            decision: "ACCEPT",
            reference_number: { $regex: searchValue, $options: 'i' } // Using regex for partial matching
          })
          .sort({ createdAt: -1 })
          .limit(rowCount);

          if(transactions){ 
            return res.status(200).json(transactions)
        }

        res.status(200).json([]);

    }
    else{
        return res.json({"message": "Transactions data not available", reason: "Invalid search by"})
    }

    
    return res.json({"message": "Transactions data not available"})

}

export const GetTransactionById = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;

    const transaction = await Transaction.findById(id);

    if(transaction){
        return res.status(200).json(transaction)
    }

     return res.json({"message": "Transaction data not available"})

}

export const VerifyDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {

    const { _id, status, vehicle } = req.body;

    if(_id && vehicle && status){

        const profile = await DeliveryUser.findById(_id);

        // create new vehicle
        const newVehicle = new Vehicle({
            vehicleNumber: vehicle.vehicleNumber,
        });

        await newVehicle.save();
        
        if(profile && newVehicle){
            profile.verified = status;
            profile.vehicle = newVehicle._id;
            const result = await profile.save()

            if(result){
                const profileDetails = await DeliveryUser.findById(_id).populate('vehicle');
                return res.status(200).json(profileDetails);
            }

        }
    }

    return res.status(400).json({ message: 'Unable to verify Delivery User'});
}

export const GetDeliveryUsers = async (req: Request, res: Response, next: NextFunction) => {

    const selectedValue = req.params.selectedValue;

    let deliveryUsers = [];

    if(selectedValue === "a"){
     deliveryUsers = await DeliveryUser.find();
    }
    else if(selectedValue === "b"){
        deliveryUsers = await DeliveryUser.find({ verified: true});
    }
    else if(selectedValue === "c"){
        deliveryUsers = await DeliveryUser.find({ verified: false});
    }
    else{
        return res.json({ message: 'Unable to get Delivery Users', reason: "Invalid selected value"});
    }

    if(deliveryUsers){
        return res.status(200).json(deliveryUsers);
    }
    
    return res.json({ message: 'Unable to get Delivery Users'});
}

export const GetNotActivatedDeliveryUsers = async (req: Request, res: Response, next: NextFunction) => {
    
    const deliveryUsers = await DeliveryUser.find({ verified: false});

    if(deliveryUsers){
        return res.status(200).json(deliveryUsers);
    }
    
    return res.json({ message: 'Unable to get Delivery Users'});
}

export const GetDeliveryUsersByID = async (req: Request, res: Response, next: NextFunction) => {
    
     const id = req.params.id;

     const deliveryUsers = await DeliveryUser.findById(id).populate('vehicle');

     if(deliveryUsers){
         return res.status(200).json(deliveryUsers);
     }
     
     return res.json({ message: 'Unable to get Delivery Users'});
}

export const GetDeliveryUsersBy = async (req: Request, res: Response, next: NextFunction) => {

    const searchBy = req.params.searchBy;
    const searchValue = req.params.searchValue;
    const selectedValue = req.params.selectedValue;


    if(!searchBy || !searchValue || !selectedValue){
        return res.json({ message: 'Unable to get Delivery Users', reason: "require params searchBy and searchValue, selectedValue"});
    }

    let verified:any;

    if(selectedValue == "a"){
        verified = { $in: [true, false] };
    }
    else if(selectedValue == "b"){
        verified = true;
    }
    else if(selectedValue == "c"){
        verified = false;
    }
    else{
        return res.json({ message: 'Unable to get Delivery Users', reason: "Invalid selected value"});
    }

    if(searchBy === "pin"){

        const deliveryUsers = await DeliveryUser.find({
            pincode: { $regex: searchValue, $options: 'i' },
            verified: verified
        })
        .exec();

        if(deliveryUsers){
            return res.status(200).json(deliveryUsers);
        }

    }
    
    else if(searchBy === "phone"){
        

        const deliveryUsers = await DeliveryUser.find({
            phone: { $regex: searchValue, $options: 'i' },
            verified: verified
        })
        .exec();

        if(deliveryUsers){
            return res.status(200).json(deliveryUsers);
        }

    }
    else if(searchBy === "firstName"){

        const deliveryUsers = await DeliveryUser.find({
            firstName: { $regex: searchValue, $options: 'i' },
            verified: verified
        })
        .exec();

        if(deliveryUsers){
            return res.status(200).json(deliveryUsers);
        }
        
    }
    
    else if(searchBy === "lastName"){

        const deliveryUsers = await DeliveryUser.find({
            lastName: { $regex: searchValue, $options: 'i' },
            verified: verified
        })
        .exec();

        if(deliveryUsers){
            return res.status(200).json(deliveryUsers);
        }
        
    }

    return res.json({ message: 'Unable to get Delivery Users'});
}

export const GetNotActivatedDeliveryUsersBy = async (req: Request, res: Response, next: NextFunction) => {

    const searchBy = req.params.searchBy;
    const searchValue = req.params.searchValue;

    if(!searchBy || !searchValue){
        return res.json({ message: 'Unable to get Delivery Users', reason: "require params searchBy and searchValue"});
    }


    if(searchBy === "pin"){

        const deliveryUsers = await DeliveryUser.find({
            pincode: { $regex: searchValue, $options: 'i' },
            verified: false
        })
        .exec();

        if(deliveryUsers){
            return res.status(200).json(deliveryUsers);
        }

    }
    
    else if(searchBy === "phone"){
        

        const deliveryUsers = await DeliveryUser.find({
            phone: { $regex: searchValue, $options: 'i' },
            verified: false
        })
        .exec();

        if(deliveryUsers){
            return res.status(200).json(deliveryUsers);
        }

    }
    else if(searchBy === "firstName"){

        const deliveryUsers = await DeliveryUser.find({
            firstName: { $regex: searchValue, $options: 'i' },
            verified: false
        })
        .exec();

        if(deliveryUsers){
            return res.status(200).json(deliveryUsers);
        }
        
    }
    
    else if(searchBy === "lastName"){

        const deliveryUsers = await DeliveryUser.find({
            lastName: { $regex: searchValue, $options: 'i' },
            verified: false
        })
        .exec();

        if(deliveryUsers){
            return res.status(200).json(deliveryUsers);
        }
        
    }
    else if(searchBy === "_id"){
        
        const deliveryUsers = await DeliveryUser.find({
            _id: { $regex: searchValue, $options: 'i' },
            verified: false
        })
        .exec();

        if(deliveryUsers){
            return res.status(200).json(deliveryUsers);
        }
    }

    return res.json({ message: 'Unable to get Delivery Users'});
}