import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface Iuser extends Document {
    name: string;
    email: string;
    password: string;
    role: "customer" | "admin";

    avator: {
        url: string;
        public_id: string;
    };

    resetPasswordToken?: string | undefined;
    resetPasswordExpire?: Date | undefined;

    matchPassword(enteredPassword: string): Promise<boolean>;

    generatePasswordResetToken(): string;
}

const userSchema = new Schema<Iuser>(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },

        // Password Reset
        resetPasswordToken: {
            type: String,
        },

        resetPasswordExpire: {
            type: Date,
        },

        // Avatar
        avator: {
            url: {
                type: String,
                default: "",
            },

            public_id: {
                type: String,
                default: "",
            },
        },
    },
    {
        timestamps: true,
    }
);


// Password Hash
userSchema.pre("save", async function () {

    // Password မပြောင်းရင် hash မလုပ်
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
        this.password,
        salt
    );
});


// Compare Password
userSchema.methods.matchPassword = async function (
    enteredPassword: string
): Promise<boolean> {

    return await bcrypt.compare(
        enteredPassword,
        this.password
    );
};


// Generate Password Reset Token
userSchema.methods.generatePasswordResetToken = function (): string {

    // Random token
    const token = crypto
        .randomBytes(20)
        .toString("hex");

    // Hash token before saving to DB
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // Token expires in 10 minutes
    this.resetPasswordExpire = new Date(
        Date.now() + 10 * 60 * 1000
    );

    // Send original token to user via email
    return token;
};


export const User = mongoose.model<Iuser>(
    "User",
    userSchema
);