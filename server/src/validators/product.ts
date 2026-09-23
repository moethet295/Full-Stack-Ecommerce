import { body } from "express-validator";


export const createProductValidator = [   
        body("name").notEmpty().withMessage("Name is require"),
        body("description").notEmpty().withMessage("Description is require"),
        body("price").isNumeric().withMessage("price is require"),
        body("instock_count").isInt().withMessage("instock_count is require"),
        body("category").notEmpty().withMessage("category is require"),
        body("sizes").isArray({ min: 1 }).withMessage("sizes is require"),
        body("colors").isArray({ min: 1 }).withMessage("colors is require"),
        body("images").isArray({ min: 1 }).withMessage("images is require"),
        body("images.*.file").notEmpty().withMessage("images url is require"),
        body("images.*.preview").notEmpty().withMessage("images must have preview"),
        body("is_new_arrival").isBoolean().withMessage("is_new_arrival is require"),
        body("is_feature").isBoolean().withMessage("is_feature is require"),
        body("rating_count").isNumeric().withMessage("rating_count is require"),    
    
    
    ];

    



    