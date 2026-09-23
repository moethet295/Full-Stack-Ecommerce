import { Response } from "express";
import json from "jsonwebtoken";
import { Types } from "mongoose";


const generateToken = async (res: Response, userId: Types.ObjectId) => {
    const token = json.sign({id: userId},process.env.JSON_WEB_TOKEN_SECRET!, {
        expiresIn: "7d"
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        sameSite: "lax",
    })
}

export default generateToken;

