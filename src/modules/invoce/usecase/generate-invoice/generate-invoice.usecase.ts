import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.usecase.dto";


export default class GenerateInvoiceUseCase {

    private _invoiceRepository: InvoiceGateway;
    
    constructor(_invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = _invoiceRepository;
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const props = this.inputToProps(input)
        const invoice = new Invoice(props);
        await this._invoiceRepository.add(invoice);
        return this.entityToOutput(invoice);
    }


    private inputToProps(input: GenerateInvoiceUseCaseInputDto) {
        return {
            name: input.name,
            document: input.document,
            address: {
                street: input.street,
                number: input.number,
                complement: input.complement,
                city: input.city,
                state: input.state,
                zipCode: input.zipCode
            },
            items: input.items
                .map(item => {
                    return {
                        id: new Id(item.id),
                        name: item.name,
                        price: item.price,
                    };

                }),
        };
    }

    private entityToOutput(invoice: Invoice): GenerateInvoiceUseCaseOutputDto {
        return {
            id: invoice.id.id,
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
                    id: item.id.id,
                    name: item.name,
                    price: item.price,
                };
            }),
            total: invoice.items
                .reduce((total, item) => total + item.price, 0),
        };
    }
}