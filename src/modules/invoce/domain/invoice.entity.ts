import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import AddressVO, { AddressProps } from "./address.vo";
import Product, { ProductProps } from "./product.entity";

type InvoceProps = {
    id?: Id;
    name : string;
    document: string;
    address: AddressProps;
    items: ProductProps[]
    createdAt?: Date;
    updatedAt?: Date;
};

export default class Invoice extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _document: string;
    private _address: AddressVO;
    private _items: Product[];

    constructor(props: InvoceProps) {
        super(props.id);
        this._name = props.name;
        this._document = props.document;
        this._address = new AddressVO(props.address);
        this._items = props.items
                            .map(item => new Product(item));
    }

    get name(): string {
        return this._name;
    }

    get document(): string {
        return this._document;
    }   

    get address(): AddressVO {      
        return this._address;
    }   
    
    get items(): Product[] {
        return this._items;
    }   
}