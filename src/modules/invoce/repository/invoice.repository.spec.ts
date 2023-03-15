import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";


describe("InvoiceRepository test", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });

    it("should create a invoice", async () => {
        const invoiceProps = createInvoicePros("1");
        const invoice = new Invoice(invoiceProps);
        const invoiceRepository = new InvoiceRepository();
        await invoiceRepository.add(invoice);

        const invoiceDb = await InvoiceModel.findOne({
            where: { id: invoiceProps.id.id, },
            include: InvoiceItemModel,
        });
        
        expect(invoiceDb.id).toBe(invoiceProps.id.id);
        expect(invoiceDb.name).toBe(invoiceProps.name);
        expect(invoiceDb.document).toBe(invoiceProps.document);
        expect(invoiceDb.street).toBe(invoiceProps.address.street);
        expect(invoiceDb.number).toBe(invoiceProps.address.number);
        expect(invoiceDb.complement).toBe(invoiceProps.address.complement);
        expect(invoiceDb.city).toBe(invoiceProps.address.city);
        expect(invoiceDb.state).toBe(invoiceProps.address.state);
        expect(invoiceDb.zipCode).toBe(invoiceProps.address.zipCode);
        expect(invoiceDb.items.length).toBe(2);
        expect(invoiceDb.items[0].name).toBe("Product 1");
        expect(invoiceDb.items[0].price).toBe(100);
        expect(invoiceDb.items[1].name).toBe("Product 2");
        expect(invoiceDb.items[1].price).toBe(200);
    });

    it("should find all invoices", async () => {
        const invoiceRepository = new InvoiceRepository();
        
        const invoiceProps = createInvoicePros("1");
        const invoice = new Invoice(invoiceProps);
        
        await invoiceRepository.add(invoice);

        const invoiceDb = await invoiceRepository.find(invoiceProps.id.id);

        expect(invoiceDb.id.id).toBe(invoiceProps.id.id);
        expect(invoiceDb.name).toBe(invoiceProps.name);
        expect(invoiceDb.document).toBe(invoiceProps.document);
        expect(invoiceDb.address.street).toBe(invoiceProps.address.street);
        expect(invoiceDb.address.number).toBe(invoiceProps.address.number);
        expect(invoiceDb.address.complement).toBe(invoiceProps.address.complement);
        expect(invoiceDb.address.city).toBe(invoiceProps.address.city);
        expect(invoiceDb.address.state).toBe(invoiceProps.address.state);
        expect(invoiceDb.address.zipCode).toBe(invoiceProps.address.zipCode);
        expect(invoiceDb.items.length).toBe(2);
        expect(invoiceDb.items[0].name).toBe("Product 1");
        expect(invoiceDb.items[0].price).toBe(100);
        expect(invoiceDb.items[1].name).toBe("Product 2");
        expect(invoiceDb.items[1].price).toBe(200);
    });
});

function createInvoicePros(id: string) {
    return {
        id: new Id(id),
        name: "Invoice " + id,
        document: "123456789",
        address: {
            street: "Street 1",
            number: "1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "123456",
        },
        items: [
            {
                id: new Id("P1"),
                name: "Product 1",
                price: 100,
            },
            {
                id: new Id("P2"),
                name: "Product 2",
                price: 200,
            },
        ],
    };
}
