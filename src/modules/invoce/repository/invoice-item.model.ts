import { BelongsTo, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";

@Table({
    tableName: "invoice_item",
    timestamps: false,
})
export class InvoiceItemModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @BelongsTo(() => InvoiceModel, "invoice_id")
    invoice: InvoiceModel;

    @Column({ allowNull: false, field: "product_id" })
    productId: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    price: number;
}