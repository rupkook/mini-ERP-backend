import mongoose, { Document } from 'mongoose';
export interface ISaleItem {
    product: mongoose.Types.ObjectId;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
export interface ISale extends Document {
    customer: mongoose.Types.ObjectId;
    customerName: string;
    items: ISaleItem[];
    grandTotal: number;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ISale, {}, {}, {}, mongoose.Document<unknown, {}, ISale, {}, mongoose.DefaultSchemaOptions> & ISale & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISale>;
export default _default;
//# sourceMappingURL=Sale.d.ts.map