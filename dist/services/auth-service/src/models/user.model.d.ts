import mongoose from 'mongoose';
export declare const User: mongoose.Model<{
    email: string;
    password: string;
    twoFactorEnabled: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    twoFactorSecret?: string | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    email: string;
    password: string;
    twoFactorEnabled: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    twoFactorSecret?: string | null | undefined;
}, {}> & {
    email: string;
    password: string;
    twoFactorEnabled: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    twoFactorSecret?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email: string;
    password: string;
    twoFactorEnabled: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    twoFactorSecret?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    email: string;
    password: string;
    twoFactorEnabled: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    twoFactorSecret?: string | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    email: string;
    password: string;
    twoFactorEnabled: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    twoFactorSecret?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
