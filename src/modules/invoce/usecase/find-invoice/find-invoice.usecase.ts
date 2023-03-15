import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDto, FindInvoiceUseCaseOutputDto } from './find-invoice.usecase.dto';

export default class FindInvoiceUseCase {

    private _invoiceRepository: InvoiceGateway;
    
    constructor(_invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = _invoiceRepository;
    }

    async execute(input: FindInvoiceUseCaseInputDto): Promise<FindInvoiceUseCaseOutputDto> {

        const invoice = await this._invoiceRepository.find(input.id);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            address: {
                street: invoice.address.street,
                number: invoice.address.number,
                complement: invoice.address.complement,
                city: invoice.address.city,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
            },
            items: invoice.items.map(item => {
                return {
                    id: item.id.id,
                    name: item.name,
                    price: item.price,
                };
            }),
            total: invoice.items.reduce((total, item) => total + item.price, 0),
            createdAt: invoice.createdAt,
        };
    }
}