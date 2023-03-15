import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
    async add(invoice: Invoice): Promise<void> {
        const invoiceId: string = invoice.id.id || new Id().id;
        await InvoiceModel.create({
            id: invoiceId,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map(item => {
                return {
                    id: new Id().id,
                    productId: item.id.id,
                    name: item.name,
                    price: item.price,
                };
            }),
            total: invoice.items.reduce((total, item) => total + item.price, 0),
            createdAt: new Date(),
        },
        {
            include: [InvoiceItemModel]
        });
    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: { id },
            include: InvoiceItemModel,
        });

        if (!invoice) {
            throw new Error(`Invoice with id ${id} not found`);
        }

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: {
                street: invoice.street,
                number: invoice.number,
                complement: invoice.complement,
                city: invoice.city,
                state: invoice.state,
                zipCode: invoice.zipCode,
            },
            items: invoice.items.map(item => {
                return {
                    id: new Id(item.productId),
                    name: item.name,
                    price: item.price,
                };
            }),
            createdAt: invoice.createdAt,
        });
    }

}