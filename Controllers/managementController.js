import userModel from "../Models/userModel.js";

export const getusersController = async (req,res) => {
    try{
      const users = await userModel.find().populate("name").populate("email").populate("phone").populate("address");
      res.status(200).send({
        success: true,
        counTotal: users.length,
        message: "All Users ",
        users,
      })
    }
    catch(error){
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error while Getting users",
        error,
      })
    }
};


export const getUsersByIdController= async(req,res)=>{
    try {
        const {id} = req.params;
     const user =  await userModel.findById(id);
      res.status(200).send({
        success: true,
        message: "User Found ",
        user,
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "No User Found",
        error,
      });
    }
}