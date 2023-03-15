import { Sequelize } from "sequelize-typescript";
import { InvoiceItemModel } from "../repository/invoice-item.model";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";

describe("InvoiceFacade test", () => {
    let sequelize: Sequelize;

    const input = {
        name: "Invoice Facade 1",
        document: "123456789",
        street: "Street 1",
        number: "1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "12345678",
        items: [
            {
                id: "P1",
                name: "Product 1",
                price: 140,
            },
            {
                id: "P2",
                name: "Product 2",
                price: 200,
            }],
    }

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

    it("should generate a invoice", async () => {

        const invoiceRepository = new InvoiceRepository();
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);
        const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
        const invoiceFacade = new InvoiceFacade({
            generate: generateInvoiceUseCase,
            find: findInvoiceUseCase,
        });

        const invoice = await invoiceFacade.generate(input);

        expect(invoice.id).toBeDefined();
        expect(invoice.name).toBe(input.name);
        expect(invoice.document).toBe(input.document);
        expect(invoice.street).toBe(input.street);
        expect(invoice.number).toBe(input.number);
        expect(invoice.complement).toBe(input.complement);
        expect(invoice.city).toBe(input.city);
        expect(invoice.state).toBe(input.state);
        expect(invoice.zipCode).toBe(input.zipCode);
        expect(invoice.items.length).toBe(2);
        expect(invoice.items[0].name).toBe("Product 1");
        expect(invoice.items[0].price).toBe(140);
        expect(invoice.items[1].name).toBe("Product 2");
        expect(invoice.items[1].price).toBe(200);
    });

    it('should find a invoice', async () => {

        const invoiceRepository = new InvoiceRepository();
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);
        const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
        const invoiceFacade = new InvoiceFacade({
            generate: generateInvoiceUseCase,
            find: findInvoiceUseCase,
        });

        const invoice = await invoiceFacade.generate(input);
        const foundInvoice = await invoiceFacade.find({ id: invoice.id });

        expect(foundInvoice.id).toBe(invoice.id);
        expect(foundInvoice.name).toBe(invoice.name);
        expect(foundInvoice.document).toBe(invoice.document);
        expect(foundInvoice.address.street).toBe(invoice.street);
        expect(foundInvoice.address.number).toBe(invoice.number);
        expect(foundInvoice.address.complement).toBe(invoice.complement);
        expect(foundInvoice.address.city).toBe(invoice.city);
        expect(foundInvoice.address.state).toBe(invoice.state);
        expect(foundInvoice.address.zipCode).toBe(invoice.zipCode);
        expect(foundInvoice.items.length).toBe(2);
        expect(foundInvoice.items[0].name).toBe("Product 1");
        expect(foundInvoice.items[0].price).toBe(140);
        expect(foundInvoice.items[1].name).toBe("Product 2");
        expect(foundInvoice.items[1].price).toBe(200);

    });

});