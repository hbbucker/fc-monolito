import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
    return {
      add: jest.fn(),
      find: jest.fn(),
    };
  };

describe("Generate Invoice usecase unit test", () => {

    it("should generate a invoice", async () => {
        const invoceRepository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(invoceRepository);    

        const input = {
            name: "Invoce 1",
            document: "123456789",
            street: "Street 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "123456",
            items: [
                {   
                    id: "1",
                    name: "Product 1",
                    price: 100,
                },
                {
                    id: "2",
                    name: "Product 2",
                    price: 200,
                }
            ]
        };

        const result = await usecase.execute(input);

        expect(invoceRepository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined;
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        expect(result.items[0].id).toBeDefined;
        expect(result.items[0].name).toBe(input.items[0].name);
        expect(result.items[0].price).toBe(input.items[0].price);
        expect(result.items[1].id).toBeDefined;
        expect(result.items[1].name).toBe(input.items[1].name);
        expect(result.items[1].price).toBe(input.items[1].price);
    });
});