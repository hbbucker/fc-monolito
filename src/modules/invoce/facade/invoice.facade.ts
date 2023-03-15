import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";


export interface UseCasesProps {
    generate: UseCaseInterface;
    find: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {

    private _generateInvoiceUseCase: UseCaseInterface;
    private _findInvoiceUseCase: UseCaseInterface;

    constructor(usecasesProps: UseCasesProps) {
        this._generateInvoiceUseCase = usecasesProps.generate;
        this._findInvoiceUseCase = usecasesProps.find;
    }

    generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return this._generateInvoiceUseCase.execute(input);
    }
    
    find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
        return this._findInvoiceUseCase.execute(input);
    }
}