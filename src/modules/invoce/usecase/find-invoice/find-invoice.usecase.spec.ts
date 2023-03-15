import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "../find-invoice/find-invoice.usecase";

const invoice = new Invoice({
    id: new Id("1"),
    name: "Invoce 1",
    document: "123456789",
    address: {
        street: "Street 1",
        number: "123",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "123456",
    },
    items: [
        {
            id: new Id("1"),
            name: "Product 1",
            price: 100,
        },
        {
            id: new Id("2"),
            name: "Product 2",
            price: 200,
        }
    ]});

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    };
};

describe("find a invoice usecase unit test", () => {

    it("should find a invoice", async () => {

        const invoiceRepository = MockRepository();
        const usecase = new FindInvoiceUseCase(invoiceRepository);

        const input = {
            id: "1",
        };

        const result = await usecase.execute(input);

        expect(invoiceRepository.find).toHaveBeenCalled();
        expect(result.id).toBe("1");
        expect(result.name).toBe("Invoce 1");
        expect(result.document).toBe("123456789");
        expect(result.address.street).toBe("Street 1");
        expect(result.address.number).toBe("123");
        expect(result.address.complement).toBe("Complement 1");
        expect(result.address.city).toBe("City 1");
        expect(result.address.state).toBe("State 1");
        expect(result.address.zipCode).toBe("123456");
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe("1");
        expect(result.items[0].name).toBe("Product 1");
        expect(result.items[0].price).toBe(100);
        expect(result.items[1].id).toBe("2");
        expect(result.items[1].name).toBe("Product 2");
        expect(result.items[1].price).toBe(200);
        expect(result.total).toBe(300);
    });
});